#!/usr/bin/env node
// check-rules.mjs — the rulebook's known-answer test (ZT-80 applied to the rulebook itself).
// Version: rev 2026-08-06 · Pointers: CLAUDE.md (the rule→module index this test enforces),
// MOTIVATION.md ZT-80 (why KATs), brains/supervisor.md ZT-43 (every gate ships a self-test).
//
// The known answer: rules ZT-01..ZT-86 exist, each defined exactly once, in exactly the file
// the CORE's rule→module index says — and every rule file's version line carries the same
// ceiling. Any drift (a deleted rule, a duplicate number, a rule moved without the index,
// a stale version line) goes RED. A second gate scans every shipped document for
// machine-absolute paths (ZT-17) — the class of leak that arrived with an adopted document
// on 2026-08-06 and now has its detector (ZT-83: a fix and its detector are one unit).
//
// Run:  node check-rules.mjs      exit 0 = GREEN, exit 1 = RED (fail closed: an unreadable
// file is a failure, never a skip).
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url)); // repo root = this script's directory
const MAX = 86; // the rule ceiling — the single number the whole known answer hangs off

// The expected placement per file. This table IS the known answer, kept deliberately in
// sync with the CORE's rule→module index — if either drifts, the test goes red.
const EXPECTED = {
  'CLAUDE.md':            [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 33, 34, 35, 37, 50, 72],
  'UI.md':                [26, 27, 28, 29, 30, 32, 76, 77, 78],
  'MOTIVATION.md':        [79, 80, 81, 82, 83, 84, 85, 86],
  'brains/lead.md':       [22, 25, 31, 44, 45, 46, 47, 53, 54, 56, 57, 64, 65, 66],
  'brains/architect.md':  [7, 23, 24, 36, 48, 58, 59, 60, 73, 74],
  'brains/supervisor.md': [42, 43, 51, 52, 55],
  'brains/custodian.md':  [15, 16, 17, 18, 19, 20, 21, 38, 39, 40, 41, 49, 61, 62, 63, 67, 68, 69, 70, 71, 75],
};

// A rule DEFINITION is the bold headline form "**ZT-NN — ..."; bare mentions like (ZT-31)
// deliberately do not match, so cross-references never count as definitions.
const DEF = /\*\*ZT-(\d{2}) — /g; // — = the em-dash every headline uses

let red = false; // sticky failure flag — the run reports every finding, then fails once
const fail = (msg) => { red = true; console.error(`RED   ${msg}`); };

const seen = new Map(); // rule number -> [files it was defined in], for the duplicate check
for (const [file, expected] of Object.entries(EXPECTED)) {
  let text;
  try {
    text = readFileSync(join(ROOT, file), 'utf8');
  } catch {
    fail(`${file}: unreadable — a missing rule file is a red gate, not a skip`);
    continue;
  }

  // Compare the definitions actually present against the known answer for this file.
  const found = [...text.matchAll(DEF)].map((m) => Number(m[1]));
  for (const n of found) seen.set(n, [...(seen.get(n) ?? []), file]);
  const want = [...expected].sort((a, b) => a - b).join(',');
  const got = [...found].sort((a, b) => a - b).join(',');
  if (want !== got) fail(`${file}: expected ZT {${want}} but found {${got}}`);

  // Every rule file's version line must carry the current ceiling.
  const ver = text.match(/rules ZT-01\.\.ZT-(\d{2}) stable/);
  if (!ver) fail(`${file}: missing the "rules ZT-01..ZT-NN stable" version line`);
  else if (Number(ver[1]) !== MAX) fail(`${file}: version line says ZT-${ver[1]}; ceiling is ZT-${MAX}`);
}

// Continuity and uniqueness across the whole book: 01..MAX, no gaps, no duplicates.
for (let n = 1; n <= MAX; n++) {
  const where = seen.get(n) ?? [];
  const id = `ZT-${String(n).padStart(2, '0')}`;
  if (where.length === 0) fail(`${id}: defined nowhere`);
  if (where.length > 1) fail(`${id}: defined ${where.length} times (${where.join(', ')})`);
}

// Machine-absolute paths never ship (ZT-17). Each pattern requires a real segment after the
// prefix, so rule text that merely NAMES the ban (ZT-17's own "C:\Users\…" example, with its
// ellipsis) does not trip it. This scanner is excluded from its own scan — it carries the
// patterns as source.
const PATH_FILES = [
  ...Object.keys(EXPECTED),
  'README.md', 'BRAINS.md', 'explain.md', 'ENGINEERING-STANDARDS.md', 'showcase.html',
];
const LEAKS = [
  /\/home\/[A-Za-z0-9_-]+\//,      // POSIX home with a real username/segment
  /\/Users\/[A-Za-z0-9_-]+\//,     // macOS home
  /C:\\+Users\\+[A-Za-z0-9_-]+/i,  // Windows home
  /C--Users-[A-Za-z0-9_-]+/i,      // the dash-encoded slug of the same (same leak, new coat)
];
for (const file of PATH_FILES) {
  let text;
  try {
    text = readFileSync(join(ROOT, file), 'utf8');
  } catch {
    fail(`${file}: unreadable in the path-leak scan — missing shipped doc is a red gate`);
    continue;
  }
  for (const rx of LEAKS) {
    const m = text.match(rx);
    if (m) fail(`${file}: machine-absolute path leaked: "${m[0]}"`);
  }
}

if (red) process.exit(1); // fail closed
console.log(`GREEN ${MAX} rules — continuous, unique, placed per the index, version lines agree, no machine paths.`);
