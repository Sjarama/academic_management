// ── CONFIGURACIÓN DE SERVICIOS ────────────────────────────────────
const SERVICES = {
  students: {
    title: 'Estudiantes',
    singular: 'Estudiante',
    url: 'http://localhost:8081/api/students',
    columns: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'comuna'],
    labels: {
      id: 'ID', firstName: 'Nombre', lastName: 'Apellido',
      email: 'Email', phone: 'Teléfono', address: 'Dirección', comuna: 'Comuna'
    },
    fields: [
      { name: 'firstName',  label: 'Nombre',    type: 'text' },
      { name: 'lastName',   label: 'Apellido',  type: 'text' },
      { name: 'email',      label: 'Email',     type: 'email' },
      { name: 'phone',      label: 'Teléfono',  type: 'text' },
      { name: 'address',    label: 'Dirección', type: 'text' },
      { name: 'comuna',     label: 'Comuna',    type: 'select-comunas' }
    ]
  },
  teachers: {
    title: 'Profesores',
    singular: 'Profesor',
    url: 'http://localhost:8081/api/teachers',
    columns: ['id', 'firstName', 'lastName', 'email', 'phone', 'address', 'specialty'],
    labels: {
      id: 'ID', firstName: 'Nombre', lastName: 'Apellido',
      email: 'Email', phone: 'Teléfono', address: 'Dirección', specialty: 'Especialidad'
    },
    fields: [
      { name: 'firstName', label: 'Nombre',       type: 'text' },
      { name: 'lastName',  label: 'Apellido',     type: 'text' },
      { name: 'email',     label: 'Email',        type: 'email' },
      { name: 'phone',     label: 'Teléfono',     type: 'text' },
      { name: 'address',   label: 'Dirección',    type: 'text' },
      { name: 'specialty', label: 'Especialidad', type: 'text' }
    ]
  },
  courses: {
    title: 'Cursos',
    singular: 'Curso',
    url: 'http://localhost:8082/api/courses',
    columns: ['id', 'name', 'description', 'teacherId', 'credits', 'maxStudents', 'approvalPercentage'],
    labels: {
      id: 'ID', name: 'Nombre', description: 'Descripción',
      teacherId: 'ID Profesor', credits: 'Créditos',
      maxStudents: 'Máx. Est.', approvalPercentage: '% Aprobación'
    },
    fields: [
      { name: 'name',               label: 'Nombre del curso',              type: 'text' },
      { name: 'description',        label: 'Descripción',                   type: 'textarea' },
      { name: 'teacherId',          label: 'ID Profesor',                   type: 'number' },
      { name: 'credits',            label: 'Créditos',                      type: 'number' },
      { name: 'maxStudents',        label: 'Máximo de estudiantes',         type: 'number' },
      { name: 'approvalPercentage', label: 'Porcentaje de aprobación (1-100)', type: 'number', min: 1, max: 100 }
    ]
  },
  payments: {
    title: 'Pagos',
    singular: 'Pago',
    url: 'http://localhost:8083/api/payments',
    columns: ['id', 'studentId', 'amount', 'status', 'dueDate'],
    labels: {
      id: 'ID', studentId: 'ID Estudiante', amount: 'Monto', status: 'Estado', dueDate: 'Vencimiento'
    },
    fields: [
      { name: 'studentId', label: 'ID Estudiante',        type: 'number' },
      { name: 'amount',    label: 'Monto',                type: 'number', step: '0.01' },
      { name: 'status',    label: 'Estado',               type: 'text' },
      { name: 'dueDate',   label: 'Fecha de vencimiento', type: 'date' }
    ]
  },
  notifications: {
    title: 'Notificaciones',
    singular: 'Notificación',
    url: 'http://localhost:8084/api/notifications',
    columns: ['id', 'recipient', 'message', 'type', 'sent'],
    labels: {
      id: 'ID', recipient: 'Destinatario', message: 'Mensaje', type: 'Tipo', sent: 'Enviado'
    },
    fields: [
      { name: 'recipient', label: 'Destinatario', type: 'text' },
      { name: 'message',   label: 'Mensaje',      type: 'textarea' },
      { name: 'type',      label: 'Tipo',         type: 'text' },
      { name: 'sent',      label: 'Enviado',      type: 'checkbox' }
    ]
  }
};

// ── ESTADO GLOBAL ─────────────────────────────────────────────────
let currentPage = 'dashboard';
let pageData    = {};
let modalPage   = null;
let comunasCache = null;
let pieChart    = null;
let barChart    = null;

