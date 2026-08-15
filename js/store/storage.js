// LocalStorage persistence and initial seeding

const STORAGE_KEY = 'computer_shop_os_3d_data';

export const initialSeedAccounts = [
  {
    id: 1,
    name: 'Ricky',
    pin: '1234',
    gridSlot: 0,
    age: 9,
    ageGroup: 'child', // < 13
    avatar: null, // Legacy account without avatar
    remainingSeconds: 1800,
    dailyLimitSeconds: 1800,
    weeklySeconds: 3420,
    lockedToday: false,
    lessonsCompleted: ['home-row', 'words-easy'],
    lastLogin: null
  },
  {
    id: 2,
    name: 'Migs',
    pin: '1234',
    gridSlot: 1,
    age: 14,
    ageGroup: 'teen', // 13+
    avatar: null, // Legacy account without avatar
    remainingSeconds: 1800,
    dailyLimitSeconds: 1800,
    weeklySeconds: 4800,
    lockedToday: false,
    lessonsCompleted: ['top-row', 'mission-1'],
    lastLogin: null
  },
  {
    id: 3,
    name: 'Alex',
    pin: '1234',
    gridSlot: 2,
    age: 11,
    ageGroup: 'child',
    avatar: {
      skinColor: '#ffd1a4',
      hairStyle: 'spiky',
      hairColor: '#3b82f6',
      faceType: 'happy',
      outfitType: 'hoodie',
      primaryColor: '#06b6d4',
      secondaryColor: '#1e293b',
      backGear: 'wings',
      accessoryColor: '#ec4899'
    },
    remainingSeconds: 1800,
    dailyLimitSeconds: 1800,
    weeklySeconds: 2900,
    lockedToday: false,
    lessonsCompleted: ['home-f', 'home-j'],
    lastLogin: null
  },
  {
    id: 4,
    name: 'Zoe',
    pin: '1234',
    gridSlot: 3,
    age: 15,
    ageGroup: 'teen',
    avatar: {
      skinColor: '#f1c27d',
      hairStyle: 'ponytail',
      hairColor: '#ec4899',
      faceType: 'cool',
      outfitType: 'cyber',
      primaryColor: '#8b5cf6',
      secondaryColor: '#06b6d4',
      backGear: 'jetpack',
      accessoryColor: '#f59e0b'
    },
    remainingSeconds: 1800,
    dailyLimitSeconds: 1800,
    weeklySeconds: 6100,
    lockedToday: false,
    lessonsCompleted: ['words-space', 'mission-1'],
    lastLogin: null
  }
];

export class StorageService {
  static load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
    }
    return {
      accounts: initialSeedAccounts,
      nextId: 5,
      currentPilotId: null,
      adminPin: 'admin1234'
    };
  }

  static save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
}
