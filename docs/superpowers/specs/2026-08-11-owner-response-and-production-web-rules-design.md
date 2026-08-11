# Owner Response and Production Web Rules Design

## Objective

Add two always-loaded communication rules to the existing numbered Zero Trust,
Sir rulebook. One rule governs direct answers and action-status openings. The
other governs production-quality web work.

## Rule shape

- `ZT-88` belongs in `UI.md`. Questions begin with exactly one of `Yes.`,
  `No.`, or `I do not know.`, followed by one short sentence and useful bullets.
  Requests to act begin with `I have done this: "..."` when verified complete,
  or `Still in progress: "..."` while active. A materially unsafe request must
  be challenged directly and accompanied by at least three safer alternatives.
- `ZT-89` belongs in `UI.md`. HTML is production-facing unless the owner says
  otherwise: mobile-first responsive layout for mobile, tablet, and desktop;
  Roboto by default; clean corporate presentation; factual business English
  with appropriate marketing and sales clarity; contextual fact, spelling, and
  grammar verification; no unsolicited date stamps; and no external source or
  documentation references without explicit request or permission.

## Consistency and enforcement

The CORE index, every rule-file version line, README count, and the known-answer
test move from 87 to 89 together. The KAT must require both new rule identities
in `UI.md` and retain its continuity, placement, version, and path-leak checks.
The public README briefly names both new guarantees.

## Safety boundary

The direct-answer rule does not force a false binary answer: uncertainty is
reported as `I do not know.`. Completion wording is allowed only after fresh
verification. The web rule does not prohibit citations when the owner requests
or permits them, and it does not override a project-specific design system or
explicit font instruction.

## Acceptance evidence

- The existing KAT is red after its expected ceiling is raised but before the
  new definitions and version lines are added.
- The completed KAT reports 89 continuous, unique, correctly placed rules.
- A bounded text assertion verifies the required direct-answer, unsafe-request,
  action-status, responsive-web, Roboto, no-date-stamp, and source-permission
  clauses remain present.
- Repository status and diff contain only the intended rulebook, tests, public
  summary, and design/plan records.
