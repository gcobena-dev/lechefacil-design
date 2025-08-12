// Utility Functions
function showSuccess(message) {
  const successScreen = document.getElementById('success');
  if (successScreen) {
    document.getElementById('successMessage').textContent = message;
    navigateTo('success');
  } else {
    alert(`✓ ${message}`);
  }
}

function showError(message) {
  const errorScreen = document.getElementById('error');
  if (errorScreen) {
    document.getElementById('errorMessage').textContent = message;
    navigateTo('error');
  } else {
    alert(`⚠ ${message}`);
  }
}

// Settings Functions
function selectUnit(unit) {
  selectedUnit = unit;
  
  // Update tab states
  document.querySelectorAll('#createTenant2 .tabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

function selectShift(shift) {
  // Update tab states
  document.querySelectorAll('#createTenant2 .tabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

function selectCowCount(count) {
  // Update tab states
  document.querySelectorAll('#createTenant2 .tabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

// Sync Functions
function forceSync() {
  showSuccess('Sincronización forzada iniciada');
  setTimeout(() => {
    navigateTo('sync');
  }, 1500);
}

function retryAllSync() {
  showSuccess('Reintentando sincronización de todos los elementos');
  setTimeout(() => {
    navigateTo('dashboard');
  }, 1500);
}

// Settings and configuration
function changeUnit() {
  const newUnit = selectedUnit === 'kg' ? 'lbs' : 'kg';
  selectedUnit = newUnit;
  alert(`Unidad cambiada a: ${newUnit}`);
}

function changeDefaultShift() {
  const shifts = ['morning', 'afternoon', 'evening'];
  const shiftNames = ['Mañana', 'Tarde', 'Noche'];
  const currentIndex = shifts.indexOf(registryShift);
  const nextIndex = (currentIndex + 1) % shifts.length;
  
  registryShift = shifts[nextIndex];
  alert(`Turno por defecto cambiado a: ${shiftNames[nextIndex]}`);
}

function changeSyncFreq() {
  alert('Configuración de frecuencia de sincronización (simulado)');
}

function configNotifications() {
  alert('Configuración de notificaciones (simulado)');
}

function exportData() {
  alert('Exportando datos... (simulado)');
}

function clearCache() {
  if (confirm('¿Limpiar caché de la aplicación?')) {
    alert('Caché limpiado exitosamente');
  }
}

// History and records
function editRecord(recordId) {
  alert(`Editando registro: ${recordId} (simulado)`);
}

// Date and time utilities
function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

function formatShift(shift) {
  const shifts = {
    'morning': 'Mañana',
    'afternoon': 'Tarde',
    'evening': 'Noche'
  };
  return shifts[shift] || shift;
}

// Statistics and calculations
function calculateTotalProduction() {
  return appData.milkRecords.reduce((total, record) => total + record.weight, 0);
}

function getProductionByShift(shift) {
  return appData.milkRecords
    .filter(record => record.shift === shift)
    .reduce((total, record) => total + record.weight, 0);
}

function getCowProductionAverage(cowId) {
  const cowRecords = appData.milkRecords.filter(record => record.cowId === cowId);
  if (cowRecords.length === 0) return 0;
  
  const total = cowRecords.reduce((sum, record) => sum + record.weight, 0);
  return total / cowRecords.length;
}

// Data validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateWeight(weight) {
  const weightNum = parseFloat(weight);
  return !isNaN(weightNum) && weightNum > 0 && weightNum <= 50;
}

// Local storage simulation (since we can't use real localStorage)
function saveToLocalStorage(key, data) {
  // Simulate saving to local storage
  console.log(`Saving to localStorage: ${key}`, data);
}

function loadFromLocalStorage(key) {
  // Simulate loading from local storage
  console.log(`Loading from localStorage: ${key}`);
  return null;
}