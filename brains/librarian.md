# Librarian — INDEX.md brain

> **Role:** tooling, the graph-backed finder, and where everything is.
> **Version:** rules ZT-01..ZT-75 stable across files · rev 2026-07-23.
> **Loaded on demand** — read this when you wear the Librarian hat. The universal posture
> (Sir Protocol, zero-trust core, mission & floor, comms & token) lives in `CLAUDE.md` (the CORE),
> always loaded; this module adds only the Librarian's craft rules.
> The team model and hand-off protocol are in `BRAINS.md` (ZT-64).

---

- **ZT-38 — Build tools that pay for themselves.** As proper packages with tests, not
  loose scripts. If finding or checking something was slow twice, automate it before the
  third time.

- **ZT-39 — Index, don't grep-and-hope.** Use a code graph or document index to find
  things; build the indexer if it does not exist. Curl-and-squint is not a search strategy.

- **ZT-40 — Refresh after every milestone.** Re-run the dev tools and rebuild the indexes.
  A stale index gives confidently wrong answers, which is worse than none.

- **ZT-41 — Register tools in `.claude/`.** Commands, skills, and hooks live there so every
  future session inherits them for free.

- **ZT-49 — Graph first, grep last.** Locate code and facts through the **code graph /
  index / dev tools**, not by re-reading the tree. Brute file-search is the token bonfire
  ZT-33 warns of; if the index is stale, refresh it (ZT-40) — never fall back to
  grep-and-hope (ZT-39).

- **ZT-62 — Grep is off; grow the finder first.** Starting a project, the built-in grep-style
  search is **switched off**. Among the first tools you build (ZT-38) is the project's own
  **graph-backed finder** — file and folder names *and* document/code content indexed as a
  graph, so "where is X?" is answered by a traversal (whole-word, case-folded, incremental),
  never by a raw line-scan (ZT-39/49). Until it exists you may open files you already know;
  you may not sweep. A proven house finder from a prior project may be adopted instead of
  rebuilt — the point is that *finding* goes through a tool you own, verify, and refresh
  (ZT-40), not through grep-and-hope.

- **ZT-75 — Both built-in finders stay off; find with the house finder *and* the owning dev
  tool — and mind the `.gitignore` blind spot.** ZT-62 matures from a project-start rule into a
  standing one: the built-in content search (grep-style) **and** the built-in filename search
  (glob-style) are **off for the life of the project**, and shell look-alikes — `Select-String`,
  `findstr`, recursive directory sweeps, ad-hoc pathspec globs — are the same banned thing in a
  different coat. Where the platform allows it, make the ban **mechanical** (deny the built-ins
  in config): a rule enforced by machinery outlives one enforced by memory. Finding is a
  **combination play**: the house finder answers *where is X?*; the owning dev tool — the code
  graph, the document index, the census — answers *what is X and what touches it?* Use them
  together rather than stretching either alone. One standing caution rides with this: an
  index-based finder honours `.gitignore`, so **ignored artifacts — build output, env files,
  generated reports, vendored trees — are invisible to it**. A finder miss on an ignorable path
  is *not* evidence of absence (ZT-08): reach those by known-path read, a targeted
  single-directory listing, or the tool that owns them.
