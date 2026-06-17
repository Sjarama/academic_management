import './DataTable.css';

const PENDING = ['pending','pendiente','unpaid','deudor'];
const PAID    = ['paid','pagado','completado','pagada'];

function renderCell(col, val) {
  if (val === null || val === undefined || val === '') return <span className="cell-empty">—</span>;

  if (col === 'status') {
    const s = String(val).toLowerCase();
    if (PENDING.some(t => s.includes(t))) return <span className="badge badge-red">⚠ {val}</span>;
    if (PAID.some(t => s.includes(t)))    return <span className="badge badge-green">✓ {val}</span>;
    return <span className="badge badge-yellow">{val}</span>;
  }
  if (col === 'sent') return val
    ? <span className="badge badge-green">Sí</span>
    : <span className="badge badge-gray">No</span>;

  if (col === 'approvalPercentage') {
    const n = Number(val);
    const cls = n >= 70 ? 'badge-green' : n >= 50 ? 'badge-yellow' : 'badge-red';
    return <span className={`badge ${cls}`}>{val}%</span>;
  }
  if (col === 'amount') return `$${Number(val).toLocaleString('es-CL')}`;
  return String(val);
}

export default function DataTable({ svc, data, onEdit, onDelete }) {
  if (!data) {
    return <div className="table-state">Cargando datos...</div>;
  }
  if (!data.length) {
    return (
      <div className="table-state empty">
        <div className="empty-icon">📋</div>
        <p>No hay {svc.title.toLowerCase()} registrados</p>
      </div>
    );
  }

  const cols = svc.columns;
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {cols.map(c => <th key={c}>{svc.labels[c] || c}</th>)}
            <th style={{ width: 90 }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              {cols.map(col => (
                <td key={col} title={String(item[col] ?? '')}>
                  {renderCell(col, item[col])}
                </td>
              ))}
              <td>
                <div className="row-actions">
                  <button className="btn btn-secondary btn-sm btn-icon" onClick={() => onEdit(item)} title="Editar">✏️</button>
                  <button className="btn btn-danger btn-sm btn-icon"   onClick={() => onDelete(item.id)} title="Eliminar">🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