const $ = id => document.getElementById(id);

// ── INIT ──────────────────────────────────────────────────────────
function init() {
  $('sidebar-nav').addEventListener('click', e => {
    const li = e.target.closest('li[data-page]');
    if (li) navigate(li.dataset.page);
  });

  $('btn-refresh').addEventListener('click', () => {
    if (currentPage === 'dashboard') renderDashboard();
    else loadPage(currentPage);
  });

  $('btn-new').addEventListener('click', () => openModal(currentPage, null));
  $('btn-export').addEventListener('click', () => exportData(currentPage));

  $('modal-close').addEventListener('click', closeModal);
  $('modal-cancel').addEventListener('click', closeModal);
  $('modal-overlay').addEventListener('click', e => {
    if (e.target === $('modal-overlay')) closeModal();
  });
  $('modal-submit').addEventListener('click', submitModal);

  navigate('dashboard');
}

// ── NAVEGACIÓN ────────────────────────────────────────────────────
const PAGE_TITLES = {
  dashboard: 'Dashboard', students: 'Estudiantes', teachers: 'Profesores',
  courses: 'Cursos', payments: 'Pagos', notifications: 'Notificaciones'
};

function navigate(page) {
  currentPage = page;

  document.querySelectorAll('#sidebar-nav li').forEach(li => {
    li.classList.toggle('active', li.dataset.page === page);
  });

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  $(`page-${page}`).classList.add('active');

  $('topbar-title').textContent = PAGE_TITLES[page] || page;

  const isCrud = page !== 'dashboard';
  $('btn-new').classList.toggle('hidden', !isCrud);
  $('btn-export').classList.toggle('hidden', !isCrud);

  if (page === 'dashboard') renderDashboard();
  else loadPage(page);
}

// ── CARGA DE DATOS ────────────────────────────────────────────────
async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function loadPage(page) {
  const svc = SERVICES[page];
  const wrapper = $(`table-${page}`);
  wrapper.innerHTML = buildLoadingRow(svc.columns.length + 1);

  const data = await fetchJSON(svc.url);
  pageData[page] = Array.isArray(data) ? data : [];

  if (!pageData[page].length) {
    wrapper.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>No hay ${svc.title.toLowerCase()} registrados</p>
      </div>`;
    return;
  }

  renderTable(page, pageData[page]);
}

function buildLoadingRow(cols) {
  return `<table><tbody><tr class="loading-row"><td colspan="${cols}">Cargando datos...</td></tr></tbody></table>`;
}

// ── TABLA ─────────────────────────────────────────────────────────
function renderTable(page, items) {
  const svc = SERVICES[page];
  const cols = svc.columns;

  const thead = `<thead><tr>
    ${cols.map(c => `<th>${svc.labels[c] || c}</th>`).join('')}
    <th style="width:90px">Acciones</th>
  </tr></thead>`;

  const tbody = `<tbody>${items.map(item => `
    <tr>
      ${cols.map(col => `<td title="${item[col] ?? ''}">${renderCell(col, item[col])}</td>`).join('')}
      <td>
        <div style="display:flex;gap:5px">
          <button class="btn btn-secondary btn-sm btn-icon"
            onclick="openModal('${page}', ${item.id})" title="Editar">✏️</button>
          <button class="btn btn-danger btn-sm btn-icon"
            onclick="confirmDelete('${page}', ${item.id})" title="Eliminar">🗑️</button>
        </div>
      </td>
    </tr>`).join('')}
  </tbody>`;

  $(`table-${page}`).innerHTML = `<table>${thead}${tbody}</table>`;
}

function renderCell(col, val) {
  if (val === null || val === undefined || val === '') return '<span style="color:#cbd5e1">—</span>';

  if (col === 'status') {
    const s = String(val).toLowerCase();
    const isPending = ['pending', 'pendiente', 'unpaid', 'deudor'].some(t => s.includes(t));
    const isPaid    = ['paid', 'pagado', 'completado', 'pagada'].some(t => s.includes(t));
    if (isPending) return `<span class="badge badge-red">⚠ ${val}</span>`;
    if (isPaid)    return `<span class="badge badge-green">✓ ${val}</span>`;
    return `<span class="badge badge-yellow">${val}</span>`;
  }

  if (col === 'sent') {
    return val
      ? `<span class="badge badge-green">Sí</span>`
      : `<span class="badge badge-gray">No</span>`;
  }

  if (col === 'approvalPercentage') {
    const n = Number(val);
    const cls = n >= 70 ? 'badge-green' : n >= 50 ? 'badge-yellow' : 'badge-red';
    return `<span class="badge ${cls}">${val}%</span>`;
  }

  if (col === 'amount') {
    return `$${Number(val).toLocaleString('es-CL')}`;
  }

  return String(val);
}

// ── MODAL ─────────────────────────────────────────────────────────
async function openModal(page, id) {
  modalPage = page;
  const svc  = SERVICES[page];
  const item = id != null ? (pageData[page] || []).find(x => x.id === id) : null;

  $('modal-title').textContent = item
    ? `Editar ${svc.singular}`
    : `Nuevo ${svc.singular}`;
  $('modal-id').value = item ? item.id : '';

  const container = $('modal-fields');
  container.innerHTML = '';

  for (const field of svc.fields) {
    if (field.type === 'checkbox') {
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <div class="form-checkbox">
          <input type="checkbox" id="mf-${field.name}" name="${field.name}"
            ${item && item[field.name] ? 'checked' : ''}>
          <label for="mf-${field.name}">${field.label}</label>
        </div>`;
      container.appendChild(div);
      continue;
    }

    const div = document.createElement('div');
    div.className = 'form-group';
    const label = `<label for="mf-${field.name}">${field.label}</label>`;
    let input = '';

    if (field.type === 'textarea') {
      input = `<textarea id="mf-${field.name}" name="${field.name}"
        placeholder="${field.label}">${item && item[field.name] != null ? item[field.name] : ''}</textarea>`;

    } else if (field.type === 'select-comunas') {
      const comunas = await loadComunas();
      const opts = [`<option value="">Sin comuna</option>`,
        ...comunas.map(c => `<option value="${c}" ${item && item.comuna === c ? 'selected' : ''}>${c}</option>`)
      ].join('');
      input = `<select id="mf-${field.name}" name="${field.name}">${opts}</select>`;

    } else {
      const extras = [
        field.min  != null ? `min="${field.min}"`   : '',
        field.max  != null ? `max="${field.max}"`   : '',
        field.step != null ? `step="${field.step}"` : ''
      ].filter(Boolean).join(' ');
      const val = item && item[field.name] != null ? item[field.name] : '';
      input = `<input type="${field.type}" id="mf-${field.name}" name="${field.name}"
        value="${val}" placeholder="${field.label}" ${extras}>`;
    }

    div.innerHTML = label + input;
    container.appendChild(div);
  }

  $('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  $('modal-overlay').classList.add('hidden');
  modalPage = null;
}

