import './Sidebar.css';

const NAV_ITEMS = [
  { page: 'dashboard',      label: 'Dashboard',       icon: '🏠' },
  { page: 'students',       label: 'Estudiantes',     icon: '👥' },
  { page: 'teachers',       label: 'Profesores',      icon: '👨‍🏫' },
  { page: 'courses',        label: 'Cursos',          icon: '📚' },
  { page: 'payments',       label: 'Pagos',           icon: '💳' },
  { page: 'notifications',  label: 'Notificaciones',  icon: '🔔' },
];

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-title">🎓 AcadémIA</div>
        <div className="sidebar-logo-sub">Gestión Académica</div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Menú</div>
        <nav>
          {NAV_ITEMS.map(({ page, label, icon }) => (
            <button
              key={page}
              className={`sidebar-item ${currentPage === page ? 'active' : ''}`}
              onClick={() => onNavigate(page)}
            >
              <span className="sidebar-item-icon">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
