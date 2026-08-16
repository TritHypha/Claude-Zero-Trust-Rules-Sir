import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import {
  appendFileSync,
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test, { afterEach } from 'node:test';
import { fileURLToPath } from 'node:url';

const REPO = dirname(fileURLToPath(import.meta.url));
const SHIPPED = [
  'check-rules.mjs',
  'CLAUDE.md',
  'UI.md',
  'MOTIVATION.md',
  'brains/lead.md',
  'brains/architect.md',
  'brains/supervisor.md',
  'brains/custodian.md',
  'README.md',
  'BRAINS.md',
  'explain.md',
  'ENGINEERING-STANDARDS.md',
  'showcase.html',
  'LICENSE',
];
const temporaryRoots = [];

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'zt-rulebook-'));
  temporaryRoots.push(root);
  for (const relativePath of SHIPPED) {
    const destination = join(root, relativePath);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(join(REPO, relativePath), destination);
  }
  return root;
}

function runChecker(root) {
  return spawnSync(process.execPath, ['check-rules.mjs'], {
    cwd: root,
    encoding: 'utf8',
    windowsHide: true,
  });
}

function replace(root, relativePath, before, after) {
  const path = join(root, relativePath);
  const current = readFileSync(path, 'utf8');
  assert.ok(current.includes(before), `fixture is missing ${JSON.stringify(before)}`);
  writeFileSync(path, current.replace(before, after));
}

function append(root, relativePath, text) {
  appendFileSync(join(root, relativePath), text);
}

test('the live rulebook passes the 91-rule known answer', () => {
  const result = runChecker(REPO);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /GREEN 91 rules/);
});

test('a missing definition is rejected', () => {
  const root = fixture();
  replace(root, 'CLAUDE.md', '**ZT-91 —', '**REMOVED-91 —');
  const result = runChecker(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ZT-91: defined nowhere|expected ZT/);
});

test('a duplicate definition is rejected', () => {
  const root = fixture();
  append(root, 'UI.md', '\n**ZT-91 — duplicate control**\n');
  const result = runChecker(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ZT-91|expected ZT/);
});

test('an out-of-range definition is rejected', () => {
  const root = fixture();
  append(root, 'CLAUDE.md', '\n**ZT-92 — out-of-range control**\n');
  const result = runChecker(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ZT-92|expected ZT/);
});

test('a stale version ceiling is rejected', () => {
  const root = fixture();
  replace(root, 'UI.md', 'rules ZT-01..ZT-91 stable', 'rules ZT-01..ZT-89 stable');
  const result = runChecker(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /version line says ZT-89/);
});
