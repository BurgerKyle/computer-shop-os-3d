#!/usr/bin/env node
/**
 * Playwright E2E smoke: boot server, capture welcome UI screenshots, exercise login API + PIN form.
 * No Browser-use / cloud browser auth required.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const PORT = Number(process.env.E2E_PORT) || 5210;
const OUT_DIR =
  process.env.E2E_OUT_DIR ||
  '/cursor/stores/bc-16da47a7-ec47-4c2b-bb7f-cef9ae4b82a4/media/computer-shop-os-3d';
const ARTIFACTS = path.join(ROOT, 'artifacts', 'e2e');

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(ARTIFACTS, { recursive: true });

function waitForHealth(timeoutMs = 15000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get(`http://127.0.0.1:${PORT}/api/health`, (res) => {
        let buf = '';
        res.on('data', (c) => (buf += c));
        res.on('end', () => {
          if (res.statusCode === 200) return resolve(JSON.parse(buf));
          if (Date.now() - start > timeoutMs) return reject(new Error('health timeout'));
          setTimeout(tick, 250);
        });
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) return reject(new Error('health timeout'));
        setTimeout(tick, 250);
      });
    };
    tick();
  });
}

async function main() {
  let playwright;
  try {
    playwright = require('playwright');
  } catch {
    console.error('Playwright not installed. Run: npm i -D playwright && npx playwright install chromium');
    process.exit(1);
  }

  const child = spawn(process.execPath, [path.join(ROOT, 'server.js')], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(PORT),
      ADMIN_PASSWORD: 'e2e-admin',
      MONITORING_TOKEN: 'e2e-token'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let serverLog = '';
  child.stdout.on('data', (d) => (serverLog += d));
  child.stderr.on('data', (d) => (serverLog += d));

  const browser = await playwright.chromium.launch({ headless: true });
  try {
    await waitForHealth();
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

    page.on('pageerror', (err) => {
      console.warn('pageerror:', err.message);
    });

    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForSelector('#welcomeScreenOverlay', { timeout: 15000 });

    // Wait for account slots to populate from API
    await page.waitForFunction(() => {
      const grid = document.getElementById('slotsGrid');
      return grid && grid.children.length >= 4;
    }, { timeout: 15000 });

    const welcomeShot = path.join(OUT_DIR, '01-welcome-picker.png');
    await page.screenshot({ path: welcomeShot, fullPage: true });
    fs.copyFileSync(welcomeShot, path.join(ARTIFACTS, '01-welcome-picker.png'));
    console.log('Wrote', welcomeShot);

    // Click first filled slot (Alex/Ricky/etc.)
    await page.locator('.slot-card.filled').first().click();
    await page.waitForSelector('#accountPinAuthView:not([hidden])', { timeout: 5000 });

    const pinShot = path.join(OUT_DIR, '02-pin-login.png');
    await page.screenshot({ path: pinShot, fullPage: true });
    fs.copyFileSync(pinShot, path.join(ARTIFACTS, '02-pin-login.png'));
    console.log('Wrote', pinShot);

    await page.fill('#loginPinInput', '1234');
    await page.click('#submitPinLoginBtn');

    // Welcome should dismiss after successful login
    await page.waitForFunction(() => {
      const el = document.getElementById('welcomeScreenOverlay');
      return el && !el.classList.contains('active');
    }, { timeout: 10000 });

    // Give WebGL a moment to paint
    await page.waitForTimeout(1500);

    const hubShot = path.join(OUT_DIR, '03-sky-island-hud.png');
    await page.screenshot({ path: hubShot, fullPage: true });
    fs.copyFileSync(hubShot, path.join(ARTIFACTS, '03-sky-island-hud.png'));
    console.log('Wrote', hubShot);

    // Admin hub unlock UI (password not shown in copy anymore)
    await page.click('#hudAdminBtn');
    await page.waitForSelector('#adminUnlockPin', { timeout: 5000 });
    const adminShot = path.join(OUT_DIR, '04-admin-unlock.png');
    await page.screenshot({ path: adminShot, fullPage: true });
    fs.copyFileSync(adminShot, path.join(ARTIFACTS, '04-admin-unlock.png'));
    console.log('Wrote', adminShot);

    await page.fill('#adminUnlockPin', 'e2e-admin');
    await page.click('#submitAdminUnlockBtn');
    await page.waitForSelector('#adminTabContent', { timeout: 5000 });

    const adminOpen = path.join(OUT_DIR, '05-admin-console.png');
    await page.screenshot({ path: adminOpen, fullPage: true });
    fs.copyFileSync(adminOpen, path.join(ARTIFACTS, '05-admin-console.png'));
    console.log('Wrote', adminOpen);

    // Health + a11y-ish assertions
    const title = await page.title();
    if (!/Computer Shop OS/i.test(title)) throw new Error('unexpected title: ' + title);
    const skip = await page.locator('.skip-link').count();
    if (!skip) throw new Error('missing skip link');

    const summary = {
      ok: true,
      port: PORT,
      screenshots: [
        '01-welcome-picker.png',
        '02-pin-login.png',
        '03-sky-island-hud.png',
        '04-admin-unlock.png',
        '05-admin-console.png'
      ],
      outDir: OUT_DIR
    };
    fs.writeFileSync(path.join(OUT_DIR, 'e2e-summary.json'), JSON.stringify(summary, null, 2));
    console.log('E2E smoke passed.');
  } catch (err) {
    console.error('E2E failed:', err);
    console.error('Server log:\n', serverLog.slice(-4000));
    process.exitCode = 1;
  } finally {
    await browser.close().catch(() => {});
    child.kill('SIGTERM');
    setTimeout(() => {
      try {
        child.kill('SIGKILL');
      } catch (_) {}
      process.exit(process.exitCode || 0);
    }, 400);
  }
}

main();
