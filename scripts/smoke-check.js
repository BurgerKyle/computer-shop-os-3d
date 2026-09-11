#!/usr/bin/env node
/**
 * Static smoke checks: syntax, required files, path-traversal helper, basic API boot.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const required = [
  'server.js',
  'index.html',
  'js/app.js',
  'js/store/accounts.js',
  'js/util/dom.js',
  'css/main.css',
  'package.json'
];

let failed = 0;
function fail(msg) {
  console.error('FAIL:', msg);
  failed += 1;
}
function ok(msg) {
  console.log('OK:', msg);
}

for (const rel of required) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) fail(`missing ${rel}`);
  else ok(`exists ${rel}`);
}

// Syntax-check key JS files
const { execFileSync } = require('child_process');
const jsFiles = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      walk(full);
    } else if (name.endsWith('.js')) {
      jsFiles.push(full);
    }
  }
}
walk(ROOT);

for (const file of jsFiles) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (e) {
    fail(`syntax ${path.relative(ROOT, file)}: ${e.message}`);
  }
}
ok(`syntax-checked ${jsFiles.length} JS files`);

const { resolveStaticPath, publicAccount, safeEqualString } = require(path.join(ROOT, 'server.js'));

if (resolveStaticPath('/../../etc/passwd') !== null && String(resolveStaticPath('/../../etc/passwd')).includes('etc')) {
  // resolveStaticPath should either null or stay inside root
  const resolved = resolveStaticPath('/../../etc/passwd');
  if (resolved && !resolved.startsWith(path.resolve(ROOT))) {
    fail('path traversal not blocked');
  } else {
    ok('path traversal blocked or confined');
  }
} else {
  ok('path traversal helper returned safe result');
}

const sample = publicAccount({ id: 1, name: 'A', pin: '1234', age: 10 });
if (sample.pin) fail('publicAccount leaked pin');
else ok('publicAccount strips pin');

if (!safeEqualString('admin1234', 'admin1234')) fail('safeEqualString true case');
if (safeEqualString('a', 'b')) fail('safeEqualString false case');
else ok('safeEqualString works');

// Boot server briefly and hit /api/health
const port = 5199;
const child = spawn(process.execPath, [path.join(ROOT, 'server.js')], {
  env: { ...process.env, PORT: String(port), ADMIN_PASSWORD: 'test-admin', MONITORING_TOKEN: 'test-token' },
  cwd: ROOT,
  stdio: ['ignore', 'pipe', 'pipe']
});

function request(method, urlPath, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: urlPath,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
          ...headers
        }
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(buf);
          } catch (_) {}
          resolve({ status: res.statusCode, json, raw: buf });
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

(async () => {
  try {
    await sleep(800);
    const health = await request('GET', '/api/health');
    if (health.status !== 200 || !health.json?.ok) fail(`health ${health.status}`);
    else ok('GET /api/health');

    const accounts = await request('GET', '/api/accounts');
    if (accounts.json?.accounts?.some((a) => a.pin)) fail('accounts list leaked pins');
    else ok('GET /api/accounts strips pins');

    const badGrant = await request('POST', '/api/accounts/grant-time', { accountId: 1, minutes: 5 });
    if (badGrant.status !== 401) fail(`grant without auth expected 401 got ${badGrant.status}`);
    else ok('grant-time requires auth');

    const goodGrant = await request(
      'POST',
      '/api/accounts/grant-time',
      { accountId: 1, minutes: 5 },
      { 'x-admin-password': 'test-admin' }
    );
    if (!goodGrant.json?.ok) fail(`authorized grant failed: ${goodGrant.raw}`);
    else ok('grant-time with admin password');

    const login = await request('POST', '/api/accounts/login', { name: 'Alex', pin: '1234' });
    if (!login.json?.ok) fail(`login failed: ${login.raw}`);
    else ok('POST /api/accounts/login');

    const trav = await request('GET', '/../../etc/passwd');
    if (trav.status === 200 && trav.raw.includes('root:')) fail('static path traversal open');
    else ok('static path traversal denied');

    const secret = await request('GET', '/data/accounts.json');
    if (secret.status === 200) fail('accounts.json exposed over HTTP');
    else ok('accounts.json not served');
  } catch (e) {
    fail(`API smoke: ${e.message}`);
  } finally {
    child.kill('SIGTERM');
    setTimeout(() => {
      try {
        child.kill('SIGKILL');
      } catch (_) {}
      if (failed) {
        console.error(`\nSmoke check failed with ${failed} error(s).`);
        process.exit(1);
      }
      console.log('\nSmoke check passed.');
      process.exit(0);
    }, 200);
  }
})();
