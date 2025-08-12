
// ===============================
// Main App Initialization
// ===============================
document.addEventListener('DOMContentLoaded', function () {
    loadAllScreens();
    initializeApp();
});

function initializeApp() {
    // Estado mínimo inicializado antes de usarlo
    window.settings = {
        defaultUnit: 'kg',         // 'kg' | 'lb'
        defaultShift: 'morning',   // 'morning' | 'afternoon' | 'evening'
    };

    window.appData = {
        cows: [
            { id: 'brisa', alias: 'Brisa', initials: 'BZ', number: '#032', breed: 'Holstein', lastWeight: 2.9 },
            { id: 'clara', alias: 'Clara', initials: 'CL', number: '#077', breed: 'Jersey', lastWeight: 3.1 },
            { id: 'luna', alias: 'Luna', initials: 'LN', number: '#045', breed: 'Holstein', lastWeight: 3.6 },
            { id: 'diva', alias: 'Diva', initials: 'DV', number: '#081', breed: 'Holstein', lastWeight: 2.7 },
        ],
    };

    window.bulkSelection = {};
    window.current = { screen: 'login', selectedCow: null, weight: '' };

    // Auto start app after splash
    setTimeout(() => {
        navigateTo('onboarding'); // si no existe 'onboarding' caerá a login más abajo
    }, 2000);

    // Initialize navigation
    updateNavigation();

    // Set initial bulk selection
    initializeBulkSelection();

    // Pantalla inicial por defecto si no existe 'onboarding'
    if (!document.getElementById('onboarding')) {
        navigateTo('login');
    }
}

