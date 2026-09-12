// Standalone HTTP & Monitoring API Server for Computer Shop OS 3D
// Fully compatible with Shop Admin Console and Activity Dashboard
const http = require('http');
const fs = require('fs');
const path = require('path');
const { timingSafeEqual } = require('crypto');

const PORT = Number(process.env.PORT) || 5173;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin1234';
const TOKEN = process.env.MONITORING_TOKEN || '60a67180b6a38a2b5002634319e5be9e';
const DATA_DIR = path.join(__dirname, 'data');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');
const ROOT_DIR = path.resolve(__dirname);
const MAX_BODY_BYTES = 64 * 1024;
const MAX_GRANT_MINUTES = 240;

if (!process.env.ADMIN_PASSWORD) {
  console.warn('[security] ADMIN_PASSWORD not set — using built-in kiosk default. Set ADMIN_PASSWORD in the environment for production.');
}
if (!process.env.MONITORING_TOKEN) {
  console.warn('[security] MONITORING_TOKEN not set — using built-in default. Set MONITORING_TOKEN for dashboard auth.');
}

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
    avatar: null,
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
    avatar: null,
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

function safeEqualString(a, b) {
  const left = Buffer.from(String(a || ''), 'utf8');
  const right = Buffer.from(String(b || ''), 'utf8');
  if (left.length !== right.length) return false;
  try {
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

function publicAccount(acct) {
  if (!acct) return null;
  const { pin, ...rest } = acct;
  return rest;
}

function publicAccountsState(state) {
  return {
    accounts: (state.accounts || []).map(publicAccount),
    nextId: state.nextId,
    activePilotId: state.activePilotId
  };
}

function authorizeAdmin(req) {
  const auth = req.headers.authorization || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  const adminPwd = String(req.headers['x-admin-password'] || '').trim();
  return safeEqualString(bearer, TOKEN) || safeEqualString(adminPwd, ADMIN_PASSWORD);
}

// In-memory Store
let accountsState = loadAccountsData();
let sseClients = [];
let tickDirty = false;

function broadcastSSE(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients = sseClients.filter((res) => {
    try {
      res.write(payload);
      return true;
    } catch (e) {
      return false;
    }
  });
}

// Persist playtime ticks in batches so disk I/O stays light
let tickPersistTimer = null;
function ensureTickPersistTimer() {
  if (tickPersistTimer) return;
  tickPersistTimer = setInterval(() => {
    if (tickDirty) {
      saveAccountsData(accountsState);
      tickDirty = false;
    }
  }, 5000);
  if (typeof tickPersistTimer.unref === 'function') tickPersistTimer.unref();
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.map': 'application/json'
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('Payload too large'), { statusCode: 413 }));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        try {
          const parsed = {};
          body.split('&').forEach((pair) => {
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

function resolveStaticPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(String(pathname || '/').split('?')[0] || '/');
  } catch {
    return null;
  }
  if (decoded.includes('\0')) return null;

  // Reject any .. segment before normalize can turn "/../../etc/passwd" into "/etc/passwd"
  const segments = decoded.split(/[/\\]/);
  if (segments.includes('..')) return null;

  const relative = path.normalize(decoded).replace(/^[/\\]+/, '');
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) return null;

  const filePath = path.resolve(ROOT_DIR, relative);
  if (filePath !== ROOT_DIR && !filePath.startsWith(ROOT_DIR + path.sep)) {
    return null;
  }
  return filePath;
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-account-session, x-admin-password');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  const send = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  };

  // --- Real-time Server-Sent Events Stream ---
  if (pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    sseClients.push(res);
    req.on('close', () => {
      sseClients = sseClients.filter((c) => c !== res);
    });
    res.write(`event: init\ndata: ${JSON.stringify(publicAccountsState(accountsState))}\n\n`);
    return;
  }

  // --- Activity Dashboard & Kiosk Monitoring API Endpoints ---
  if (pathname.startsWith('/api/')) {
    let body = {};
    if (req.method === 'POST') {
      try {
        body = await readBody(req);
      } catch (err) {
        return send(err.statusCode || 400, { ok: false, error: err.message || 'Bad request' });
      }
    }

    // 0. Lightweight public config (no secrets)
    if (pathname === '/api/config' && req.method === 'GET') {
      return send(200, {
        ok: true,
        version: '1.0.1-3d',
        terminalName: process.env.TERMINAL_NAME || 'KIOSK-01',
        adminPasswordConfigured: Boolean(process.env.ADMIN_PASSWORD)
      });
    }

    // 1. Health Heartbeat
    if (pathname === '/api/health') {
      const activePilot = accountsState.accounts.find((a) => a.id === accountsState.activePilotId);
      return send(200, {
        ok: true,
        terminalName: process.env.TERMINAL_NAME || 'KIOSK-01',
        pilotName: activePilot ? activePilot.name : null,
        playSessionActive: !!(activePilot && !activePilot.lockedToday && activePilot.remainingSeconds > 0),
        screenEnabled: true,
        controlEnabled: true,
        hostingEnabled: true,
        version: '1.0.1-3d'
      });
    }

    // Admin password verify (used by browser kiosk gate)
    if (pathname === '/api/admin/verify' && req.method === 'POST') {
      const password = String(body.password || '').trim();
      if (!safeEqualString(password, ADMIN_PASSWORD)) {
        return send(401, { ok: false, error: 'Incorrect Admin Password' });
      }
      return send(200, { ok: true });
    }

    // 2. Accounts List (PINs stripped)
    if (pathname === '/api/accounts' && req.method === 'GET') {
      return send(200, {
        ok: true,
        accounts: accountsState.accounts.map(publicAccount),
        dailyLimitSeconds: 1800
      });
    }

    // 2b. Login (server-side PIN check — pins are never sent to the client list)
    if (pathname === '/api/accounts/login' && req.method === 'POST') {
      const name = String(body.name || '').trim();
      const pin = String(body.pin || '').trim();
      const acct = accountsState.accounts.find((a) => a.name.toLowerCase() === name.toLowerCase());
      if (!acct) return send(404, { ok: false, error: 'Account not found.' });
      if (!safeEqualString(acct.pin, pin)) return send(401, { ok: false, error: 'Wrong 4-digit PIN.' });

      acct.lastLogin = new Date().toISOString();
      accountsState.activePilotId = acct.id;
      saveAccountsData(accountsState);
      broadcastSSE('pilot-login', { accountId: acct.id, name: acct.name });

      return send(200, {
        ok: true,
        account: publicAccount(acct),
        needsAvatar: !acct.avatar
      });
    }

    // Logout clears active pilot
    if (pathname === '/api/accounts/logout' && req.method === 'POST') {
      accountsState.activePilotId = null;
      saveAccountsData(accountsState);
      broadcastSSE('pilot-logout', {});
      return send(200, { ok: true });
    }

    // 3. Grant Playtime (Activity Dashboard + Admin Console)
    if (pathname === '/api/accounts/grant-time' && req.method === 'POST') {
      if (!authorizeAdmin(req)) {
        return send(401, { ok: false, error: 'Unauthorized' });
      }

      const accountId = Number(body.accountId || body.id || parsedUrl.searchParams.get('accountId') || parsedUrl.searchParams.get('id'));
      let minutes = Number(body.minutes || parsedUrl.searchParams.get('minutes')) || 15;
      if (!Number.isFinite(minutes) || minutes <= 0) minutes = 15;
      minutes = Math.min(MAX_GRANT_MINUTES, Math.round(minutes));

      let acct = accountsState.accounts.find((a) => a.id === accountId);
      if (!acct && (body.name || parsedUrl.searchParams.get('name'))) {
        const nameQuery = String(body.name || parsedUrl.searchParams.get('name')).toLowerCase();
        acct = accountsState.accounts.find((a) => a.name.toLowerCase() === nameQuery);
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
        account: publicAccount(acct)
      });
    }

    // 4. Reset PIN
    if (pathname === '/api/accounts/reset-pin' && req.method === 'POST') {
      if (!authorizeAdmin(req)) {
        return send(401, { ok: false, error: 'Unauthorized' });
      }

      const accountId = Number(body.accountId || body.id || parsedUrl.searchParams.get('accountId') || parsedUrl.searchParams.get('id'));
      const newPin = String(body.newPin || parsedUrl.searchParams.get('newPin') || '');
      const acct = accountsState.accounts.find((a) => a.id === accountId);

      if (!acct) return send(404, { ok: false, error: 'Account not found' });
      if (!/^\d{4}$/.test(newPin)) return send(400, { ok: false, error: 'PIN must be 4 digits' });

      acct.pin = newPin;
      saveAccountsData(accountsState);
      broadcastSSE('pin-reset', { accountId: acct.id });
      return send(200, { ok: true, account: publicAccount(acct) });
    }

    // 5. Register Account
    if (pathname === '/api/accounts/register' && req.method === 'POST') {
      const name = String(body.name || '').trim().slice(0, 20);
      const pin = String(body.pin || '').trim();
      const age = parseInt(body.age, 10) || 10;
      const gridSlot = body.gridSlot != null ? Number(body.gridSlot) : null;

      if (!name || name.length < 2) return send(400, { ok: false, error: 'Name must be at least 2 characters' });
      if (!/^\d{4}$/.test(pin)) return send(400, { ok: false, error: 'PIN must be 4 digits' });
      if (accountsState.accounts.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
        return send(409, { ok: false, error: 'That name is already taken!' });
      }

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
      accountsState.activePilotId = newAcct.id;
      saveAccountsData(accountsState);
      broadcastSSE('account-registered', publicAccount(newAcct));
      return send(200, { ok: true, account: publicAccount(newAcct) });
    }

    // 6. Update Avatar
    if (pathname === '/api/accounts/update-avatar' && req.method === 'POST') {
      const acct = accountsState.accounts.find((a) => a.id === Number(body.accountId));
      if (!acct) return send(404, { ok: false, error: 'Account not found' });

      acct.avatar = body.avatar;
      if (body.age != null) {
        const a = parseInt(body.age, 10) || acct.age || 10;
        acct.age = a;
        acct.ageGroup = a >= 13 ? 'teen' : 'child';
      }

      saveAccountsData(accountsState);
      broadcastSSE('avatar-updated', publicAccount(acct));
      return send(200, { ok: true, account: publicAccount(acct) });
    }

    // 7. Active Pilot Session Tick — accept absolute remainingSeconds to avoid drift
    if (pathname === '/api/accounts/tick' && req.method === 'POST') {
      const acct = accountsState.accounts.find((a) => a.id === Number(body.accountId));
      if (!acct) return send(200, { ok: true });

      if (body.remainingSeconds != null && Number.isFinite(Number(body.remainingSeconds))) {
        const next = Math.max(0, Math.floor(Number(body.remainingSeconds)));
        // Only allow decreasing (or small upward correction from grant races handled by SSE)
        if (next <= (acct.remainingSeconds || 0) + 1) {
          acct.remainingSeconds = next;
        }
      } else {
        const secs = Math.max(1, Math.min(60, Number(body.seconds) || 1));
        acct.remainingSeconds = Math.max(0, (acct.remainingSeconds || 0) - secs);
      }

      if (body.weeklySeconds != null && Number.isFinite(Number(body.weeklySeconds))) {
        acct.weeklySeconds = Math.max(acct.weeklySeconds || 0, Math.floor(Number(body.weeklySeconds)));
      }

      if (acct.remainingSeconds <= 0) {
        acct.lockedToday = true;
        broadcastSSE('playtime-expired', { accountId: acct.id, name: acct.name });
      }

      tickDirty = true;
      ensureTickPersistTimer();
      return send(200, { ok: true, remainingSeconds: acct.remainingSeconds });
    }

    // 8. Native Game Launchers (Instant 1-Click OS Execution)
    if (pathname === '/api/launch/roblox' && req.method === 'POST') {
      const { execFile } = require('child_process');
      try {
        if (process.platform === 'win32') {
          execFile('cmd.exe', ['/c', 'start', '', 'roblox://'], { windowsHide: true }, () => {});
        }
        return send(200, { ok: true, message: 'Roblox launch requested' });
      } catch (e) {
        return send(500, { ok: false, error: e.message });
      }
    }

    if (pathname === '/api/launch/minecraft' && req.method === 'POST') {
      const { execFile } = require('child_process');
      try {
        if (process.platform === 'win32') {
          execFile('cmd.exe', ['/c', 'start', '', 'minecraft://'], { windowsHide: true }, () => {});
        }
        return send(200, { ok: true, message: 'Minecraft launch requested' });
      } catch (e) {
        return send(500, { ok: false, error: e.message });
      }
    }

    return send(404, { ok: false, error: 'Not found' });
  }

  // --- Static File Serving (path-traversal safe) ---
  let reqUrl = pathname;
  if (reqUrl === '/' || reqUrl === '') {
    reqUrl = '/index.html';
  }

  const filePath = resolveStaticPath(reqUrl);
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    // Block serving runtime secrets / account store over HTTP
    const rel = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
    if (rel === 'data/accounts.json' || rel.endsWith('/.env') || rel === '.env') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

const { MinecraftBedrockBridge } = require('./src/minecraft-bridge/bedrock-bridge.js');

function startServer() {
  ensureTickPersistTimer();
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Computer Shop OS 3D & Activity Dashboard API listening on port ${PORT}`);

    try {
      const mcBridge = new MinecraftBedrockBridge(19134);
      mcBridge.start();
    } catch (e) {
      console.error('Could not initialize Minecraft Bedrock Bridge:', e.message);
    }
  });
  return server;
}

if (require.main === module) {
  startServer();
}

module.exports = { resolveStaticPath, publicAccount, safeEqualString, startServer, server };
