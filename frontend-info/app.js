// Elementos del DOM
const studentCountElement = document.getElementById('studentCount');
const contactButton = document.getElementById('contactButton');
const ctaButton = document.getElementById('ctaButton');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModal = document.getElementById('closeModal');
const contactForm = document.getElementById('contactForm');
const contactMessage = document.getElementById('contactMessage');
const popupMessage = document.getElementById('popupMessage');

// Configuración de API
const studentApiUrl = 'http://localhost:8081/api/students';
const API_TIMEOUT = 5000; // 5 segundos

// Funciones Utilitarias
function timeout(ms) {
  return new Promise((_, reject) => 
    setTimeout(() => reject(new Error('API timeout')), ms)
  );
}

async function fetchWithTimeout(url, options = {}) {
  try {
    const response = await Promise.race([
      fetch(url, options),
      timeout(API_TIMEOUT)
    ]);
    return response;
  } catch (error) {
    throw error;
  }
}

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

async function loadStudentCount() {
  try {
    console.log('🔄 Cargando datos de estudiantes...');
    
    const response = await fetchWithTimeout(studentApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const count = Array.isArray(data) ? data.length : (data.total || data.count || 0);
    
    // Animar el contador
    animateCounter(studentCountElement, count);
    console.log(`✅ Estudiantes cargados: ${count}`);
  } catch (error) {
    console.error('❌ Error al cargar estudiantes:', error.message);
    
    // Mostrar mensaje de error apropiado
    if (window.location.protocol === 'file:') {
      studentCountElement.textContent = '?';
      studentCountElement.parentElement.innerHTML += 
        '<p style="font-size: 0.75rem; color: #ea580c; margin-top: 8px;">⚠️ Abre por localhost:5052</p>';
    } else {
      studentCountElement.textContent = '—';
      studentCountElement.title = error.message;
      console.warn('💡 Verifica que user-service esté corriendo en http://localhost:8081');
    }
  }
}

function animateCounter(element, target) {
  let current = 0;
  const increment = Math.ceil(target / 30);
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = current;
    }
  }, 50);
}

// Modal Functions
function openModal() {
  modalBackdrop.classList.remove('page-hidden');
  contactMessage.textContent = '';
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  modalBackdrop.classList.add('page-hidden');
  document.body.style.overflow = 'auto';
}

function showPopup(message) {
  popupMessage.textContent = message;
  popupMessage.classList.remove('page-hidden');
  setTimeout(() => popupMessage.classList.add('page-hidden'), 4200);
}

function handleBackdropClick(event) {
  if (event.target === modalBackdrop) {
    hideModal();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  hideModal();
  contactForm.reset();
  showPopup('Gracias por confiar en nosotros, lo contactaremos dentro de los siguientes días.');
}

// Event Listeners
contactButton.addEventListener('click', openModal);
if (ctaButton) {
  ctaButton.addEventListener('click', openModal);
}
closeModal.addEventListener('click', hideModal);
modalBackdrop.addEventListener('click', handleBackdropClick);
contactForm.addEventListener('submit', handleSubmit);

// Keyboard shortcut to close modal
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideModal();
  }
});

// Inicialización
console.log(`ℹ️ Página accedida desde: ${window.location.protocol}//${window.location.host}`);
console.log(`ℹ️ Intentando conectar a API: ${studentApiUrl}`);

// Esperar a que el DOM esté completamente cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadStudentCount);
} else {
  loadStudentCount();
}