// ===============================
// UI Factory: Screens
// ===============================
function loadAllScreens() {
    const container = document.getElementById('screens-container');
    if (!container) return;

    container.innerHTML = `
    <!-- Register Screen -->
    <div class="screen" id="register" style="display:none">
      <div class="topbar">
        <button class="btn ghost" onclick="navigateTo('login')" style="padding:8px">←</button>
        <div class="title">Crear cuenta</div>
        <div class="status-dot"><span class="dot"></span> Online</div>
      </div>

      <div class="welcome" style="padding:20px 0">
        <div class="logo" style="width:80px; height:80px; border-radius:20px; margin:0 auto 24px"></div>
        <h2>Únete a LecheFácil</h2>
        <p style="color:var(--muted); margin:0 0 32px">Crea tu cuenta para empezar</p>
      </div>

      <div class="card">
        <h3>Información personal</h3>
        <div class="field">
          <label>Nombre</label>
          <input class="input" placeholder="Tu nombre" id="registerFirstName" />
        </div>
        <div class="field">
          <label>Apellido</label>
          <input class="input" placeholder="Tu apellido" id="registerLastName" />
        </div>
        <div class="field">
          <label>Email</label>
          <input class="input" type="email" placeholder="tu@email.com" id="registerEmail" />
        </div>
        <div class="field">
          <label>Contraseña</label>
          <input class="input" type="password" placeholder="Mínimo 6 caracteres" id="registerPassword" />
        </div>
        <div class="field">
          <label>Confirmar contraseña</label>
          <input class="input" type="password" placeholder="Repite tu contraseña" id="registerConfirmPassword" />
        </div>
      </div>

      <div class="card">
        <h3>Información de la finca</h3>
        <div class="field">
          <label>Nombre de la finca</label>
          <input class="input" placeholder="Ej: Finca Los Alamos" id="registerFarmName" />
        </div>
        <div class="field">
          <label>Ubicación</label>
          <input class="input" placeholder="Ciudad, País" id="registerFarmLocation" />
        </div>
        <div class="field">
          <label>Número aproximado de vacas</label>
          <div class="tabs" id="registerCowCountTabs">
            <div class="tab is-active" onclick="selectRegisterCowCount('1-10')">1-10</div>
            <div class="tab" onclick="selectRegisterCowCount('11-50')">11-50</div>
            <div class="tab" onclick="selectRegisterCowCount('50+')">50+</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Preferencias iniciales</h3>
        <div class="field">
          <label>Unidad de peso preferida</label>
          <div class="tabs" id="registerUnitTabs">
            <div class="tab is-active" onclick="selectRegisterUnit('kg')">Kilogramos</div>
            <div class="tab" onclick="selectRegisterUnit('lbs')">Libras</div>
          </div>
        </div>
        <div class="field">
          <label>Turno principal</label>
          <div class="tabs" id="registerShiftTabs">
            <div class="tab is-active" onclick="selectRegisterShift('morning')">Mañana</div>
            <div class="tab" onclick="selectRegisterShift('afternoon')">Tarde</div>
            <div class="tab" onclick="selectRegisterShift('evening')">Noche</div>
          </div>
        </div>
      </div>

      <div style="margin:16px 0">
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer">
          <input type="checkbox" id="registerTerms" style="width:16px; height:16px">
          <span style="font-size:12px; color:var(--muted)">
            Acepto los <a href="#" style="color:var(--brand)">Términos de Servicio</a> y 
            <a href="#" style="color:var(--brand)">Política de Privacidad</a>
          </span>
        </label>
      </div>

      <div class="footer">
        <button class="btn secondary full" onclick="navigateTo('login')">Ya tengo cuenta</button>
        <button class="btn full" onclick="handleRegister()">Crear cuenta</button>
      </div>

      <div style="text-align:center; margin-top:16px">
        <p style="font-size:12px; color:var(--muted)">
          Al registrarte, obtienes 30 días gratis de prueba<br>
          Sin compromiso • Cancela cuando quieras
        </p>
      </div>
    </div>


    <!-- Edit cow Screen -->
    <div class="screen" id="editCow" style="display:none">
    <div class="topbar">
        <button class="btn ghost" onclick="navigateTo('cows')" style="padding:8px">←</button>
        <div class="title">Editar vaca</div>
        <span class="badge warn">Modificar</span>
    </div>

    <div class="card">
        <h3>Información básica</h3>
        <div class="field">
        <label>Alias / Nombre</label>
        <input class="input" placeholder="Ej: Brisa, Luna, Clara..." id="editCowAlias" />
        </div>
        <div class="field">
        <label>Número oficial</label>
        <input class="input" placeholder="Ej: #032, #077..." id="editCowNumber" />
        </div>
        <div class="field">
        <label>Raza</label>
        <input class="input" placeholder="Ej: Holstein, Jersey..." id="editCowBreed" />
        </div>
    </div>

    <div class="card">
        <h3>Estado</h3>
        <div class="tabs" id="editCowStatusTabs">
        <div class="tab" onclick="selectEditCowStatus('active')">Activa</div>
        <div class="tab" onclick="selectEditCowStatus('pregnant')">Preñada</div>
        <div class="tab" onclick="selectEditCowStatus('dry')">Seca</div>
        <div class="tab" onclick="selectEditCowStatus('inactive')">Inactiva</div>
        </div>
    </div>

    <div class="card">
        <h3>Información adicional</h3>
        <div class="field">
        <label>Peso promedio esperado (kg)</label>
        <input class="input" placeholder="Ej: 3.2" id="editCowWeight" type="number" step="0.1" />
        </div>
        <div class="field">
        <label>Fecha de nacimiento (opcional)</label>
        <input class="input" type="date" id="editCowBirthDate" />
        </div>
        <div class="field">
        <label>Notas</label>
        <input class="input" placeholder="Características especiales..." id="editCowNotes" />
        </div>
    </div>

    <div class="card">
        <h3>Estadísticas</h3>
        <div class="stats">
        <div class="stat">
            <div class="meta">Último registro</div>
            <div class="kpi" id="editCowLastMilk">2.9 kg</div>
            <div class="badge" id="editCowLastDate">Hace 1 día</div>
        </div>
        <div class="stat">
            <div class="meta">Total registros</div>
            <div class="kpi" id="editCowTotalRecords">15</div>
            <div class="badge">Este mes</div>
        </div>
        </div>
    </div>

    <div class="card">
        <h3>Acciones</h3>
        <div class="list">
        <div class="item" onclick="viewCowHistory(currentEditingCowId)">
            <div class="avatar" style="background:#3b82f6">📊</div>
            <div style="flex:1">
            <div>Ver historial completo</div>
            <div class="meta">Todos los registros de esta vaca</div>
            </div>
            <button class="btn ghost">Ver</button>
        </div>
        <div class="item" onclick="duplicateCow(currentEditingCowId)">
            <div class="avatar" style="background:#8b5cf6">📋</div>
            <div style="flex:1">
            <div>Duplicar vaca</div>
            <div class="meta">Crear copia con datos similares</div>
            </div>
            <button class="btn ghost">Duplicar</button>
        </div>
        </div>
    </div>

    <div class="footer">
        <button class="btn secondary" onclick="deleteCow(currentEditingCowId)" style="flex:0.4">🗑️</button>
        <button class="btn secondary" onclick="navigateTo('cows')" style="flex:1">Cancelar</button>
        <button class="btn full" onclick="saveEditCow()" style="flex:1">Guardar cambios</button>
    </div>
    </div>

    <!-- Add cow Screen -->
    <div class="screen" id="addCow" style="display:none">
    <div class="topbar">
        <button class="btn ghost" onclick="navigateTo('cows')" style="padding:8px">←</button>
        <div class="title">Agregar vaca</div>
        <span class="badge">Nueva</span>
    </div>

    <div class="card">
        <h3>Información básica</h3>
        <div class="field">
        <label>Alias / Nombre</label>
        <input class="input" placeholder="Ej: Brisa, Luna, Clara..." id="newCowAlias" />
        </div>
        <div class="field">
        <label>Número oficial</label>
        <input class="input" placeholder="Ej: #032, #077..." id="newCowNumber" />
        </div>
        <div class="field">
        <label>Raza</label>
        <input class="input" placeholder="Ej: Holstein, Jersey..." id="newCowBreed" value="Holstein" />
        </div>
    </div>

    <div class="card">
        <h3>Estado</h3>
        <div class="tabs" id="cowStatusTabs">
        <div class="tab is-active" onclick="selectCowStatus('active')">Activa</div>
        <div class="tab" onclick="selectCowStatus('pregnant')">Preñada</div>
        <div class="tab" onclick="selectCowStatus('dry')">Seca</div>
        </div>
    </div>

    <div class="card">
        <h3>Información adicional</h3>
        <div class="field">
        <label>Peso promedio esperado (kg)</label>
        <input class="input" placeholder="Ej: 3.2" id="newCowWeight" type="number" step="0.1" />
        </div>
        <div class="field">
        <label>Fecha de nacimiento (opcional)</label>
        <input class="input" type="date" id="newCowBirthDate" />
        </div>
        <div class="field">
        <label>Notas (opcional)</label>
        <input class="input" placeholder="Características especiales..." id="newCowNotes" />
        </div>
    </div>

    <div class="card">
        <h3>Foto (opcional)</h3>
        <button class="btn secondary full" onclick="addCowPhoto()">📷 Agregar foto</button>
        <p class="meta" style="margin-top:8px">Ayuda a identificar la vaca rápidamente</p>
    </div>

    <div class="footer">
        <button class="btn secondary full" onclick="navigateTo('cows')">Cancelar</button>
        <button class="btn full" onclick="saveNewCow()">Guardar vaca</button>
    </div>
    </div>

    <!-- Bulk preview screen -->
    <div class="screen" id="bulkPreview" style="display:none">
    <div class="topbar">
        <button class="btn ghost" onclick="navigateTo('bulkRegistry')" style="padding:8px">←</button>
        <div class="title">Confirmar registros</div>
        <span class="badge">2/2</span>
    </div>

    <div class="card">
        <h3>Resumen</h3>
        <div class="stats">
        <div class="stat">
            <div class="meta">Vacas seleccionadas</div>
            <div class="kpi" id="previewCount">3</div>
        </div>
        <div class="stat">
            <div class="meta">Total estimado</div>
            <div class="kpi" id="previewTotal">9.7 kg</div>
        </div>
        </div>
    </div>

    <div class="card">
        <h3>Registros a guardar</h3>
        <div class="list" id="previewList">
        <div class="item">
            <div class="avatar">BZ</div>
            <div style="flex:1">
            <div>Brisa (#032)</div>
            <div class="meta">2.9 kg • Turno mañana</div>
            </div>
            <span class="badge ok">Listo</span>
        </div>
        </div>
    </div>

    <div class="footer">
        <button class="btn secondary full" onclick="navigateTo('bulkRegistry')">← Volver</button>
        <button class="btn full" onclick="saveBulkRegistry()">Confirmar y guardar</button>
    </div>
    </div>

    <!-- Login Screen -->
    <div class="screen" id="login" style="display:none">
      <div class="topbar">
        <div class="logo"></div>
        <div class="title">Iniciar sesión</div>
        <div class="status-dot"><span class="dot"></span> Online</div>
      </div>

      <div class="welcome" style="padding:20px 0">
        <div class="logo" style="width:80px; height:80px; border-radius:20px; margin:0 auto 24px"></div>
        <h2>LecheFácil</h2>
        <p style="color:var(--muted); margin:0 0 32px">Bienvenido de vuelta</p>
      </div>

      <!-- Quick Demo Login -->
      <div class="card" style="margin-bottom:16px">
        <h3>Demo rápido</h3>
        <div class="row">
          <button class="btn secondary" onclick="quickLogin('admin@finca.com')" style="flex:1">Admin</button>
          <button class="btn secondary" onclick="quickLogin('vaquero@finca.com')" style="flex:1">Vaquero</button>
        </div>
        <p class="meta" style="margin-top:8px">Haz clic para probar cada rol</p>
      </div>

      <div class="card">
        <div class="field">
          <label>Email</label>
          <input class="input" placeholder="admin@finca.com o vaquero@finca.com" id="loginEmail" />
        </div>
        <div class="field">
          <label>Contraseña</label>
          <input class="input" type="password" placeholder="admin123 o vaquero123" id="loginPassword" />
        </div>
        <div class="row" style="margin-top:16px">
          <button class="btn full" onclick="handleLogin()">Entrar</button>
        </div>
        <div class="row" style="margin-top:12px">
          <button class="btn ghost full" onclick="navigateTo('register')">Crear cuenta</button>
        </div>
      </div>
    </div>

    <!-- Dashboard Screen -->
    <div class="screen with-nav" id="dashboard" style="display:none">
      <div class="topbar">
        <div class="logo"></div>
        <div class="title">Dashboard</div>
        <div class="status-dot"><span class="dot"></span> Sincronizado</div>
      </div>

      <!-- User Role Indicator -->
      <div class="card" style="margin-bottom:12px">
        <div class="row">
          <div style="flex:1">
            <h3 style="margin:0" id="userGreeting">¡Hola Usuario!</h3>
            <div class="meta" id="userRole">Rol • Finca</div>
          </div>
          <span class="badge" id="roleBadge">Role</span>
        </div>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="meta">Litros hoy</div>
          <div class="kpi">126.4 L</div>
          <div class="badge">+8% vs ayer</div>
        </div>
        <div class="stat">
          <div class="meta">Vacas ordeñadas</div>
          <div class="kpi">42</div>
          <div class="badge">Turno: Mañana</div>
        </div>
        <div class="stat">
          <div class="meta">Pendientes de sync</div>
          <div class="kpi">3</div>
          <div class="badge warn">Último sync: 08:45</div>
        </div>
        <div class="stat">
          <div class="meta">Valor estimado</div>
          <div class="kpi">$ 53.20</div>
          <div class="badge">$0.42 / L</div>
        </div>
      </div>

      <div class="card">
        <h3>Acciones rápidas</h3>
        <button class="btn full" onclick="navigateTo('milkRegistry')" style="margin-bottom:12px">Registrar leche</button>
        <button class="btn secondary full" onclick="navigateTo('bulkRegistry')" style="margin-bottom:12px">Registro en bloque</button>
        <button class="btn secondary full" onclick="navigateTo('cows')">Ver lista de vacas</button>
      </div>

      <!-- Admin Only Section -->
      <div class="card" id="adminSection" style="display:none">
        <h3>Administración</h3>
        <div class="list">
          <div class="item" onclick="navigateTo('userManagement')">
            <div class="avatar" style="background:#8b5cf6">👥</div>
            <div style="flex:1">
              <div>Gestionar usuarios</div>
              <div class="meta">Invitar vaqueros, asignar roles</div>
            </div>
            <span class="badge">Admin</span>
          </div>
          <div class="item" onclick="navigateTo('reports')">
            <div class="avatar" style="background:#f59e0b">📊</div>
            <div style="flex:1">
              <div>Reportes avanzados</div>
              <div class="meta">Análisis de producción</div>
            </div>
            <span class="badge">Admin</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Registros recientes</h3>
        <div class="list">
          <div class="item" onclick="editRecord('vaca21')">
            <div class="avatar">A1</div>
            <div style="flex:1">
              <div>Vaca #21 – 3.4 kg</div>
              <div class="meta">08:26 • Turno mañana</div>
            </div>
            <span class="badge ok">Sync</span>
          </div>
          <div class="item" onclick="editRecord('brisa')">
            <div class="avatar">BZ</div>
            <div style="flex:1">
              <div>Brisa – 2.9 kg</div>
              <div class="meta">08:21 • Turno mañana</div>
            </div>
            <span class="badge warn">Pend</span>
          </div>
          <div class="item" onclick="editRecord('clara')">
            <div class="avatar">CL</div>
            <div style="flex:1">
              <div>Clara – 3.1 kg</div>
              <div class="meta">08:18 • Turno mañana</div>
            </div>
            <span class="badge ok">Sync</span>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="nav-bottom">
        <div class="nav-item active" data-target="dashboard" onclick="navigateTo('dashboard')">
          <div class="nav-icon">📊</div>
          <div class="nav-label">Dashboard</div>
        </div>
        <div class="nav-item" data-target="milkRegistry" onclick="navigateTo('milkRegistry')">
          <div class="nav-icon">🥛</div>
          <div class="nav-label">Registrar</div>
        </div>
        <div class="nav-item" data-target="cows" onclick="navigateTo('cows')">
          <div class="nav-icon">🐄</div>
          <div class="nav-label">Vacas</div>
        </div>
        <div class="nav-item" data-target="menu" onclick="navigateTo('menu')">
          <div class="nav-icon">☰</div>
          <div class="nav-label">Menú</div>
        </div>
      </div>
    </div>

    <!-- Milk Registry Screen -->
    <div class="screen with-nav" id="milkRegistry" style="display:none">
      <div class="topbar">
        <button class="btn ghost" onclick="navigateTo('dashboard')" style="padding:8px">←</button>
        <div class="title">Registrar leche</div>
        <div class="status-dot"><span class="dot"></span> Offline</div>
      </div>

      <div class="card">
        <h3>Parámetros</h3>
        <div class="row" style="gap:8px; flex-wrap:wrap">
          <div class="badge">Turno: <strong id="badgeShift" style="margin-left:6px;color:#c7f9cc">Mañana</strong></div>
          <div class="badge">Unidad: <strong id="badgeUnit" style="margin-left:6px;color:#c7f9cc">kg</strong></div>
          <div class="badge">Balde: <strong style="margin-left:6px;color:#c7f9cc">#1</strong></div>
        </div>
        <p class="meta" style="margin-top:8px">Se pueden cambiar sin ocupar espacio extra.</p>
      </div>

      <div class="card">
        <div class="field">
          <label>Vaca</label>
          <input class="input" placeholder="Buscar alias o número" id="cowSearch" onkeyup="filterCows()" />
        </div>
        <div class="list" style="margin-top:12px" id="cowList">
          <div class="item" onclick="selectCow('brisa', 'BZ', 'Brisa', '#032')">
            <div class="avatar">BZ</div>
            <div style="flex:1">
              <div>Brisa</div>
              <div class="meta">#032 • Último: 2.9 kg</div>
            </div>
            <span class="badge">Reciente</span>
          </div>
          <div class="item" onclick="selectCow('clara', 'CL', 'Clara', '#077')">
            <div class="avatar">CL</div>
            <div style="flex:1">
              <div>Clara</div>
              <div class="meta">#077 • Último: 3.1 kg</div>
            </div>
          </div>
          <div class="item" onclick="selectCow('diva', 'DV', 'Diva', '#081')">
            <div class="avatar">DV</div>
            <div style="flex:1">
              <div>Diva</div>
              <div class="meta">#081 • Último: 2.7 kg</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Peso ordeñado</h3>
        <p class="meta">Ingresa el <strong>peso</strong> (kg/lbs según tu preferencia). La conversión a litros es interna.</p>
        <div class="row">
          <div class="col field">
            <input class="input" placeholder="0.0" value="" id="weightInput" readonly style="font-size:24px; text-align:center" />
          </div>
        </div>

        <div class="tabs" id="shiftTabs">
          <div class="tab is-active" data-shift="morning" onclick="selectShiftRegistry('morning')">Mañana</div>
          <div class="tab" data-shift="afternoon" onclick="selectShiftRegistry('afternoon')">Tarde</div>
          <div class="tab" data-shift="evening" onclick="selectShiftRegistry('evening')">Noche</div>
        </div>

        <div class="keypad">
          <div class="key" onclick="addNumber('1')">1</div>
          <div class="key" onclick="addNumber('2')">2</div>
          <div class="key" onclick="addNumber('3')">3</div>
          <div class="key" onclick="addNumber('4')">4</div>
          <div class="key" onclick="addNumber('5')">5</div>
          <div class="key" onclick="addNumber('6')">6</div>
          <div class="key" onclick="addNumber('7')">7</div>
          <div class="key" onclick="addNumber('8')">8</div>
          <div class="key" onclick="addNumber('9')">9</div>
          <div class="key" onclick="addNumber('.')">.</div>
          <div class="key" onclick="addNumber('0')">0</div>
          <div class="key" onclick="deleteLast()">←</div>
        </div>
      </div>

      <div class="footer">
        <button class="btn secondary full" onclick="clearRegistry()">Cancelar</button>
        <button class="btn full" onclick="saveRegistry()" id="saveBtn" disabled>Guardar</button>
      </div>

      <!-- Bottom Navigation -->
      <div class="nav-bottom">
        <div class="nav-item" data-target="dashboard" onclick="navigateTo('dashboard')">
          <div class="nav-icon">📊</div>
          <div class="nav-label">Dashboard</div>
        </div>
        <div class="nav-item active" data-target="milkRegistry" onclick="navigateTo('milkRegistry')">
          <div class="nav-icon">🥛</div>
          <div class="nav-label">Registrar</div>
        </div>
        <div class="nav-item" data-target="cows" onclick="navigateTo('cows')">
          <div class="nav-icon">🐄</div>
          <div class="nav-label">Vacas</div>
        </div>
        <div class="nav-item" data-target="menu" onclick="navigateTo('menu')">
          <div class="nav-icon">☰</div>
          <div class="nav-label">Menú</div>
        </div>
      </div>
    </div>

    <!-- Bulk Registry Screen -->
    <div class="screen" id="bulkRegistry" style="display:none">
      <div class="topbar">
        <button class="btn ghost" onclick="navigateTo('dashboard')" style="padding:8px">←</button>
        <div class="title">Registro en bloque</div>
        <span class="badge">1/2</span>
      </div>

      <div class="card">
        <h3>Parámetros</h3>
        <div class="row" style="gap:8px; flex-wrap:wrap">
          <div class="badge">Fecha: <strong style="margin-left:6px;color:#c7f9cc">Hoy</strong></div>
          <div class="badge">Turno: <strong id="bulkBadgeShift" style="margin-left:6px;color:#c7f9cc">Mañana</strong></div>
          <div class="badge">Unidad: <strong id="bulkBadgeUnit" style="margin-left:6px;color:#c7f9cc">kg</strong></div>
        </div>
      </div>

      <div class="card">
        <div class="row">
          <h3 style="margin:0">Seleccionar vacas</h3>
          <button class="btn ghost" onclick="selectAllCows()">Todas</button>
          <button class="btn ghost" onclick="selectNoCows()">Ninguna</button>
        </div>

        <div class="scrollable" style="margin-top:12px">
          <div class="cow-checkbox">
            <div class="checkbox checked" onclick="toggleCow('brisa')" id="check-brisa"></div>
            <div class="avatar">BZ</div>
            <div style="flex:1">
              <div>Brisa (#032)</div>
              <div class="meta">Último: 2.9 kg • Ayer</div>
            </div>
            <input class="input" style="max-width:80px" placeholder="0.0" value="2.9" id="weight-brisa" onkeyup="updateTotal()" />
          </div>

          <div class="cow-checkbox">
            <div class="checkbox checked" onclick="toggleCow('clara')" id="check-clara"></div>
            <div class="avatar">CL</div>
            <div style="flex:1">
              <div>Clara (#077)</div>
              <div class="meta">Último: 3.1 kg • Ayer</div>
            </div>
            <input class="input" style="max-width:80px" placeholder="0.0" value="3.2" id="weight-clara" onkeyup="updateTotal()" />
          </div>

          <div class="cow-checkbox">
            <div class="checkbox" onclick="toggleCow('diva')" id="check-diva"></div>
            <div class="avatar">DV</div>
            <div style="flex:1">
              <div>Diva (#081)</div>
              <div class="meta">Último: 2.7 kg • 2 días</div>
            </div>
            <input class="input" style="max-width:80px" placeholder="0.0" id="weight-diva" onkeyup="updateTotal()" />
          </div>

          <div class="cow-checkbox">
            <div class="checkbox checked" onclick="toggleCow('luna')" id="check-luna"></div>
            <div class="avatar">LN</div>
            <div style="flex:1">
              <div>Luna (#045)</div>
              <div class="meta">Último: 3.5 kg • Ayer</div>
            </div>
            <input class="input" style="max-width:80px" placeholder="0.0" value="3.6" id="weight-luna" onkeyup="updateTotal()" />
          </div>
        </div>

        <div class="row" style="margin-top:12px">
          <span class="badge ok" id="selectedCount">3 seleccionadas</span>
          <span class="badge" id="totalWeight">Total estimado: 9.7 kg</span>
        </div>
      </div>

      <div class="footer">
        <button class="btn secondary full" onclick="navigateTo('dashboard')">Cancelar</button>
        <button class="btn full" onclick="navigateTo('bulkPreview')">Siguiente → Preview</button>
      </div>
    </div>

    <!-- Success Screen -->
    <div class="screen" id="success" style="display:none">
      <div class="welcome">
        <div class="welcome-icon" style="background:var(--ok)">✓</div>
        <h2 style="font-size:24px; margin:0 0 12px">¡Éxito!</h2>
        <p style="color:var(--muted); margin:0 0 32px" id="successMessage">Operación completada correctamente</p>
        <button class="btn full" onclick="navigateTo('dashboard')">Continuar</button>
      </div>
    </div>

    <!-- Error Screen -->
    <div class="screen" id="error" style="display:none">
      <div class="welcome">
        <div class="welcome-icon" style="background:var(--danger)">⚠</div>
        <h2 style="font-size:24px; margin:0 0 12px">Error</h2>
        <p style="color:var(--muted); margin:0 0 32px" id="errorMessage">Algo salió mal. Por favor intenta de nuevo.</p>
        <div class="row">
          <button class="btn secondary full" onclick="navigateTo('dashboard')">Ir al inicio</button>
          <button class="btn full" onclick="history.back()">Reintentar</button>
        </div>
      </div>
    </div>

    <!-- User Management (Admin Only) -->
    <div class="screen" id="userManagement" style="display:none">
      <div class="topbar">
        <button class="btn ghost" onclick="navigateTo('menu')" style="padding:8px">←</button>
        <div class="title">Gestionar usuarios</div>
        <span class="badge">Admin</span>
      </div>

      <div class="card">
        <h3>Usuarios actuales</h3>
        <div class="list">
          <div class="item">
            <div class="avatar">GC</div>
            <div style="flex:1">
              <div>Guillermo Cobeña</div>
              <div class="meta">admin@finca.com • Administrador</div>
            </div>
            <span class="badge ok">Activo</span>
          </div>
          <div class="item">
            <div class="avatar">JP</div>
            <div style="flex:1">
              <div>Juan Pérez</div>
              <div class="meta">vaquero@finca.com • Vaquero</div>
            </div>
            <span class="badge ok">Activo</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Invitar nuevo usuario</h3>
        <div class="field">
          <label>Email</label>
          <input class="input" placeholder="nuevo@finca.com" id="newUserEmail" />
        </div>
        <div class="field">
          <label>Rol</label>
          <div class="tabs">
            <div class="tab is-active" onclick="selectNewUserRole('vaquero')">Vaquero</div>
            <div class="tab" onclick="selectNewUserRole('admin')">Admin</div>
          </div>
        </div>
        <button class="btn full" onclick="inviteUser()">Enviar invitación</button>
      </div>
    </div>

    <!-- Reports (Admin Only) -->
    <div class="screen" id="reports" style="display:none">
      <div class="topbar">
        <button class="btn ghost" onclick="navigateTo('menu')" style="padding:8px">←</button>
        <div class="title">Reportes</div>
        <span class="badge">Admin</span>
      </div>

      <div class="stats">
        <div class="stat">
          <div class="meta">Producción mensual</div>
          <div class="kpi">3,847 L</div>
          <div class="badge">+12% vs mes anterior</div>
        </div>
        <div class="stat">
          <div class="meta">Promedio por vaca</div>
          <div class="kpi">3.2 L</div>
          <div class="badge">Óptimo</div>
        </div>
        <div class="stat">
          <div class="meta">Mejor vaca</div>
          <div class="kpi">Luna</div>
          <div class="badge">3.8 L promedio</div>
        </div>
        <div class="stat">
          <div class="meta">Ingresos estimados</div>
          <div class="kpi">$1,615</div>
          <div class="badge">Mes actual</div>
        </div>
      </div>

      <div class="card">
        <h3>Reportes disponibles</h3>
        <div class="list">
          <div class="item" onclick="generateReport('production')">
            <div class="avatar" style="background:var(--brand)">📊</div>
            <div style="flex:1">
              <div>Reporte de producción</div>
              <div class="meta">Análisis detallado por vaca y período</div>
            </div>
            <button class="btn ghost">Generar</button>
          </div>
          <div class="item" onclick="generateReport('financial')">
            <div class="avatar" style="background:var(--warning)">💰</div>
            <div style="flex:1">
              <div>Reporte financiero</div>
              <div class="meta">Ingresos y proyecciones</div>
            </div>
            <button class="btn ghost">Generar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Screen -->
    <div class="screen" id="settings" style="display:none">
      <div class="topbar">
        <button class="btn ghost" onclick="navigateTo('menu')" style="padding:8px">←</button>
        <div class="title">Ajustes</div>
        <span class="badge">App</span>
      </div>

      <div class="card">
        <h3>Preferencias</h3>
        <div class="list">
          <div class="item" onclick="changeUnit()">
            <div style="flex:1">
              <div>Unidad por defecto</div>
              <div class="meta" id="settingsUnitMeta">kg</div>
            </div>
            <button class="btn ghost">Cambiar</button>
          </div>
          <div class="item" onclick="changeDefaultShift()">
            <div style="flex:1">
              <div>Turno por defecto</div>
              <div class="meta" id="settingsShiftMeta">Mañana</div>
            </div>
            <button class="btn ghost">Cambiar</button>
          </div>
          <div class="item" onclick="changeSyncFreq()">
            <div style="flex:1">
              <div>Frecuencia de sync</div>
              <div class="meta">Cada 15 min</div>
            </div>
            <button class="btn ghost">Cambiar</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Datos</h3>
        <div class="list">
          <div class="item" onclick="exportData()">
            <div style="flex:1">
              <div>Exportar datos</div>
              <div class="meta">Descargar registros en CSV</div>
            </div>
            <button class="btn ghost">Exportar</button>
          </div>
          <div class="item" onclick="clearCache()">
            <div style="flex:1">
              <div>Limpiar caché</div>
              <div class="meta">Liberar espacio local</div>
            </div>
            <button class="btn ghost">Limpiar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cows Screen -->
    <div class="screen with-nav" id="cows" style="display:none">
      <div class="topbar">
        <div class="logo"></div>
        <div class="title">Vacas</div>
        <button class="btn ghost" onclick="addNewCow()" id="addCowBtn">+ Nueva</button>
      </div>

      <div class="card">
        <div class="row">
          <div class="col field">
            <input class="input" placeholder="Buscar por alias / #" onkeyup="filterCowsMain()" id="cowSearchMain" />
          </div>
          <div class="col">
            <button class="btn secondary full" onclick="showFilters()">Filtros</button>
          </div>
        </div>
      </div>

      <!-- Role-based message for Vaqueros -->
      <div class="card" id="vaqueroMessage" style="display:none">
        <div class="row">
          <div class="avatar" style="background:var(--warning)">ℹ️</div>
          <div style="flex:1">
            <div>Vista de solo lectura</div>
            <div class="meta">Los vaqueros pueden ver vacas pero no editarlas</div>
          </div>
        </div>
      </div>

      <div class="list" id="cowsMainList">
        <div class="item" onclick="navigateTo('cowDetail', 'brisa')">
          <div class="avatar">BZ</div>
          <div style="flex:1">
            <div>Brisa (#032)</div>
            <div class="meta">Último: 2.9 kg • 08:21 • Holstein</div>
          </div>
          <button class="btn ghost editCowBtn" onclick="event.stopPropagation(); editCow('brisa')">Editar</button>
        </div>
        <div class="item" onclick="navigateTo('cowDetail', 'clara')">
          <div class="avatar">CL</div>
          <div style="flex:1">
            <div>Clara (#077)</div>
            <div class="meta">Último: 3.1 kg • 08:18 • Jersey</div>
          </div>
          <button class="btn ghost editCowBtn" onclick="event.stopPropagation(); editCow('clara')">Editar</button>
        </div>
        <div class="item" onclick="navigateTo('cowDetail', 'diva')">
          <div class="avatar">DV</div>
          <div style="flex:1">
            <div>Diva (#081)</div>
            <div class="meta">Último: 2.7 kg • 2 días • Holstein</div>
          </div>
          <button class="btn ghost editCowBtn" onclick="event.stopPropagation(); editCow('diva')">Editar</button>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="nav-bottom">
        <div class="nav-item" data-target="dashboard" onclick="navigateTo('dashboard')">
          <div class="nav-icon">📊</div>
          <div class="nav-label">Dashboard</div>
        </div>
        <div class="nav-item" data-target="milkRegistry" onclick="navigateTo('milkRegistry')">
          <div class="nav-icon">🥛</div>
          <div class="nav-label">Registrar</div>
        </div>
        <div class="nav-item active" data-target="cows" onclick="navigateTo('cows')">
          <div class="nav-icon">🐄</div>
          <div class="nav-label">Vacas</div>
        </div>
        <div class="nav-item" data-target="menu" onclick="navigateTo('menu')">
          <div class="nav-icon">☰</div>
          <div class="nav-label">Menú</div>
        </div>
      </div>
    </div>

    <!-- Menu Screen -->
    <div class="screen" id="menu" style="display:none">
      <div class="topbar">
        <div class="logo"></div>
        <div class="title">Menú</div>
        <div class="status-dot"><span class="dot"></span> Online</div>
      </div>

      <!-- User info -->
      <div class="card">
        <div class="row">
          <div class="avatar" style="width:60px; height:60px; font-size:20px" id="menuUserAvatar">GC</div>
          <div style="flex:1">
            <h3 style="margin:0" id="menuUserName">Usuario</h3>
            <div class="meta" id="menuUserEmail">email@finca.com</div>
            <span class="badge" id="menuUserRole">Rol</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Acciones principales</h3>
        <div class="list">
          <div class="item" onclick="navigateTo('milkRegistry')">
            <div class="avatar" style="background:var(--brand)">🥛</div>
            <div style="flex:1">
              <div>Registrar leche</div>
              <div class="meta">Registro individual rápido</div>
            </div>
            <span class="badge">Rápido</span>
          </div>
          <div class="item" onclick="navigateTo('bulkRegistry')">
            <div class="avatar" style="background:#3b82f6">📊</div>
            <div style="flex:1">
              <div>Registro en bloque</div>
              <div class="meta">Múltiples vacas a la vez</div>
            </div>
            <span class="badge">Batch</span>
          </div>
          <div class="item" onclick="navigateTo('cows')">
            <div class="avatar" style="background:#8b5cf6">🐄</div>
            <div style="flex:1">
              <div>Gestionar vacas</div>
              <div class="meta">Ver, agregar, editar</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Only Section -->
      <div class="card" id="menuAdminSection" style="display:none">
        <h3>Administración</h3>
        <div class="list">
          <div class="item" onclick="navigateTo('userManagement')">
            <div class="avatar" style="background:#8b5cf6">👥</div>
            <div style="flex:1">
              <div>Gestionar usuarios</div>
              <div class="meta">Invitar vaqueros, asignar roles</div>
            </div>
            <span class="badge">Admin</span>
          </div>
          <div class="item" onclick="navigateTo('reports')">
            <div class="avatar" style="background:#f59e0b">📊</div>
            <div style="flex:1">
              <div>Reportes avanzados</div>
              <div class="meta">Análisis de producción detallado</div>
            </div>
            <span class="badge">Admin</span>
          </div>
        </div>
      </div>

      <div class="card">
        <h3>Configuración</h3>
        <div class="list">
          <div class="item" onclick="navigateTo('settings')">
            <div class="avatar" style="background:#6b7280">⚙️</div>
            <div style="flex:1">
              <div>Ajustes</div>
              <div class="meta">Preferencias y configuración</div>
            </div>
          </div>
          <div class="item" onclick="logout()">
            <div class="avatar" style="background:var(--danger)">🚪</div>
            <div style="flex:1">
              <div>Cerrar sesión</div>
              <div class="meta">Salir de la aplicación</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Navigation -->
      <div class="nav-bottom">
        <div class="nav-item" data-target="dashboard" onclick="navigateTo('dashboard')">
          <div class="nav-icon">📊</div>
          <div class="nav-label">Dashboard</div>
        </div>
        <div class="nav-item" data-target="milkRegistry" onclick="navigateTo('milkRegistry')">
          <div class="nav-icon">🥛</div>
          <div class="nav-label">Registrar</div>
        </div>
        <div class="nav-item" data-target="cows" onclick="navigateTo('cows')">
          <div class="nav-icon">🐄</div>
          <div class="nav-label">Vacas</div>
        </div>
        <div class="nav-item" data-target="menu" onclick="navigateTo('menu')">
          <div class="nav-icon">☰</div>
          <div class="nav-label">Menú</div>
        </div>
      </div>
    </div>
  `;
}

