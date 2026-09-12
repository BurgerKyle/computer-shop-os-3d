const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const { resolveStaticPath, publicAccount, safeEqualString } = require('../server.js');

describe('resolveStaticPath', () => {
  it('resolves index under project root', () => {
    const p = resolveStaticPath('/index.html');
    assert.ok(p);
    assert.equal(path.basename(p), 'index.html');
    assert.ok(p.startsWith(path.resolve(__dirname, '..')));
  });

  it('blocks path traversal attempts', () => {
    const attempts = ['/../../etc/passwd', '/../server.js', '/foo/../../../etc/hosts', '/%2e%2e/%2e%2e/etc/passwd'];
    for (const a of attempts) {
      const resolved = resolveStaticPath(a);
      assert.equal(resolved, null, `expected null for ${a}, got ${resolved}`);
    }
  });
});

describe('publicAccount', () => {
  it('strips pin from account payloads', () => {
    const out = publicAccount({ id: 1, name: 'Zoe', pin: '9999', age: 15 });
    assert.equal(out.name, 'Zoe');
    assert.equal(out.pin, undefined);
  });

  it('returns null for missing account', () => {
    assert.equal(publicAccount(null), null);
  });
});

describe('safeEqualString', () => {
  it('compares equal strings', () => {
    assert.equal(safeEqualString('abc', 'abc'), true);
  });

  it('rejects unequal strings', () => {
    assert.equal(safeEqualString('abc', 'abd'), false);
    assert.equal(safeEqualString('abc', 'ab'), false);
  });
});