async function submitModal() {
  const page = modalPage;
  const svc  = SERVICES[page];
  const id   = $('modal-id').value.trim();
  const payload = {};

  for (const field of svc.fields) {
    const el = $(`mf-${field.name}`);
    if (!el) continue;

    if (field.type === 'checkbox') {
      payload[field.name] = el.checked;
    } else if (field.type === 'number') {
      const v = el.value.trim();
      payload[field.name] = v === '' ? null
        : field.step === '0.01' ? parseFloat(v) : parseInt(v, 10);
    } else {
      const v = el.value.trim();
      payload[field.name] = v || null;
    }
  }

  if (page === 'courses') {
    const ap = payload.approvalPercentage;
    if (!ap || ap < 1 || ap > 100) {
      toast('El porcentaje de aprobación debe estar entre 1 y 100', 'error');
      return;
    }
  }

  const method = id ? 'PUT' : 'POST';
  const url    = id ? `${svc.url}/${id}` : svc.url;

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      toast(id ? 'Registro actualizado correctamente' : 'Registro creado correctamente', 'success');
      closeModal();
      loadPage(page);
    } else {
      const msg = await res.text();
      toast(`Error del servidor: ${msg}`, 'error');
    }
  } catch {
    toast('No se pudo conectar con el servicio', 'error');
  }
}

async function confirmDelete(page, id) {
  if (!confirm(`¿Eliminar registro #${id}? Esta acción no se puede deshacer.`)) return;
  const svc = SERVICES[page];
  try {
    const res = await fetch(`${svc.url}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast(`Registro #${id} eliminado`, 'success');
      loadPage(page);
    } else {
      toast('No se pudo eliminar el registro', 'error');
    }
  } catch {
    toast('Error de conexión', 'error');
  }
}

