# The UI rules — how every reply is shaped

> **What this is:** the communication rules of the house — §6 of the rulebook, in their own
> file. **Version:** rules ZT-01..ZT-78 stable across files · rev 2026-08-05.
> **Always loaded:** the CORE (`CLAUDE.md`) imports this file into every session. It is not a
> hat module — no session, no hat, and no shortage of context excuses skipping it.
> Related: the flares live at ZT-01/02 (CORE §1); token economy at ZT-33–35, 37 (CORE §7).

Sir does not watch the work; Sir reads the replies. **The reply is the UI of the whole
engagement**, so it is built like any shipped surface: to a spec, and gated before it leaves
(ZT-78). The law in one line: *structure carries the meaning* — signal at full weight, chatter
shrunk where the surface can render weight and cut where it cannot. And where an assistant's
own style habits disagree with this file, **this file wins** — that is what makes it a
rulebook rather than a mood.

## 6 · Communication — the UI rules

- **ZT-26 — Status lines, not paragraphs.** Work is reported in the house shape:

  `ID · Name — one-line description — Status: done / 80% / blocked on X.`

  A paragraph that says what a status line could say is theatre (ZT-32) wearing prose.

- **ZT-27 — Anything deep goes in a table.** Results, options, comparisons, a question with
  moving parts, an explanation with more than two axes — a table breaks it apart so each cell
  can be checked on its own. Split long tables into ~10-row chunks — kinder to the UI, and to
  Sir. Prose may introduce a table; it never substitutes for one.

- **ZT-28 — One subject per section; a `---` between every two.** Every boundary gets a
  horizontal rule: between one section and the next, between one task's report and the next
  task's, and between the work product and a closing flare block. The `---` sits on its own
  line with a blank line above and below — pressed directly under a line of text, markdown
  turns that text into a heading instead of a rule. A reply with two headers and no `---`
  has skipped a boundary. Within a section: short paragraphs, bullets wherever the content
  is really a list, and never three topics braided into one paragraph. A wall of prose is
  where instructions go to be ignored.

- **ZT-29 — Real paths, boxed.** Name the actual artifact — `docs/rules/identity.md`, written
  out, never "click here"; paths survive copy-paste. And every path, command, URL, identifier,
  or fragment of code rides in a code box — inline backticks for a mention, a fenced block for
  anything Sir might copy or run whole. A technical token in prose clothing is how typos and
  half-quotes breed.

- **ZT-30 — Announce start and end of every task.** One line each: what + why on entry; what
  changed + what's next on exit. A well-mannered professional announces themselves — and takes
  their leave.

- **ZT-32 — No theatre.** No restating the plan, no summarising what was just said, no
  describing options you will not take, no apologising in triplicate. Say it once, correctly.

- **ZT-76 — Headers name the intent, not the topic.** Sir triages a reply by its headers
  before reading a word beneath them, so a header says what the section is *for*:
  `Done` · `Working On This` · `Question For Owner` · `Owner Decision` · `Planning` ·
  `Need More Information` · `Checking Documents` · `Doing External R&D` — coin others in the
  same shape when the work needs one. "Update", "Thoughts", or a bare topic noun defeats the
  triage.

- **ZT-77 — Focus symbols carry state — and never cry wolf.** State reads faster than words,
  so it goes **first** on the bullet or row it governs:

  | Symbol | Means |
  |---|---|
  | 🔴 | broken / wrong / failing |
  | ✅ | finished / verified / correct |
  | ⚠️ | needs attention — a warning, not yet broken |

  Most lines carry **no symbol**: routine progress is not decorated. Over-flagging is crying
  wolf — the day something is genuinely on fire, the flag must still mean fire.

- **ZT-78 — Every reply passes the gate before it ships.** These rules are a gate like any
  other, and gates fail closed (ZT-11). Before sending anything longer than a single status
  line or flare, check the draft:

  | # | Check | Rule |
  |---|---|---|
  | 1 | Headers name intent; one subject per section; a `---` between every two sections or tasks | ZT-76 · ZT-28 |
  | 2 | Status lines for work; tables for anything deep; bullets over walls | ZT-26 · ZT-27 |
  | 3 | Paths, commands, code — boxed | ZT-29 |
  | 4 | Symbols only where state earns them | ZT-77 |
  | 5 | Every human decision flagged with a canonical flare | ZT-01 · ZT-02 |
  | 6 | Conclusions first, evidence on request; no theatre | ZT-34 · ZT-32 |

  A draft that fails any row is **redrafted, not sent** — an unformatted reply is a red gate
  shipped green, and we do not do that here.

## The shape, in one specimen

```text
Working On This
T-042 · Payment webhook — signature verification — Status: done
T-043 · Refund path — idempotency key — Status: 80%

---

Done
✅ `check payment.fungi` — 0 errors, exit 0
⚠️ retry queue unbounded — capped next, in T-044

---

Question For Owner
Sir, a question: webhook-log retention —
1. 30 days (recommended) · 2. 90 days · 3. indefinite
```

*Illustrative — the shapes, not a record of real work.*
