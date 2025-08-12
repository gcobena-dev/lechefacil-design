// Navigation System
function navigateTo(screenId, param = null) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    currentScreen = screenId;
    
    // Update UI based on user role
    updateUIForRole();
    
    // Update navigation
    updateNavigation();
    
    // Screen-specific logic
    if (screenId === 'cowDetail' && param) {
      updateCowDetail(param);
    }
  }
}

function updateNavigation() {
  // Update bottom navigation active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Set active based on current screen
  const navMapping = {
    'dashboard': 0,
    'milkRegistry': 1,
    'cows': 2,
    'menu': 3
  };
  
  if (navMapping[currentScreen] !== undefined) {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems[navMapping[currentScreen]]) {
      navItems[navMapping[currentScreen]].classList.add('active');
    }
  }
}

function updateUIForRole() {
  if (!currentUser) return;
  
  const isAdmin = currentUser.role === 'admin';
  const isVaquero = currentUser.role === 'vaquero';
  
  // Update dashboard
  if (currentScreen === 'dashboard') {
    const userGreeting = document.getElementById('userGreeting');
    const userRole = document.getElementById('userRole');
    const roleBadge = document.getElementById('roleBadge');
    const adminSection = document.getElementById('adminSection');
    
    if (userGreeting) userGreeting.textContent = `¡Hola ${currentUser.firstName}!`;
    if (userRole) userRole.textContent = `${isAdmin ? 'Administrador' : 'Vaquero'} • ${appData.tenant.name}`;
    if (roleBadge) {
      roleBadge.textContent = isAdmin ? 'Admin' : 'Vaquero';
      roleBadge.className = isAdmin ? 'badge' : 'badge warn';
    }
    if (adminSection) adminSection.style.display = isAdmin ? 'block' : 'none';
  }
  
  // Update menu
  if (currentScreen === 'menu') {
    const menuUserName = document.getElementById('menuUserName');
    const menuUserEmail = document.getElementById('menuUserEmail');
    const menuUserRole = document.getElementById('menuUserRole');
    const menuUserAvatar = document.getElementById('menuUserAvatar');
    const menuAdminSection = document.getElementById('menuAdminSection');
    
    if (menuUserName) menuUserName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    if (menuUserEmail) menuUserEmail.textContent = currentUser.email;
    if (menuUserRole) {
      menuUserRole.textContent = isAdmin ? 'Administrador' : 'Vaquero';
      menuUserRole.className = isAdmin ? 'badge' : 'badge warn';
    }
    if (menuUserAvatar) {
      menuUserAvatar.textContent = currentUser.firstName.charAt(0) + currentUser.lastName.charAt(0);
    }
    if (menuAdminSection) menuAdminSection.style.display = isAdmin ? 'block' : 'none';
  }
  
  // Update cows list
  if (currentScreen === 'cows') {
    const addCowBtn = document.getElementById('addCowBtn');
    const editCowBtns = document.querySelectorAll('.editCowBtn');
    const vaqueroMessage = document.getElementById('vaqueroMessage');
    
    if (addCowBtn) addCowBtn.style.display = isAdmin ? 'block' : 'none';
    editCowBtns.forEach(btn => {
      btn.style.display = isAdmin ? 'inline-flex' : 'none';
    });
    if (vaqueroMessage) vaqueroMessage.style.display = isVaquero ? 'block' : 'none';
  }
}