// ===============================
// Navigation
// ===============================
function navigateTo(id, payload) {
    // Oculta todas
    document.querySelectorAll('.screen').forEach(s => {
        s.style.display = (s.id === id ? 'block' : 'none');
    });

    // Actualiza estado actual
    current.screen = id;
    if (id === 'cowDetail' && payload) current.selectedCow = payload;

    // Actualiza bottom nav activo (si existe en esa screen)
    const screen = document.getElementById(id);
    if (screen) {
        const navItems = screen.querySelectorAll('.nav-bottom .nav-item');
        if (navItems.length) {
            navItems.forEach(n => n.classList.remove('active'));
            const active = screen.querySelector(`.nav-bottom .nav-item[data-target="${id}"]`);
            if (active) active.classList.add('active');
        }
    }

    // Hooks de pantalla
    if (id === 'milkRegistry') refreshRegistryParams();
    if (id === 'bulkRegistry') syncBulkBadges();
}
function updateNavigation() {
    // placeholder: aquí puedes cargar estado de sync, rol, etc.
}

// ===============================
// Bulk Registry
// ===============================
function initializeBulkSelection() {
    // genera defaults tomando appData
    const byId = Object.fromEntries(appData.cows.map(c => [c.id, c]));
    bulkSelection = {
        'brisa': { weight: byId['brisa']?.lastWeight ?? 0, cow: byId['brisa'] },
        'clara': { weight: 3.2, cow: byId['clara'] },
        'luna': { weight: byId['luna']?.lastWeight ?? 0, cow: byId['luna'] },
    };
    updateTotal();
}
function selectAllCows() {
    Object.keys(bulkSelection).concat(['diva']).forEach(id => {
        const chk = document.getElementById(`check-${id}`);
        if (chk) chk.classList.add('checked');
    });
    updateTotal();
}
function selectNoCows() {
    ['brisa', 'clara', 'luna', 'diva'].forEach(id => {
        const chk = document.getElementById(`check-${id}`);
        if (chk) chk.classList.remove('checked');
    });
    updateTotal();
}
function toggleCow(id) {
    const el = document.getElementById(`check-${id}`);
    if (!el) return;
    el.classList.toggle('checked');
    updateTotal();
}
function updateTotal() {
    const ids = ['brisa', 'clara', 'luna', 'diva'];
    let total = 0, count = 0;
    ids.forEach(id => {
        const checked = document.getElementById(`check-${id}`)?.classList.contains('checked');
        const val = parseFloat(document.getElementById(`weight-${id}`)?.value || '0');
        if (checked) {
            count++;
            if (!Number.isNaN(val)) total += val;
        }
    });
    const unit = settings.defaultUnit;
    const sc = document.getElementById('selectedCount');
    const tw = document.getElementById('totalWeight');
    if (sc) sc.textContent = `${count} seleccionadas`;
    if (tw) tw.textContent = `Total estimado: ${total.toFixed(1)} ${unit}`;
}
function syncBulkBadges() {
    const shiftName = shiftToText(settings.defaultShift);
    const unit = settings.defaultUnit;
    const s = document.getElementById('bulkBadgeShift');
    const u = document.getElementById('bulkBadgeUnit');
    if (s) s.textContent = shiftName;
    if (u) u.textContent = unit;
}

