const API_URL = '/api';

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');
const userGreeting = document.getElementById('user-greeting');
const btnLogout = document.getElementById('btn-logout');
const eventsGrid = document.getElementById('events-grid');
const btnShowCreate = document.getElementById('btn-show-create');
const eventFormPanel = document.getElementById('event-form-panel');
const btnCancelEvent = document.getElementById('btn-cancel-event');
const formEvent = document.getElementById('form-event');
const eventFormTitle = document.getElementById('event-form-title');

// State
let currentUser = null;
let currentToken = localStorage.getItem('token');
let myRegistrations = []; // Formato: { eventId, registrationId }
let allEvents = [];

// === Initialization ===
function init() {
  if (currentToken) {
    showDashboard();
    fetchEvents();
    fetchMyRegistrations();
  } else {
    showAuth();
  }
}

// === UI Navigation ===
function showAuth() {
  authSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
}

function showDashboard() {
  authSection.classList.add('hidden');
  dashboardSection.classList.remove('hidden');
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    userGreeting.textContent = `Olá, ${currentUser.name}`;
  }
}

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  formLogin.classList.remove('hidden');
  formRegister.classList.add('hidden');
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  formRegister.classList.remove('hidden');
  formLogin.classList.add('hidden');
});

btnShowCreate.addEventListener('click', () => {
  openEventForm();
});

btnCancelEvent.addEventListener('click', () => {
  eventFormPanel.classList.add('hidden');
  formEvent.reset();
});

btnLogout.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentToken = null;
  currentUser = null;
  showAuth();
});

// === Toast Notifications ===
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// === API Calls ===

// Auth: Login
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      currentToken = data.token;
      showToast('Login realizado com sucesso!');
      formLogin.reset();
      showDashboard();
      fetchEvents();
      fetchMyRegistrations();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast('Erro de conexão com o servidor', 'error');
  }
});

// Auth: Register
formRegister.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      currentToken = data.token;
      showToast('Conta criada com sucesso!');
      formRegister.reset();
      showDashboard();
      fetchEvents();
      fetchMyRegistrations();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast('Erro de conexão com o servidor', 'error');
  }
});

// Fetch My Registrations
async function fetchMyRegistrations() {
  try {
    const res = await fetch(`${API_URL}/registrations/my`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (res.ok) {
      const data = await res.json();
      myRegistrations = data.registrations.map(r => ({
        eventId: r.event._id,
        registrationId: r._id
      }));
      renderEvents();
    }
  } catch (err) {
    console.error('Error fetching registrations:', err);
  }
}

// Fetch Events
async function fetchEvents() {
  eventsGrid.innerHTML = `<div class="empty-state"><div class="spinner"></div><p>Carregando eventos...</p></div>`;
  try {
    const res = await fetch(`${API_URL}/events`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (res.ok) {
      const data = await res.json();
      allEvents = data.events;
      renderEvents();
    } else if (res.status === 401) {
      btnLogout.click();
    }
  } catch (err) {
    eventsGrid.innerHTML = `<div class="empty-state"><p style="color:var(--danger)">Erro ao carregar eventos.</p></div>`;
  }
}

// Render Events
function renderEvents() {
  if (allEvents.length === 0) {
    eventsGrid.innerHTML = `<div class="empty-state"><p>Nenhum evento encontrado.</p></div>`;
    return;
  }

  eventsGrid.innerHTML = allEvents.map(event => {
    // Corrige fuso horário para exibição
    const date = new Date(event.date).toLocaleString('pt-BR');
    const isOwner = currentUser && event.organizer && event.organizer._id === currentUser._id;
    const registration = myRegistrations.find(r => r.eventId === event._id);
    
    let actionBtn = '';
    
    if (isOwner) {
      actionBtn = `
        <button data-action="edit" data-id="${event._id}" class="btn btn-secondary btn-sm">Editar</button>
        <button data-action="delete" data-id="${event._id}" class="btn btn-outline-danger btn-sm">Deletar</button>
      `;
    } else if (registration) {
      actionBtn = `<button data-action="cancel-reg" data-id="${registration.registrationId}" class="btn btn-secondary btn-sm">Cancelar Inscrição</button>`;
    } else {
      actionBtn = `<button data-action="register" data-id="${event._id}" class="btn btn-primary btn-sm">Inscrever-se</button>`;
    }

    return `
      <div class="event-card">
        <span class="event-category">${event.category}</span>
        <h3 class="event-title">${event.title}</h3>
        <div class="event-meta">
          <span>📅 ${date}</span>
          <span>📍 ${event.location}</span>
          <span>👥 Vagas: ${event.maxParticipants}</span>
          <span>👤 Org: ${event.organizer ? event.organizer.name : 'Desconhecido'}</span>
        </div>
        <p class="event-desc">${event.description}</p>
        <div class="event-actions">
          ${actionBtn}
        </div>
      </div>
    `;
  }).join('');
}

// Event Delegation for action buttons
eventsGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  
  if (action === 'delete') {
    deleteEvent(id);
  } else if (action === 'register') {
    registerForEvent(id);
  } else if (action === 'cancel-reg') {
    cancelRegistration(id);
  } else if (action === 'edit') {
    openEventForm(id);
  }
});

