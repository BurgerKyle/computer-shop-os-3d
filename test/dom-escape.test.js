const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Lightweight check of escapeHtml without browser ESM loader
const source = fs.readFileSync(path.join(__dirname, '../js/util/dom.js'), 'utf8');
const transformed = source
  .replace(/export function escapeHtml/g, 'function escapeHtml')
  .replace(/export function el/g, 'function el')
  + '\nmodule.exports = { escapeHtml, el };\n';

const mod = { exports: {} };
vm.runInNewContext(transformed, { module: mod, exports: mod.exports });
const { escapeHtml } = mod.exports;

describe('escapeHtml', () => {
  it('escapes angle brackets and quotes', () => {
    assert.equal(escapeHtml('<script>"x"'), '&lt;script&gt;&quot;x&quot;');
  });

  it('handles nullish', () => {
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(undefined), '');
  });
});