// ===============================
// Individual Registry
// ===============================
function refreshRegistryParams() {
    const shiftName = shiftToText(settings.defaultShift);
    const unit = settings.defaultUnit;
    const s = document.getElementById('badgeShift');
    const u = document.getElementById('badgeUnit');
    const su = document.getElementById('settingsUnitMeta');
    const ss = document.getElementById('settingsShiftMeta');
    if (s) s.textContent = shiftName;
    if (u) u.textContent = unit;
    if (su) su.textContent = unit;
    if (ss) ss.textContent = shiftName;
}
function selectCow(id, initials, alias, number) {
    current.selectedCow = { id, initials, alias, number };
    validateSave();
}
function selectShiftRegistry(shift) {
    settings.defaultShift = shift; // 'morning' | 'afternoon' | 'evening'
    // toggle tabs
    document.querySelectorAll('#shiftTabs .tab').forEach(t => {
        t.classList.toggle('is-active', t.dataset.shift === shift);
    });
    refreshRegistryParams();
}
function addNumber(ch) {
    // evita duplicar '.' y limita longitudes razonables
    if (ch === '.' && current.weight.includes('.')) return;
    if (current.weight.length >= 6) return; // 999.99
    current.weight = (current.weight + ch).replace(/^0(\d)/, '$1'); // limpia 0 inicial
    const el = document.getElementById('weightInput');
    if (el) el.value = current.weight;
    validateSave();
}
function deleteLast() {
    current.weight = current.weight.slice(0, -1);
    const el = document.getElementById('weightInput');
    if (el) el.value = current.weight;
    validateSave();
}
function clearRegistry() {
    current.weight = '';
    const el = document.getElementById('weightInput');
    if (el) el.value = '';
    validateSave();
}
function validateSave() {
    const ok = !!current.selectedCow && parseFloat(current.weight) > 0;
    const btn = document.getElementById('saveBtn');
    if (btn) btn.disabled = !ok;
    return ok;
}
function saveRegistry() {
    if (!validateSave()) return;
    // TODO: guardar en IndexedDB/LocalStorage con estado de sync
    const msg = `Registrado ${parseFloat(current.weight).toFixed(2)} ${settings.defaultUnit} para ${current.selectedCow?.alias || ''}`;
    const sm = document.getElementById('successMessage');
    if (sm) sm.textContent = msg;
    navigateTo('success');
    // limpia
    clearRegistry();
    current.selectedCow = null;
}