// Open Form for Create or Edit
function openEventForm(eventId = null) {
  formEvent.reset();
  document.getElementById('event-id').value = '';
  
  if (eventId) {
    const event = allEvents.find(e => e._id === eventId);
    if (event) {
      eventFormTitle.textContent = 'Editar Evento';
      document.getElementById('event-id').value = event._id;
      document.getElementById('event-title').value = event.title;
      document.getElementById('event-category').value = event.category;
      
      // Converte a data para o formato aceito pelo input datetime-local (YYYY-MM-DDThh:mm)
      const dateObj = new Date(event.date);
      dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
      document.getElementById('event-date').value = dateObj.toISOString().slice(0, 16);
      
      document.getElementById('event-max').value = event.maxParticipants;
      document.getElementById('event-location').value = event.location;
      document.getElementById('event-description').value = event.description;
    }
  } else {
    eventFormTitle.textContent = 'Criar Novo Evento';
  }
  
  eventFormPanel.classList.remove('hidden');
}

// Submit Event Form (Create / Update)
formEvent.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('event-id').value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/events/${id}` : `${API_URL}/events`;
  
  const eventData = {
    title: document.getElementById('event-title').value,
    category: document.getElementById('event-category').value,
    date: document.getElementById('event-date').value,
    maxParticipants: parseInt(document.getElementById('event-max').value),
    location: document.getElementById('event-location').value,
    description: document.getElementById('event-description').value
  };

  try {
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify(eventData)
    });
    
    const data = await res.json();
    if (res.ok) {
      showToast(id ? 'Evento atualizado!' : 'Evento criado com sucesso!');
      btnCancelEvent.click();
      fetchEvents();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast('Erro ao salvar evento', 'error');
  }
});

// Delete Event
async function deleteEvent(id) {
  if (!confirm('Tem certeza que deseja deletar este evento?')) return;
  
  try {
    const res = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    
    if (res.ok) {
      showToast('Evento deletado!');
      fetchEvents();
    } else {
      const data = await res.json();
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast('Erro ao deletar', 'error');
  }
}

// Register for Event
async function registerForEvent(eventId) {
  try {
    const res = await fetch(`${API_URL}/registrations`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify({ eventId })
    });
    
    const data = await res.json();
    if (res.ok) {
      showToast('Inscrição realizada com sucesso!');
      fetchMyRegistrations();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast('Erro ao realizar inscrição', 'error');
  }
}

// Cancel Registration
async function cancelRegistration(registrationId) {
  if (!confirm('Tem certeza que deseja cancelar sua inscrição?')) return;
  
  try {
    const res = await fetch(`${API_URL}/registrations/${registrationId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    
    if (res.ok) {
      showToast('Inscrição cancelada!');
      fetchMyRegistrations();
    } else {
      const data = await res.json();
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast('Erro ao cancelar inscrição', 'error');
  }
}

// Init
init();
