// Standalone HTTP & Monitoring API Server for Computer Shop OS 3D
// Fully compatible with Shop Admin Console and Activity Dashboard
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 5173;
const MONITORING_PORT = process.env.MONITORING_PORT || 4750;
const TOKEN = process.env.MONITORING_TOKEN || '60a67180b6a38a2b5002634319e5be9e';
const DATA_DIR = path.join(__dirname, 'data');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

// Ensure data directory
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed if no accounts file
const initialAccounts = [
  {
    id: 1,
    name: 'Ricky',
    pin: '1234',
    gridSlot: 0,
    age: 9,
    ageGroup: 'child',
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
    ageGroup: 'teen',
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

function loadAccountsData() {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8'));
      if (Array.isArray(data.accounts)) return data;
    }
  } catch (e) {
    console.error('Failed to load accounts.json:', e);
  }
  const defaultData = {
    accounts: initialAccounts,
    nextId: 5,
    activePilotId: null
  };
  saveAccountsData(defaultData);
  return defaultData;
}

function saveAccountsData(data) {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to save accounts.json:', e);
  }
}

// In-memory Store
let accountsState = loadAccountsData();
let sseClients = [];

function broadcastSSE(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(res => {
    try {
      res.write(payload);
    } catch (e) {}
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg'
};

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        // Try parsing relaxed JSON or urlencoded if needed
        try {
          const parsed = {};
          body.split('&').forEach(pair => {
            const [k, v] = pair.split('=');
            if (k) parsed[decodeURIComponent(k)] = decodeURIComponent(v || '');
          });
          resolve(parsed);
        } catch (err2) {
          resolve({});
        }
      }
    });
    req.on('error', () => resolve({}));
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-account-session, x-admin-password');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  const send = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // --- Real-time Server-Sent Events Stream ---
  if (pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    sseClients.push(res);
    req.on('close', () => {
      sseClients = sseClients.filter(c => c !== res);
    });
    // Send current state on connect
    res.write(`event: init\ndata: ${JSON.stringify(accountsState)}\n\n`);
    return;
  }

  // --- Activity Dashboard & Kiosk Monitoring API Endpoints ---
  if (pathname.startsWith('/api/')) {
    // 1. Health Heartbeat
    if (pathname === '/api/health') {
      const activePilot = accountsState.accounts.find(a => a.id === accountsState.activePilotId);
      return send(200, {
        ok: true,
        terminalName: 'KIOSK-01',
        pilotName: activePilot ? activePilot.name : null,
        playSessionActive: !!(activePilot && !activePilot.lockedToday && activePilot.remainingSeconds > 0),
        screenEnabled: true,
        controlEnabled: true,
        hostingEnabled: true,
        version: '1.0.0-3d'
      });
    }

    // 2. Accounts List
    if (pathname === '/api/accounts' && req.method === 'GET') {
      return send(200, {
        ok: true,
        accounts: accountsState.accounts,
        dailyLimitSeconds: 1800
      });
    }

    // 3. Grant Playtime (Activity Dashboard + Admin Console)
    if (pathname === '/api/accounts/grant-time' && req.method === 'POST') {
      const body = await readBody(req);
      const accountId = Number(body.accountId || body.id || parsedUrl.searchParams.get('accountId') || parsedUrl.searchParams.get('id'));
      const minutes = Number(body.minutes || parsedUrl.searchParams.get('minutes')) || 15;
      
      let acct = accountsState.accounts.find(a => a.id === accountId);
      if (!acct && (body.name || parsedUrl.searchParams.get('name'))) {
        const nameQuery = String(body.name || parsedUrl.searchParams.get('name')).toLowerCase();
        acct = accountsState.accounts.find(a => a.name.toLowerCase() === nameQuery);
      }

      if (!acct) {
        return send(404, { ok: false, error: 'Account not found' });
      }

      const bonusSec = Math.round(minutes * 60);
      acct.remainingSeconds = (acct.remainingSeconds || 0) + bonusSec;
      acct.lockedToday = acct.remainingSeconds <= 0;

      saveAccountsData(accountsState);
      broadcastSSE('playtime-granted', {
        accountId: acct.id,
        name: acct.name,
        minutes,
        remainingSeconds: acct.remainingSeconds,
        lockedToday: acct.lockedToday
      });

      return send(200, {
        ok: true,
        remainingSeconds: acct.remainingSeconds,
        account: acct
      });
    }

    // 4. Reset PIN
    if (pathname === '/api/accounts/reset-pin' && req.method === 'POST') {
      const body = await readBody(req);
      const accountId = Number(body.accountId || body.id || parsedUrl.searchParams.get('accountId') || parsedUrl.searchParams.get('id'));
      const newPin = String(body.newPin || parsedUrl.searchParams.get('newPin') || '');
      const acct = accountsState.accounts.find(a => a.id === accountId);

      if (!acct) return send(404, { ok: false, error: 'Account not found' });
      if (!/^\d{4}$/.test(newPin)) return send(400, { ok: false, error: 'PIN must be 4 digits' });

      acct.pin = newPin;
      saveAccountsData(accountsState);
      broadcastSSE('pin-reset', { accountId: acct.id });
      return send(200, { ok: true, account: acct });
    }

    // 5. Register Account
    if (pathname === '/api/accounts/register' && req.method === 'POST') {
      const body = await readBody(req);
      const name = String(body.name || '').trim();
      const pin = String(body.pin || '').trim();
      const age = parseInt(body.age, 10) || 10;
      const gridSlot = body.gridSlot != null ? Number(body.gridSlot) : null;

      if (!name || name.length < 2) return send(400, { ok: false, error: 'Name must be at least 2 characters' });
      if (!/^\d{4}$/.test(pin)) return send(400, { ok: false, error: 'PIN must be 4 digits' });

      const newAcct = {
        id: accountsState.nextId++,
        name,
        pin,
        gridSlot: gridSlot != null ? gridSlot : accountsState.accounts.length,
        age,
        ageGroup: age >= 13 ? 'teen' : 'child',
        avatar: null,
        remainingSeconds: 1800,
        dailyLimitSeconds: 1800,
        weeklySeconds: 0,
        lockedToday: false,
        lessonsCompleted: [],
        lastLogin: new Date().toISOString()
      };

      accountsState.accounts.push(newAcct);
      saveAccountsData(accountsState);
      broadcastSSE('account-registered', newAcct);
      return send(200, { ok: true, account: newAcct });
    }

    // 6. Update Avatar
    if (pathname === '/api/accounts/update-avatar' && req.method === 'POST') {
      const body = await readBody(req);
      const acct = accountsState.accounts.find(a => a.id === Number(body.accountId));
      if (!acct) return send(404, { ok: false, error: 'Account not found' });

      acct.avatar = body.avatar;
      if (body.age != null) {
        const a = parseInt(body.age, 10) || acct.age || 10;
        acct.age = a;
        acct.ageGroup = a >= 13 ? 'teen' : 'child';
      }

      saveAccountsData(accountsState);
      broadcastSSE('avatar-updated', acct);
      return send(200, { ok: true, account: acct });
    }

    // 7. Active Pilot Session Tick
    if (pathname === '/api/accounts/tick' && req.method === 'POST') {
      const body = await readBody(req);
      const acct = accountsState.accounts.find(a => a.id === Number(body.accountId));
      if (acct && acct.remainingSeconds > 0) {
        acct.remainingSeconds = Math.max(0, acct.remainingSeconds - 1);
        acct.weeklySeconds = (acct.weeklySeconds || 0) + 1;
        if (acct.remainingSeconds <= 0) {
          acct.lockedToday = true;
          broadcastSSE('playtime-expired', { accountId: acct.id, name: acct.name });
        }
        return send(200, { ok: true, remainingSeconds: acct.remainingSeconds });
      }
      return send(200, { ok: true });
    }

    // 8. Native Game Launchers (Bypasses all Chrome protocol popups)
    if (pathname === '/api/launch/roblox' && req.method === 'POST') {
      const { spawn } = require('child_process');
      try {
        const proc = spawn('cmd.exe', ['/c', 'start', 'roblox://'], { detached: true, stdio: 'ignore' });
        proc.unref();
        return send(200, { ok: true, message: 'Roblox launched directly on Windows' });
      } catch (e) {
        return send(500, { ok: false, error: e.message });
      }
    }

    if (pathname === '/api/launch/minecraft' && req.method === 'POST') {
      const { spawn } = require('child_process');
      try {
        const proc = spawn('cmd.exe', ['/c', 'start', 'minecraft://'], { detached: true, stdio: 'ignore' });
        proc.unref();
        return send(200, { ok: true, message: 'Minecraft launched directly on Windows' });
      } catch (e) {
        return send(500, { ok: false, error: e.message });
      }
    }
  }

  // --- Static File Serving ---
  let reqUrl = pathname;
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  }

  const filePath = path.join(__dirname, reqUrl);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Computer Shop OS 3D & Activity Dashboard API listening on port ${PORT}`);
});
