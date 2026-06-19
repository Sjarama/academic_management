import { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { fetchAll } from '../api/client';
import { SERVICES } from '../config/services';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const PENDING = ['pending','pendiente','unpaid','deudor'];
const PAID    = ['paid','pagado','completado','pagada'];
const COLORS  = ['#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4','#f97316','#6366f1','#14b8a6','#a855f7','#84cc16','#ec4899'];

export default function Dashboard({ refreshKey }) {
  const [metrics, setMetrics]    = useState({ students: '…', courses: '…', pending: '…', current: '…' });
  const [pieData, setPieData]    = useState(null);
  const [barData, setBarData]    = useState(null);

  useEffect(() => {
    async function load() {
      const [students, courses, payments, teachers] = await Promise.all([
        fetchAll(SERVICES.students.url),
        fetchAll(SERVICES.courses.url),
        fetchAll(SERVICES.payments.url),
        fetchAll(SERVICES.teachers.url),
      ]);

      const tMap = teachers.reduce((a, t) => { a[t.id] = `${t.firstName} ${t.lastName}`; return a; }, {});
      const today = new Date();

      const groups = {};
      payments.forEach(p => {
        if (p.studentId == null) return;
        if (!groups[p.studentId]) groups[p.studentId] = [];
        groups[p.studentId].push(p);
      });

      const pendingIds = new Set();
      const currentIds = new Set();
      Object.entries(groups).forEach(([sid, pmts]) => {
        const hasPending = pmts.some(p => {
          const s = String(p.status ?? '').toLowerCase();
          const due = p.dueDate ? new Date(p.dueDate) : null;
          return PENDING.some(t => s.includes(t)) || (due && due < today && !PAID.some(t => s.includes(t)));
        });
        (hasPending ? pendingIds : currentIds).add(sid);
      });
      const noPayments = students.filter(s => !groups[s.id]).length;

      setMetrics({
        students: students.length,
        courses:  courses.length,
        pending:  pendingIds.size,
        current:  currentIds.size + noPayments,
      });

      const counts = {};
      students.forEach(s => {
        const c = String(s.comuna || 'Sin comuna').trim();
        counts[c] = (counts[c] || 0) + 1;
      });
      const comunaLabels = Object.keys(counts).sort((a,b) => counts[b] - counts[a]).slice(0,10);
      setPieData({
        labels: comunaLabels,
        datasets: [{ data: comunaLabels.map(l => counts[l]), backgroundColor: COLORS.slice(0, comunaLabels.length), borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }],
      });

      const entries = courses
        .filter(c => c.approvalPercentage != null)
        .map(c => ({ name: c.name || `Curso ${c.id}`, teacher: tMap[c.teacherId] || `Profesor ${c.teacherId}`, rep: Math.max(0, 100 - c.approvalPercentage) }))
        .sort((a,b) => b.rep - a.rep).slice(0,8);

      setBarData({
        labels: entries.map(e => e.name.length > 14 ? e.name.slice(0,13)+'…' : e.name),
        _entries: entries,
        datasets: [{
          label: '% Reprobación',
          data: entries.map(e => e.rep),
          backgroundColor: entries.map(e => e.rep >= 50 ? '#ef4444' : e.rep >= 30 ? '#f59e0b' : '#10b981'),
          borderRadius: 6,
          borderSkipped: false,
        }],
      });
    }
    load();
  }, [refreshKey]);

  return (
    <div className="dashboard">
      <div className="metrics-grid">
        {[
          { label:'Estudiantes',     value: metrics.students, icon:'👥', cls:'blue'   },
          { label:'Cursos',          value: metrics.courses,  icon:'📚', cls:'green'  },
          { label:'Pagos pendientes',value: metrics.pending,  icon:'⏳', cls:'amber'  },
          { label:'Estudiantes al día', value: metrics.current, icon:'✓', cls:'purple' },
        ].map(({ label, value, icon, cls }) => (
          <div className="metric-card" key={label}>
            <div className={`metric-icon ${cls}`}>{icon}</div>
            <div>
              <div className="metric-value">{value}</div>
              <div className="metric-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-title">Estudiantes por comuna</div>
          <div className="chart-canvas-wrapper">
            {pieData ? (
              <Doughnut data={pieData} options={{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'right', labels:{ font:{size:11}, boxWidth:10, padding:8, color:'#64748b' } } } }} />
            ) : <div className="chart-loading">Cargando...</div>}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-title">Cursos con mayor reprobación</div>
          <div className="chart-canvas-wrapper">
            {barData ? (
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: {
                      title: ctx => barData._entries[ctx[0].dataIndex]?.name || '',
                      afterBody: ctx => [`Profesor: ${barData._entries[ctx[0].dataIndex]?.teacher || '—'}`],
                    }},
                  },
                  scales: {
                    y: { beginAtZero:true, max:100, ticks:{ callback: v => v+'%', color:'#94a3b8', font:{size:11} }, grid:{ color:'#f1f5f9' } },
                    x: { ticks:{ color:'#94a3b8', font:{size:11} }, grid:{ display:false } },
                  },
                }}
              />
            ) : <div className="chart-loading">Cargando...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