// ── COMUNAS ───────────────────────────────────────────────────────
const DEFAULT_COMUNAS = [
  'Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú',
  'La Florida', 'Puente Alto', 'Vitacura', 'La Reina', 'Peñalolén',
  'San Miguel', 'Macul', 'Cerrillos', 'Conchalí', 'Renca'
];

async function loadComunas() {
  if (comunasCache) return comunasCache;
  try {
    const res = await fetch('http://localhost:8081/api/students/comunas');
    if (res.ok) { comunasCache = await res.json(); return comunasCache; }
  } catch { /* usa defaults */ }
  comunasCache = DEFAULT_COMUNAS;
  return comunasCache;
}

// ── TOAST ─────────────────────────────────────────────────────────
function toast(message, type = 'info') {
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const container = $('toast-container');
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  div.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
  container.appendChild(div);
  setTimeout(() => div.remove(), 3500);
}

// ── DASHBOARD ─────────────────────────────────────────────────────
async function renderDashboard() {
  $('m-students').textContent = '…';
  $('m-courses').textContent  = '…';
  $('m-pending').textContent  = '…';
  $('m-current').textContent  = '…';

  const [students, courses, payments, teachers] = await Promise.all([
    fetchJSON('http://localhost:8081/api/students'),
    fetchJSON('http://localhost:8082/api/courses'),
    fetchJSON('http://localhost:8083/api/payments'),
    fetchJSON('http://localhost:8081/api/teachers')
  ]);

  const validStudents  = Array.isArray(students)  ? students  : [];
  const validCourses   = Array.isArray(courses)   ? courses   : [];
  const validPayments  = Array.isArray(payments)  ? payments  : [];
  const validTeachers  = Array.isArray(teachers)  ? teachers  : [];

  const teachersMap = validTeachers.reduce((acc, t) => {
    acc[t.id] = `${t.firstName} ${t.lastName}`;
    return acc;
  }, {});

  const today        = new Date();
  const pendingTerms = ['pending', 'pendiente', 'unpaid', 'deudor'];
  const paidTerms    = ['paid', 'pagado', 'completado', 'pagada'];

  const paymentGroups = {};
  validPayments.forEach(p => {
    if (p.studentId == null) return;
    if (!paymentGroups[p.studentId]) paymentGroups[p.studentId] = [];
    paymentGroups[p.studentId].push(p);
  });

  const pendingIds = new Set();
  const currentIds = new Set();
  Object.entries(paymentGroups).forEach(([sid, pmts]) => {
    const hasPending = pmts.some(p => {
      const s   = String(p.status ?? '').toLowerCase();
      const due = p.dueDate ? new Date(p.dueDate) : null;
      return pendingTerms.some(t => s.includes(t))
        || (due && due < today && !paidTerms.some(t => s.includes(t)));
    });
    (hasPending ? pendingIds : currentIds).add(sid);
  });

  const noPayments = validStudents.filter(s => !paymentGroups[s.id]).length;

  $('m-students').textContent = validStudents.length;
  $('m-courses').textContent  = validCourses.length;
  $('m-pending').textContent  = pendingIds.size;
  $('m-current').textContent  = currentIds.size + noPayments;

  renderPieChart(validStudents);
  renderBarChart(validCourses, teachersMap);
}