// ===============================
// Login demo y roles
// ===============================
function quickLogin(email) {
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').value = email.startsWith('admin') ? 'admin123' : 'vaquero123';
}
function handleLogin() {
    const email = (document.getElementById('loginEmail').value || '').trim();
    const role = email.startsWith('admin') ? 'Admin' : 'Vaquero';

    navigateTo('dashboard');

    // Texto de bienvenida y secciones según rol
    const greet = document.getElementById('userGreeting');
    const urole = document.getElementById('userRole');
    const rbadge = document.getElementById('roleBadge');
    if (greet) greet.textContent = `¡Hola ${role}!`;
    if (urole) urole.textContent = `${role} • Finca Dos Hermanos`;
    if (rbadge) rbadge.textContent = role;

    const adminSec = document.getElementById('adminSection');
    const menuAdmin = document.getElementById('menuAdminSection');
    const vaqMsg = document.getElementById('vaqueroMessage');

    if (adminSec) adminSec.style.display = role === 'Admin' ? 'block' : 'none';
    if (menuAdmin) menuAdmin.style.display = role === 'Admin' ? 'block' : 'none';
    if (vaqMsg) vaqMsg.style.display = role === 'Admin' ? 'none' : 'block';

    // Editar botón visible solo para admin
    document.querySelectorAll('.editCowBtn').forEach(b => b.style.display = role === 'Admin' ? '' : 'none');

    // Info en menú
    const mName = document.getElementById('menuUserName');
    const mEmail = document.getElementById('menuUserEmail');
    const mRole = document.getElementById('menuUserRole');
    if (mName) mName.textContent = role === 'Admin' ? 'Administrador' : 'Vaquero';
    if (mEmail) mEmail.textContent = email || (role === 'Admin' ? 'admin@finca.com' : 'vaquero@finca.com');
    if (mRole) mRole.textContent = role;
}

