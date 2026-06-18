import { useState, useEffect } from 'react';
import heroImg from '../b1.jpg';
import './App.css';

const STUDENT_API = 'http://localhost:8081/api/students';

const FEATURES = [
  { icon: '👥', title: 'Gestión de Estudiantes', desc: 'Registra y administra estudiantes con datos completos, estado de matrícula y seguimiento individual.' },
  { icon: '👨‍🏫', title: 'Control de Profesores', desc: 'Gestiona la planta docente, asignación de cursos y seguimiento de actividad académica.' },
  { icon: '📚', title: 'Administración de Cursos', desc: 'Crea y configura cursos con métricas de reprobación y porcentaje de aprobación en tiempo real.' },
  { icon: '💳', title: 'Seguimiento de Pagos', desc: 'Controla el estado de matrículas y pagos de cada estudiante con historial detallado.' },
  { icon: '🔔', title: 'Notificaciones Internas', desc: 'Sistema de alertas y avisos para mantener informada a toda la comunidad educativa.' },
  { icon: '📊', title: 'Dashboard Analítico', desc: 'Visualiza métricas clave con gráficos interactivos: matrículas, reprobaciones y más.' },
];

const FORM_FIELDS = [
  { name: 'fullName',      label: 'Nombre completo',              type: 'text',  placeholder: 'Nombre completo' },
  { name: 'email',         label: 'Correo electrónico',           type: 'email', placeholder: 'correo@ejemplo.com' },
  { name: 'phone',         label: 'Número de contacto',           type: 'tel',   placeholder: '+56 9 1234 5678' },
  { name: 'schoolNumber',  label: 'Número / código del colegio',  type: 'text',  placeholder: 'Código o teléfono del colegio' },
  { name: 'teachingYear',  label: 'Año de enseñanza',             type: 'text',  placeholder: '1° básico, 4° medio…' },
  { name: 'comuna',        label: 'Comuna',                       type: 'text',  placeholder: 'Comuna del establecimiento' },
  { name: 'role',          label: 'Cargo en el establecimiento',  type: 'text',  placeholder: 'Director, coordinador, profesor…', full: true },
];

function ContactModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 2800);
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div>
            <h2 id="modal-title">Contáctanos</h2>
            <p>Déjanos tus datos y te contactaremos pronto.</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        {submitted ? (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <h3>¡Mensaje enviado!</h3>
            <p>Gracias por confiar en nosotros. Te contactaremos dentro de los próximos días hábiles.</p>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              {FORM_FIELDS.filter(f => !f.full).map(({ name, label, type, placeholder }) => (
                <label key={name} className="form-field">
                  <span>{label}</span>
                  <input type={type} name={name} required placeholder={placeholder} />
                </label>
              ))}
            </div>
            {FORM_FIELDS.filter(f => f.full).map(({ name, label, type, placeholder }) => (
              <label key={name} className="form-field form-field--full">
                <span>{label}</span>
                <input type={type} name={name} required placeholder={placeholder} />
              </label>
            ))}
            <button type="submit" className="btn btn-primary btn-full">
              Enviar consulta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [studentCount, setStudentCount] = useState(null);
  const [showModal, setShowModal]       = useState(false);

  useEffect(() => {
    fetch(STUDENT_API, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(data => {
        const count = Array.isArray(data) ? data.length : (data.total ?? data.count ?? 0);
        setStudentCount(count);
      })
      .catch(() => setStudentCount('—'));
  }, []);

  useEffect(() => {
    if (showModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  return (
    <div className="page-shell">
      {/* Header */}
      <header className="topbar">
        <div className="brand-group">
          <span className="brand-emoji">🎓</span>
          <div>
            <div className="brand">AcadémIA</div>
            <div className="tagline">Sistema de Gestión Académica</div>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Contáctanos
        </button>
      </header>

      <main>
        {/* Stats */}
        <section className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{studentCount ?? '...'}</span>
            <span className="stat-label">Estudiantes registrados</span>
          </div>
          <div className="stat-sep" />
          <div className="stat-item">
            <span className="stat-value">4</span>
            <span className="stat-label">Microservicios activos</span>
          </div>
          <div className="stat-sep" />
          <div className="stat-item">
            <span className="stat-value">6</span>
            <span className="stat-label">Módulos disponibles</span>
          </div>
        </section>

        {/* Hero */}
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Bienvenido</p>
            <h1>Gestiona tu institución con inteligencia</h1>
            <p>Academic Management centraliza toda la administración escolar en un solo lugar. Estudiantes, profesores, cursos, pagos y notificaciones — sin complicaciones.</p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Solicitar demo
              </button>
              <a href="http://localhost:5173" className="btn btn-outline">
                Ver dashboard →
              </a>
            </div>
          </div>
          <div
            className="hero-image"
            role="img"
            aria-label="Vista del dashboard académico"
            style={{ backgroundImage: `url(${heroImg})` }}
          />
        </section>

        {/* Features */}
        <section className="section">
          <div className="section-header">
            <p className="eyebrow">Módulos</p>
            <h2>Todo lo que necesita tu institución</h2>
            <p>Una plataforma completa para digitalizar la gestión de tu colegio o establecimiento educativo.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map(({ icon, title, desc }) => (
              <article className="feature-card" key={title}>
                <div className="feature-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
          <p className="eyebrow eyebrow--light">¿Listo para empezar?</p>
          <h2>Transforma la gestión de tu institución hoy</h2>
          <p>Únete a los colegios que ya digitalizaron su administración académica con AcadémIA.</p>
          <button className="btn btn-cta btn-lg" onClick={() => setShowModal(true)}>
            Comenzar ahora
          </button>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} AcadémIA — Sistema de Gestión Académica</p>
      </footer>

      {showModal && <ContactModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
