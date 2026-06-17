import './Topbar.css';

const PAGE_TITLES = {
  dashboard: 'Dashboard', students: 'Estudiantes', teachers: 'Profesores',
  courses: 'Cursos', payments: 'Pagos', notifications: 'Notificaciones',
};

export default function Topbar({ currentPage, onRefresh, onNew, onExport }) {
  const isCrud = currentPage !== 'dashboard';
  return (
    <header className="topbar">
      <span className="topbar-title">{PAGE_TITLES[currentPage] || currentPage}</span>
      <div className="topbar-actions">
        <button className="btn btn-secondary btn-sm" onClick={onRefresh}>↺ Actualizar</button>
        {isCrud && <button className="btn btn-secondary btn-sm" onClick={onExport}>↓ Exportar Excel</button>}
        {isCrud && <button className="btn btn-primary btn-sm" onClick={onNew}>+ Nuevo</button>}
      </div>
    </header>
  );
}
