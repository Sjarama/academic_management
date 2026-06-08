const studentCountElement = document.getElementById('studentCount');
const contactButton = document.getElementById('contactButton');
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModal = document.getElementById('closeModal');
const contactForm = document.getElementById('contactForm');
const contactMessage = document.getElementById('contactMessage');
const popupMessage = document.getElementById('popupMessage');
const studentApiUrl = 'http://localhost:8081/api/students';

async function loadStudentCount() {
  try {
    const response = await fetch(studentApiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error al consultar la API: ${response.status}`);
    }

    const data = await response.json();
    const count = Array.isArray(data) ? data.length : (data.total || data.count || 0);
    studentCountElement.textContent = count;
  } catch (error) {
    console.error(error);
    studentCountElement.textContent = 'No disponible';
  }
}

function openModal() {
  modalBackdrop.classList.remove('page-hidden');
  contactMessage.textContent = '';
}

function hideModal() {
  modalBackdrop.classList.add('page-hidden');
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

contactButton.addEventListener('click', openModal);
closeModal.addEventListener('click', hideModal);
modalBackdrop.addEventListener('click', handleBackdropClick);
contactForm.addEventListener('submit', handleSubmit);

loadStudentCount();
