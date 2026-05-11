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
const createEventPanel = document.getElementById('create-event-panel');
const btnCancelCreate = document.getElementById('btn-cancel-create');
const formCreateEvent = document.getElementById('form-create-event');

// State
let currentUser = null;
let currentToken = localStorage.getItem('token');
let myRegistrations = [];

// === Initialization ===
function init() {
  if (currentToken) {
    // If token exists, we try to load dashboard
    // In a real app we would validate the token first, but here we just try to fetch events.
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
  createEventPanel.classList.remove('hidden');
});

btnCancelCreate.addEventListener('click', () => {
  createEventPanel.classList.add('hidden');
  formCreateEvent.reset();
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

// Fetch My Registrations (to know which events I'm in)
async function fetchMyRegistrations() {
  try {
    const res = await fetch(`${API_URL}/registrations/my`, {
      headers: { 'Authorization': `Bearer ${currentToken}` }
    });
    if (res.ok) {
      const data = await res.json();
      myRegistrations = data.registrations.map(r => r.event._id);
      renderEvents(); // Re-render to update buttons
    }
  } catch (err) {
    console.error('Error fetching registrations:', err);
  }
}

// Fetch Events
let allEvents = [];
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
      btnLogout.click(); // Token expired or invalid
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
    const date = new Date(event.date).toLocaleString('pt-BR');
    const isOwner = currentUser && event.organizer && event.organizer._id === currentUser._id;
    const isRegistered = myRegistrations.includes(event._id);
    
    let actionBtn = '';
    
    if (isOwner) {
      actionBtn = `<button onclick="deleteEvent('${event._id}')" class="btn btn-outline-danger btn-sm">Deletar Evento</button>`;
    } else if (isRegistered) {
      actionBtn = `<button disabled class="btn btn-secondary btn-sm">Inscrito ✓</button>`;
    } else {
      actionBtn = `<button onclick="registerForEvent('${event._id}')" class="btn btn-primary btn-sm">Inscrever-se</button>`;
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

// Create Event
formCreateEvent.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const newEvent = {
    title: document.getElementById('event-title').value,
    category: document.getElementById('event-category').value,
    date: document.getElementById('event-date').value,
    maxParticipants: parseInt(document.getElementById('event-max').value),
    location: document.getElementById('event-location').value,
    description: document.getElementById('event-description').value
  };

  try {
    const res = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentToken}`
      },
      body: JSON.stringify(newEvent)
    });
    
    const data = await res.json();
    if (res.ok) {
      showToast('Evento criado com sucesso!');
      btnCancelCreate.click();
      fetchEvents();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast('Erro ao criar evento', 'error');
  }
});

// Delete Event
window.deleteEvent = async (id) => {
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
};

// Register for Event
window.registerForEvent = async (eventId) => {
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
      myRegistrations.push(eventId);
      renderEvents();
    } else {
      showToast(data.error, 'error');
    }
  } catch (err) {
    showToast('Erro ao realizar inscrição', 'error');
  }
};

// Init
init();
