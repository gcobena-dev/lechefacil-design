// Authentication Functions
function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showError('Por favor completa todos los campos');
    return;
  }
  
  // Check credentials
  const user = appData.users[email];
  if (!user || user.password !== password) {
    showError('Credenciales incorrectas');
    return;
  }
  
  // Set current user
  currentUser = user;
  
  // Navigate based on role
  showSuccess(`¡Bienvenido ${user.firstName}! Rol: ${user.role}`);
  setTimeout(() => {
    navigateTo('dashboard');
  }, 1500);
}

function handleRegister() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  
  if (!firstName || !lastName || !email || !password) {
    showError('Por favor completa todos los campos');
    return;
  }
  
  // Simulate registration
  const newUser = { firstName, lastName, email, role: 'admin', password };
  appData.users[email] = newUser;
  currentUser = newUser;
  
  showSuccess('¡Cuenta creada exitosamente!');
  setTimeout(() => {
    navigateTo('createTenant1');
  }, 1500);
}

function handleCreateTenant() {
  const farmName = document.getElementById('farmName').value;
  
  if (!farmName) {
    showError('El nombre de la finca es requerido');
    return;
  }
  
  // Simulate tenant creation
  appData.tenant = { name: farmName, owner: currentUser };
  showSuccess('¡Finca creada exitosamente!');
  setTimeout(() => {
    navigateTo('dashboard');
  }, 1500);
}

function logout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    currentUser = null;
    navigateTo('login');
  }
}

// Role-based functions
function inviteUser() {
  if (currentUser && currentUser.role === 'admin') {
    const email = document.getElementById('newUserEmail').value;
    if (!email) {
      showError('El email es requerido');
      return;
    }
    showSuccess('Invitación enviada exitosamente');
    setTimeout(() => {
      navigateTo('userManagement');
    }, 1500);
  } else {
    showError('Solo los administradores pueden invitar usuarios');
  }
}

function generateReport(type) {
  if (currentUser && currentUser.role === 'admin') {
    showSuccess(`Generando reporte de ${type}...`);
    setTimeout(() => {
      alert(`Reporte de ${type} generado (simulado)`);
    }, 1500);
  } else {
    showError('Solo los administradores pueden generar reportes');
  }
}

function selectNewUserRole(role) {
  // Update tab states
  document.querySelectorAll('#userManagement .tabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

// Demo login helper
function quickLogin(email) {
  document.getElementById('loginEmail').value = email;
  document.getElementById('loginPassword').value = appData.users[email].password;
  handleLogin();
}

// Join tenant functions
function acceptInvitation() {
  showSuccess('¡Te uniste a la finca exitosamente!');
  setTimeout(() => {
    navigateTo('dashboard');
  }, 1500);
}

function rejectInvitation() {
  if (confirm('¿Rechazar la invitación?')) {
    navigateTo('login');
  }
}

function validateCode() {
  const code = document.getElementById('inviteCode').value;
  if (code.length === 6) {
    acceptInvitation();
  } else {
    showError('Código inválido');
  }
}