function renderPieChart(students) {
  const counts = {};
  students.forEach(s => {
    const c = String(s.comuna || 'Sin comuna').trim();
    counts[c] = (counts[c] || 0) + 1;
  });
  const labels = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const data   = labels.map(l => counts[l]);
  const colors = [
    '#3b82f6','#10b981','#f59e0b','#8b5cf6','#ef4444',
    '#06b6d4','#f97316','#6366f1','#14b8a6','#a855f7',
    '#84cc16','#ec4899'
  ];

  if (pieChart) pieChart.destroy();
  pieChart = new Chart($('pieChart').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, labels.length),
        borderWidth: 2,
        borderColor: '#fff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { font: { size: 11 }, boxWidth: 10, padding: 8, color: '#64748b' }
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.raw} estudiante${ctx.raw !== 1 ? 's' : ''}`
          }
        }
      }
    }
  });
}

function renderBarChart(courses, teachersMap) {
  const entries = courses
    .filter(c => c.approvalPercentage != null)
    .map(c => ({
      name:       c.name || `Curso ${c.id}`,
      teacher:    teachersMap[c.teacherId] || `Profesor ${c.teacherId}`,
      reprobacion: Math.max(0, 100 - c.approvalPercentage)
    }))
    .sort((a, b) => b.reprobacion - a.reprobacion)
    .slice(0, 8);

  const labels = entries.map(e => e.name.length > 16 ? e.name.slice(0, 15) + '…' : e.name);

  if (barChart) barChart.destroy();
  barChart = new Chart($('barChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: '% Reprobación',
        data: entries.map(e => e.reprobacion),
        backgroundColor: entries.map(e =>
          e.reprobacion >= 50 ? '#ef4444' : e.reprobacion >= 30 ? '#f59e0b' : '#10b981'
        ),
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: ctx => entries[ctx[0].dataIndex]?.name || '',
            afterBody: ctx => [`Profesor: ${entries[ctx[0].dataIndex]?.teacher || '—'}`]
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: v => v + '%', color: '#94a3b8', font: { size: 11 } },
          grid: { color: '#f1f5f9' }
        },
        x: {
          ticks: { color: '#94a3b8', font: { size: 11 } },
          grid: { display: false }
        }
      }
    }
  });
}

// ── EXPORTAR ──────────────────────────────────────────────────────
async function exportData(page) {
  const data = pageData[page];
  if (!data || !data.length) {
    toast('No hay datos para exportar', 'error');
    return;
  }
  const svc = SERVICES[page];
  let rows  = [];

  if (page === 'courses') {
    const teachers = await fetchJSON('http://localhost:8081/api/teachers');
    const tMap = teachers.reduce((a, t) => { a[t.id] = `${t.firstName} ${t.lastName}`; return a; }, {});
    rows = [['ID','Nombre','Descripción','Profesor','Créditos','Máx. Est.','% Aprobación','% Reprobación']];
    data.forEach(c => rows.push([
      c.id, c.name, c.description,
      tMap[c.teacherId] || c.teacherId,
      c.credits, c.maxStudents, c.approvalPercentage,
      c.approvalPercentage != null ? 100 - c.approvalPercentage : '—'
    ]));

  } else if (page === 'students') {
    const pmts = await fetchJSON('http://localhost:8083/api/payments');
    const today = new Date();
    const pending = ['pending','pendiente','unpaid','deudor'];
    const paid    = ['paid','pagado','completado','pagada'];
    rows = [['ID','Nombre','Email','Comuna','Estado matrícula']];
    data.forEach(s => {
      const sp = pmts.filter(p => String(p.studentId) === String(s.id));
      const hasPending = sp.some(p => {
        const st  = String(p.status ?? '').toLowerCase();
        const due = p.dueDate ? new Date(p.dueDate) : null;
        return pending.some(t => st.includes(t)) || (due && due < today && !paid.some(t => st.includes(t)));
      });
      rows.push([s.id, `${s.firstName} ${s.lastName}`, s.email, s.comuna || '—', hasPending ? 'Pendiente' : 'Al día']);
    });

  } else if (page === 'teachers') {
    const courses = await fetchJSON('http://localhost:8082/api/courses');
    const tCourses = {};
    courses.forEach(c => {
      const k = String(c.teacherId);
      if (!tCourses[k]) tCourses[k] = [];
      tCourses[k].push(c.name);
    });
    rows = [['ID','Nombre','Email','Especialidad','Cursos a cargo']];
    data.forEach(t => rows.push([
      t.id, `${t.firstName} ${t.lastName}`, t.email, t.specialty || '—',
      (tCourses[String(t.id)] || []).join('; ') || '—'
    ]));

  } else if (page === 'payments') {
    const students = await fetchJSON('http://localhost:8081/api/students');
    const sMap = students.reduce((a, s) => { a[s.id] = `${s.firstName} ${s.lastName}`; return a; }, {});
    rows = [['ID','Estudiante','Monto','Estado','Vencimiento']];
    data.forEach(p => rows.push([
      p.id, sMap[p.studentId] || `Estudiante ${p.studentId}`,
      p.amount, p.status, p.dueDate || '—'
    ]));

  } else {
    const headers = svc.columns.map(c => svc.labels[c] || c);
    rows = [headers, ...data.map(item => svc.columns.map(c => item[c] ?? ''))];
  }

  const esc = v => String(v ?? '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${svc.title}</title></head><body>
    <table border="1">${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>
  </body></html>`;

  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([html], { type: 'application/vnd.ms-excel' }));
  a.download = `reporte-${svc.title.toLowerCase()}.xls`;
  a.click();
  URL.revokeObjectURL(a.href);
  toast(`Reporte de ${svc.title} exportado correctamente`, 'success');
}

// ── ARRANQUE ──────────────────────────────────────────────────────
init();
