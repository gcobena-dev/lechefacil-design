// Milk Registry Functions
function selectCow(id, avatar, alias, number) {
  selectedCow = { id, avatar, alias, number };
  
  // Update UI to show selected cow
  document.getElementById('cowSearch').value = `${alias} (${number})`;
  
  // Enable save button if weight is entered
  updateSaveButton();
}

function addNumber(num) {
  const input = document.getElementById('weightInput');
  if (num === '.' && registryWeight.includes('.')) return;
  
  registryWeight += num;
  input.value = registryWeight;
  updateSaveButton();
}

function deleteLast() {
  registryWeight = registryWeight.slice(0, -1);
  document.getElementById('weightInput').value = registryWeight;
  updateSaveButton();
}

function updateSaveButton() {
  const saveBtn = document.getElementById('saveBtn');
  const canSave = selectedCow && registryWeight && parseFloat(registryWeight) > 0;
  saveBtn.disabled = !canSave;
  saveBtn.style.opacity = canSave ? '1' : '0.5';
}

function selectShiftRegistry(shift) {
  registryShift = shift;
  
  // Update tab states
  document.querySelectorAll('#milkRegistry .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

function clearRegistry() {
  selectedCow = null;
  registryWeight = '';
  registryShift = 'morning';
  document.getElementById('cowSearch').value = '';
  document.getElementById('weightInput').value = '';
  updateSaveButton();
}

function saveRegistry() {
  if (!selectedCow || !registryWeight) return;
  
  const record = {
    cow: selectedCow,
    weight: parseFloat(registryWeight),
    shift: registryShift,
    unit: selectedUnit,
    timestamp: new Date()
  };
  
  // Add to milk records
  appData.milkRecords.push({
    id: appData.milkRecords.length + 1,
    cowId: selectedCow.id,
    weight: parseFloat(registryWeight),
    shift: registryShift,
    date: new Date(),
    synced: false
  });
  
  // Simulate save
  showSuccess(`¡Registro guardado! ${selectedCow.alias}: ${registryWeight} ${selectedUnit}`);
  
  setTimeout(() => {
    clearRegistry();
    navigateTo('dashboard');
  }, 1500);
}

// Bulk Registry Functions
function toggleCow(cowId) {
  const checkbox = document.getElementById(`check-${cowId}`);
  const isChecked = checkbox.classList.contains('checked');
  
  if (isChecked) {
    checkbox.classList.remove('checked');
    delete bulkSelection[cowId];
  } else {
    checkbox.classList.add('checked');
    const weightInput = document.getElementById(`weight-${cowId}`);
    bulkSelection[cowId] = {
      weight: weightInput.value || 0,
      cow: appData.cows.find(c => c.id === cowId)
    };
  }
  
  updateBulkTotals();
}

function updateTotal() {
  updateBulkTotals();
}

function updateBulkTotals() {
  let selectedCount = 0;
  let totalWeight = 0;
  
  Object.keys(bulkSelection).forEach(cowId => {
    const weightInput = document.getElementById(`weight-${cowId}`);
    if (weightInput) {
      const weight = parseFloat(weightInput.value) || 0;
      if (weight > 0) {
        selectedCount++;
        totalWeight += weight;
      }
    }
  });
  
  const selectedCountElement = document.getElementById('selectedCount');
  const totalWeightElement = document.getElementById('totalWeight');
  
  if (selectedCountElement) {
    selectedCountElement.textContent = `${selectedCount} seleccionadas`;
  }
  if (totalWeightElement) {
    totalWeightElement.textContent = `Total estimado: ${totalWeight.toFixed(1)} kg`;
  }
}

function selectAllCows() {
  appData.cows.forEach(cow => {
    const checkbox = document.getElementById(`check-${cow.id}`);
    if (checkbox && !checkbox.classList.contains('checked')) {
      checkbox.classList.add('checked');
      bulkSelection[cow.id] = {
        weight: cow.lastWeight,
        cow: cow
      };
      const weightInput = document.getElementById(`weight-${cow.id}`);
      if (weightInput) {
        weightInput.value = cow.lastWeight;
      }
    }
  });
  updateBulkTotals();
}

function selectNoCows() {
  Object.keys(bulkSelection).forEach(cowId => {
    const checkbox = document.getElementById(`check-${cowId}`);
    if (checkbox) {
      checkbox.classList.remove('checked');
      const weightInput = document.getElementById(`weight-${cowId}`);
      if (weightInput) {
        weightInput.value = '';
      }
    }
  });
  bulkSelection = {};
  updateBulkTotals();
}

function saveBulkRegistry() {
  const records = Object.values(bulkSelection).filter(item => item.weight > 0);
  
  if (records.length === 0) {
    showError('Selecciona al menos una vaca con peso');
    return;
  }
  
  // Add bulk records to data
  records.forEach(record => {
    appData.milkRecords.push({
      id: appData.milkRecords.length + 1,
      cowId: record.cow.id,
      weight: parseFloat(record.weight),
      shift: registryShift,
      date: new Date(),
      synced: false
    });
  });
  
  showSuccess(`¡${records.length} registros guardados exitosamente!`);
  setTimeout(() => {
    navigateTo('dashboard');
  }, 1500);
}

// Quick registry function
function quickRegisterMilk(cowId) {
  const cow = appData.cows.find(c => c.id === cowId);
  if (cow) {
    selectedCow = cow;
    navigateTo('milkRegistry');
  }
}