// ===============================
// Settings helpers
// ===============================
function changeUnit() {
    settings.defaultUnit = (settings.defaultUnit === 'kg' ? 'lb' : 'kg');
    refreshRegistryParams();
    syncBulkBadges();
    updateTotal();
}
function changeDefaultShift() {
    const order = ['morning', 'afternoon', 'evening'];
    const idx = order.indexOf(settings.defaultShift);
    settings.defaultShift = order[(idx + 1) % order.length];
    refreshRegistryParams();
    syncBulkBadges();
}
function changeSyncFreq() {
    // placeholder
    alert('Frecuencia de sync actualizada (placeholder).');
}
function exportData() {
    // placeholder
    alert('Exportando CSV (placeholder).');
}
function clearCache() {
    // placeholder
    alert('Caché limpiada (placeholder).');
}
function logout() {
    navigateTo('login');
}

// ===============================
// Misc stubs
// ===============================
function filterCows() { /* TODO */ }
function filterCowsMain() { /* TODO */ }
function editRecord() { /* TODO */ }
function addNewCow() {
  navigateTo('addCow');
}
function editCow(id) { alert('Editar ' + id + ' (placeholder)'); }
function showFilters() { alert('Filtros (placeholder)'); }
function selectNewUserRole() { /* TODO */ }
function inviteUser() { alert('Invitación enviada (placeholder)'); }
function generateReport(kind) { alert('Generando reporte: ' + kind); }

