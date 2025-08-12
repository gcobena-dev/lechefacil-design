// Cow Management Functions
function filterCows() {
  const searchTerm = document.getElementById('cowSearch').value.toLowerCase();
  const cowItems = document.querySelectorAll('#cowList .item');
  
  cowItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
  });
}

function filterCowsMain() {
  const searchTerm = document.getElementById('cowSearchMain').value.toLowerCase();
  const cowItems = document.querySelectorAll('#cowsMainList .item');
  
  cowItems.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
  });
}

function updateCowDetail(cowId) {
  const cow = appData.cows.find(c => c.id === cowId);
  if (!cow) return;
  
  // Update title
  const titleElement = document.querySelector('#cowDetail .title');
  if (titleElement) {
    titleElement.textContent = `${cow.alias} (${cow.number})`;
  }
  
  // Update cow info in detail view
  updateCowDetailInfo(cow);
}

function updateCowDetailInfo(cow) {
  // This function would update all the cow detail information
  // For now, it's a placeholder since the detail screen needs to be loaded dynamically
}

function addNewCow() {
  if (currentUser && currentUser.role === 'admin') {
    navigateTo('addCow');
  } else {
    showError('Solo los administradores pueden agregar vacas');
  }
}

function saveNewCow() {
  const alias = document.getElementById('newCowAlias').value;
  const number = document.getElementById('newCowNumber').value;
  
  if (!alias || !number) {
    showError('El alias y número son requeridos');
    return;
  }
  
  // Generate avatar from alias
  const avatar = alias.substring(0, 2).toUpperCase();
  
  // Create new cow
  const newCow = {
    id: `cow_${Date.now()}`,
    alias: alias,
    number: number,
    avatar: avatar,
    breed: document.getElementById('newCowBreed').value || 'Holstein',
    lastWeight: 0,
    status: 'active'
  };
  
  // Add to cows array
  appData.cows.push(newCow);
  
  showSuccess('¡Nueva vaca agregada exitosamente!');
  setTimeout(() => {
    navigateTo('cows');
  }, 1500);
}

function editCow(cowId) {
  if (currentUser && currentUser.role === 'admin') {
    navigateTo('editCow', cowId);
  } else {
    showError('Solo los administradores pueden editar vacas');
  }
}

function markInactive(cowId) {
  if (currentUser && currentUser.role === 'admin') {
    if (confirm('¿Marcar esta vaca como inactiva?')) {
      const cow = appData.cows.find(c => c.id === cowId);
      if (cow) {
        cow.status = 'inactive';
        showSuccess('Vaca marcada como inactiva');
        setTimeout(() => {
          navigateTo('cows');
        }, 1500);
      }
    }
  } else {
    showError('Solo los administradores pueden cambiar el estado de las vacas');
  }
}

function selectCowStatus(status) {
  // Update tab states for cow status
  document.querySelectorAll('#addCow .tabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

function addPhoto() {
  if (currentUser && currentUser.role === 'admin') {
    alert('Funcionalidad de agregar foto (simulada)');
  } else {
    showError('Solo los administradores pueden agregar fotos');
  }
}

function showFilters() {
  alert('Filtros avanzados (simulado)');
}

// Cow history and details
function viewCowHistory(cowId) {
  const cow = appData.cows.find(c => c.id === cowId);
  if (cow) {
    // Get milk records for this cow
    const cowRecords = appData.milkRecords.filter(r => r.cowId === cowId);
    console.log(`Historial de ${cow.alias}:`, cowRecords);
    
    // For now, just show an alert
    alert(`Historial de ${cow.alias}: ${cowRecords.length} registros`);
  }
}

// Utility function to get cow by ID
function getCowById(cowId) {
  return appData.cows.find(c => c.id === cowId);
}