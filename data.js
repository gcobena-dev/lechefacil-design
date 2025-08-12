// App State
let currentScreen = 'splash';
let selectedCow = null;
let registryWeight = '';
let registryShift = 'morning';
let selectedUnit = 'kg';
let bulkSelection = {};
let currentUser = null;

// Application Data
let appData = {
  users: {
    'admin@finca.com': { 
      email: 'admin@finca.com', 
      firstName: 'Guillermo', 
      lastName: 'Cobeña', 
      role: 'admin',
      password: 'admin123'
    },
    'vaquero@finca.com': { 
      email: 'vaquero@finca.com', 
      firstName: 'Juan', 
      lastName: 'Pérez', 
      role: 'vaquero',
      password: 'vaquero123'
    }
  },
  tenant: { 
    name: 'Dos Hermanos', 
    location: 'Esmeraldas, EC' 
  },
  cows: [
    { id: 'brisa', alias: 'Brisa', number: '#032', avatar: 'BZ', breed: 'Holstein', lastWeight: 2.9, status: 'active' },
    { id: 'clara', alias: 'Clara', number: '#077', avatar: 'CL', breed: 'Jersey', lastWeight: 3.1, status: 'active' },
    { id: 'diva', alias: 'Diva', number: '#081', avatar: 'DV', breed: 'Holstein', lastWeight: 2.7, status: 'active' },
    { id: 'luna', alias: 'Luna', number: '#045', avatar: 'LN', breed: 'Jersey', lastWeight: 3.5, status: 'active' }
  ],
  milkRecords: [
    { id: 1, cowId: 'brisa', weight: 2.9, shift: 'morning', date: new Date(), synced: true },
    { id: 2, cowId: 'clara', weight: 3.1, shift: 'morning', date: new Date(), synced: false },
    { id: 3, cowId: 'luna', weight: 3.6, shift: 'morning', date: new Date(), synced: true }
  ]
};

// Initialize bulk selection with default values
bulkSelection = {
  'brisa': { weight: 2.9, cow: appData.cows[0] },
  'clara': { weight: 3.2, cow: appData.cows[1] },
  'luna': { weight: 3.6, cow: appData.cows[2] },
  'paloma': { weight: 4.0, cow: appData.cows[3] }
};