// ===============================
// Utils
// ===============================
function shiftToText(shift) {
    return ({ morning: 'Mañana', afternoon: 'Tarde', evening: 'Noche' }[shift] || 'Mañana');
}

// ===============================
// Funciones faltantes
// ===============================

// Editar vaca
function editCow(cowId) {
    // Simular edición
    alert(`Editando vaca: ${cowId}`);
    // O navegar a una pantalla de edición:
    // navigateTo('editCow', cowId);
}

// Agregar nueva vaca
function addNewCow() {
    // Simular agregar vaca
    alert('Agregando nueva vaca...');
    // O navegar a pantalla de agregar:
    // navigateTo('addCow');
}

// Preview del registro en bloque
function navigateToBulkPreview() {
    navigateTo('bulkPreview');
}

// Actualizar la función saveBulkRegistry para que use la navegación correcta
function saveBulkRegistry() {
    const records = Object.values(bulkSelection).filter(item => item.weight > 0);

    if (records.length === 0) {
        showError('Selecciona al menos una vaca con peso');
        return;
    }

    showSuccess(`¡${records.length} registros guardados exitosamente!`);
    setTimeout(() => {
        navigateTo('dashboard');
    }, 1500);
}

// ===============================
// Agregar vaca - funciones
// ===============================

let newCowStatus = 'active';

function addNewCow() {
  navigateTo('addCow');
}

