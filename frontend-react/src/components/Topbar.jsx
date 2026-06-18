import './Topbar.css';

const PAGE_TITLES = {
  dashboard: 'Dashboard', students: 'Estudiantes', teachers: 'Profesores',
  courses: 'Cursos', payments: 'Pagos', notifications: 'Notificaciones',
};

export default function Topbar({ currentPage, onRefresh, onNew, onExport, onMenuToggle }) {
  const isCrud = currentPage !== 'dashboard';
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="btn btn-icon btn-secondary topbar-hamburger" onClick={onMenuToggle} aria-label="Abrir menú">
          ☰
        </button>
        <span className="topbar-title">{PAGE_TITLES[currentPage] || currentPage}</span>
      </div>
      <div className="topbar-actions">
        <button className="btn btn-secondary btn-sm" onClick={onRefresh}>
          <span>↺</span><span className="btn-label"> Actualizar</span>
        </button>
        {isCrud && (
          <button className="btn btn-secondary btn-sm" onClick={onExport}>
            <span>↓</span><span className="btn-label"> Excel</span>
          </button>
        )}
        {isCrud && (
          <button className="btn btn-primary btn-sm" onClick={onNew}>
            <span>+</span><span className="btn-label"> Nuevo</span>
          </button>
        )}
      </div>
    </header>
  );
}