function selectCowStatus(status) {
  newCowStatus = status;
  // Update tab states
  document.querySelectorAll('#cowStatusTabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

function addCowPhoto() {
  alert('Funcionalidad de agregar foto (simulada)');
}

function saveNewCow() {
  const alias = document.getElementById('newCowAlias').value.trim();
  const number = document.getElementById('newCowNumber').value.trim();
  const breed = document.getElementById('newCowBreed').value.trim();
  const weight = document.getElementById('newCowWeight').value;
  const birthDate = document.getElementById('newCowBirthDate').value;
  const notes = document.getElementById('newCowNotes').value.trim();
  
  // Validaciones básicas
  if (!alias) {
    showError('El alias es requerido');
    return;
  }
  
  if (!number) {
    showError('El número oficial es requerido');
    return;
  }
  
  // Verificar que el número no esté duplicado
  const existingCow = appData.cows.find(c => c.number === number);
  if (existingCow) {
    showError(`El número ${number} ya existe para ${existingCow.alias}`);
    return;
  }
  
  // Generar avatar de las iniciales
  const initials = alias.substring(0, 2).toUpperCase();
  
  // Crear nueva vaca
  const newCow = {
    id: `cow_${Date.now()}`,
    alias: alias,
    number: number,
    initials: initials,
    breed: breed || 'Holstein',
    lastWeight: parseFloat(weight) || 0,
    status: newCowStatus,
    birthDate: birthDate || null,
    notes: notes || null,
    createdAt: new Date().toISOString()
  };
  
  // Agregar a la lista
  appData.cows.push(newCow);
  
  // Mensaje de éxito
  showSuccess(`¡Vaca ${alias} agregada exitosamente!`);
  
  // Limpiar formulario
  clearAddCowForm();
  
  // Volver a la lista después de 1.5 segundos
  setTimeout(() => {
    navigateTo('cows');
  }, 1500);
}

function clearAddCowForm() {
  document.getElementById('newCowAlias').value = '';
  document.getElementById('newCowNumber').value = '';
  document.getElementById('newCowBreed').value = 'Holstein';
  document.getElementById('newCowWeight').value = '';
  document.getElementById('newCowBirthDate').value = '';
  document.getElementById('newCowNotes').value = '';
  newCowStatus = 'active';
  
  // Reset tabs
  document.querySelectorAll('#cowStatusTabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  document.querySelector('#cowStatusTabs .tab').classList.add('is-active');
}

// ===============================
// Editar vaca - funciones
// ===============================

let currentEditingCowId = null;
let editCowStatus = 'active';

function editCow(cowId) {
  currentEditingCowId = cowId;
  const cow = appData.cows.find(c => c.id === cowId);
  
  if (!cow) {
    showError('Vaca no encontrada');
    return;
  }
  
  // Cargar datos en el formulario
  document.getElementById('editCowAlias').value = cow.alias || '';
  document.getElementById('editCowNumber').value = cow.number || '';
  document.getElementById('editCowBreed').value = cow.breed || '';
  document.getElementById('editCowWeight').value = cow.lastWeight || '';
  document.getElementById('editCowBirthDate').value = cow.birthDate || '';
  document.getElementById('editCowNotes').value = cow.notes || '';
  
  // Set status
  editCowStatus = cow.status || 'active';
  
  // Update status tabs
  document.querySelectorAll('#editCowStatusTabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  const activeTab = document.querySelector(`#editCowStatusTabs .tab[onclick*="${editCowStatus}"]`);
  if (activeTab) activeTab.classList.add('is-active');
  
  // Update stats
  updateEditCowStats(cow);
  
  // Navigate to edit screen
  navigateTo('editCow');
}

function selectEditCowStatus(status) {
  editCowStatus = status;
  // Update tab states
  document.querySelectorAll('#editCowStatusTabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

function updateEditCowStats(cow) {
  // Get records for this cow
  const cowRecords = appData.milkRecords ? appData.milkRecords.filter(r => r.cowId === cow.id) : [];
  
  // Update last milk
  const lastRecord = cowRecords[cowRecords.length - 1];
  document.getElementById('editCowLastMilk').textContent = lastRecord ? `${lastRecord.weight} kg` : 'Sin registros';
  document.getElementById('editCowLastDate').textContent = lastRecord ? 'Hace 1 día' : 'Nunca';
  
  // Update total records
  document.getElementById('editCowTotalRecords').textContent = cowRecords.length.toString();
}

function saveEditCow() {
  const alias = document.getElementById('editCowAlias').value.trim();
  const number = document.getElementById('editCowNumber').value.trim();
  const breed = document.getElementById('editCowBreed').value.trim();
  const weight = document.getElementById('editCowWeight').value;
  const birthDate = document.getElementById('editCowBirthDate').value;
  const notes = document.getElementById('editCowNotes').value.trim();
  
  // Validaciones
  if (!alias) {
    showError('El alias es requerido');
    return;
  }
  
  if (!number) {
    showError('El número oficial es requerido');
    return;
  }
  
  // Verificar duplicados (excepto la vaca actual)
  const existingCow = appData.cows.find(c => c.number === number && c.id !== currentEditingCowId);
  if (existingCow) {
    showError(`El número ${number} ya existe para ${existingCow.alias}`);
    return;
  }
  
  // Encontrar y actualizar la vaca
  const cowIndex = appData.cows.findIndex(c => c.id === currentEditingCowId);
  if (cowIndex === -1) {
    showError('Vaca no encontrada');
    return;
  }
  
  // Actualizar datos
  const updatedCow = {
    ...appData.cows[cowIndex],
    alias: alias,
    number: number,
    initials: alias.substring(0, 2).toUpperCase(),
    breed: breed || 'Holstein',
    lastWeight: parseFloat(weight) || 0,
    status: editCowStatus,
    birthDate: birthDate || null,
    notes: notes || null,
    updatedAt: new Date().toISOString()
  };
  
  appData.cows[cowIndex] = updatedCow;
  
  // Mensaje de éxito
  showSuccess(`¡Vaca ${alias} actualizada exitosamente!`);
  
  // Volver a la lista
  setTimeout(() => {
    navigateTo('cows');
  }, 1500);
}

function deleteCow(cowId) {
  const cow = appData.cows.find(c => c.id === cowId);
  if (!cow) {
    showError('Vaca no encontrada');
    return;
  }
  
  if (confirm(`¿Estás seguro de eliminar a ${cow.alias}? Esta acción no se puede deshacer.`)) {
    // Eliminar de la lista
    appData.cows = appData.cows.filter(c => c.id !== cowId);
    
    // También eliminar registros asociados si existen
    if (appData.milkRecords) {
      appData.milkRecords = appData.milkRecords.filter(r => r.cowId !== cowId);
    }
    
    showSuccess(`Vaca ${cow.alias} eliminada exitosamente`);
    setTimeout(() => {
      navigateTo('cows');
    }, 1500);
  }
}

function duplicateCow(cowId) {
  const cow = appData.cows.find(c => c.id === cowId);
  if (!cow) {
    showError('Vaca no encontrada');
    return;
  }
  
  // Crear copia con nuevo ID y número
  const newNumber = `${cow.number}_copy`;
  const newAlias = `${cow.alias} (Copia)`;
  
  const duplicatedCow = {
    ...cow,
    id: `cow_${Date.now()}`,
    alias: newAlias,
    number: newNumber,
    initials: newAlias.substring(0, 2).toUpperCase(),
    createdAt: new Date().toISOString()
  };
  
  appData.cows.push(duplicatedCow);
  
  showSuccess(`Vaca duplicada como ${newAlias}`);
  setTimeout(() => {
    navigateTo('cows');
  }, 1500);
}

function viewCowHistory(cowId) {
  const cow = appData.cows.find(c => c.id === cowId);
  if (!cow) {
    showError('Vaca no encontrada');
    return;
  }
  
  const records = appData.milkRecords ? appData.milkRecords.filter(r => r.cowId === cowId) : [];
  alert(`Historial de ${cow.alias}:\n${records.length} registros encontrados\n\n(Pantalla de historial detallado próximamente)`);
}


// ===============================
// Register - variables globales
// ===============================
let registerCowCount = '1-10';
let registerUnit = 'kg';
let registerShift = 'morning';

// ===============================
// Register - funciones
// ===============================
function selectRegisterCowCount(count) {
  registerCowCount = count;
  document.querySelectorAll('#registerCowCountTabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

function selectRegisterUnit(unit) {
  registerUnit = unit;
  document.querySelectorAll('#registerUnitTabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

function selectRegisterShift(shift) {
  registerShift = shift;
  document.querySelectorAll('#registerShiftTabs .tab').forEach(tab => {
    tab.classList.remove('is-active');
  });
  event.target.classList.add('is-active');
}

function handleRegister() {
  const firstName = document.getElementById('registerFirstName').value.trim();
  const lastName = document.getElementById('registerLastName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  const farmName = document.getElementById('registerFarmName').value.trim();
  const farmLocation = document.getElementById('registerFarmLocation').value.trim();
  const termsAccepted = document.getElementById('registerTerms').checked;

  // Validaciones
  if (!firstName || !lastName) {
    showError('Nombre y apellido son requeridos');
    return;
  }

  if (!email) {
    showError('El email es requerido');
    return;
  }

  if (!validateEmail(email)) {
    showError('Ingresa un email válido');
    return;
  }

  if (!password || password.length < 6) {
    showError('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  if (password !== confirmPassword) {
    showError('Las contraseñas no coinciden');
    return;
  }

  if (!farmName) {
    showError('El nombre de la finca es requerido');
    return;
  }

  if (!termsAccepted) {
    showError('Debes aceptar los términos y condiciones');
    return;
  }

  // Verificar si el email ya existe
  if (appData.users && appData.users[email]) {
    showError('Este email ya está registrado');
    return;
  }

  // Crear nuevo usuario
  const newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password, // En producción esto debe estar hasheado
    role: 'admin', // El primer usuario siempre es admin
    createdAt: new Date().toISOString()
  };

  // Crear tenant/finca
  const newTenant = {
    name: farmName,
    location: farmLocation,
    cowCount: registerCowCount,
    defaultUnit: registerUnit,
    defaultShift: registerShift,
    owner: newUser,
    createdAt: new Date().toISOString()
  };

  // Guardar en appData
  if (!appData.users) appData.users = {};
  appData.users[email] = newUser;
  appData.tenant = newTenant;

  // Configurar settings iniciales
  settings.defaultUnit = registerUnit;
  settings.defaultShift = registerShift;

  // Auto-login del nuevo usuario
  currentUser = newUser;

  showSuccess('¡Cuenta creada exitosamente! Bienvenido a LecheFácil');
  
  setTimeout(() => {
    navigateTo('dashboard');
    // Actualizar UI para el nuevo usuario
    updateUIAfterRegister(newUser, newTenant);
  }, 1500);
}

function updateUIAfterRegister(user, tenant) {
  // Actualizar dashboard
  const greet = document.getElementById('userGreeting');
  const urole = document.getElementById('userRole');
  const rbadge = document.getElementById('roleBadge');
  
  if (greet) greet.textContent = `¡Hola ${user.firstName}!`;
  if (urole) urole.textContent = `Administrador • ${tenant.name}`;
  if (rbadge) rbadge.textContent = 'Admin';

  // Mostrar secciones de admin
  const adminSec = document.getElementById('adminSection');
  const menuAdmin = document.getElementById('menuAdminSection');
  
  if (adminSec) adminSec.style.display = 'block';
  if (menuAdmin) menuAdmin.style.display = 'block';

  // Info en menú
  const mName = document.getElementById('menuUserName');
  const mEmail = document.getElementById('menuUserEmail');
  const mRole = document.getElementById('menuUserRole');
  
  if (mName) mName.textContent = `${user.firstName} ${user.lastName}`;
  if (mEmail) mEmail.textContent = user.email;
  if (mRole) mRole.textContent = 'Administrador';
}

// Función helper para validar email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}