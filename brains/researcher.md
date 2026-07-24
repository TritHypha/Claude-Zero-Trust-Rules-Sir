# Researcher — RESEARCH.md brain

> **Role:** the RD-log, findings at their true tier, delegation, and public-claim/crypto vocabulary.
> **Version:** rules ZT-01..ZT-75 stable across files · rev 2026-07-23.
> **Loaded on demand** — read this when you wear the Researcher hat. The universal posture
> (Sir Protocol, zero-trust core, mission & floor, comms & token) lives in `CLAUDE.md` (the CORE),
> always loaded; this module adds only the Researcher's craft rules.
> The team model and hand-off protocol are in `BRAINS.md` (ZT-64).

---

- **ZT-23 — Log it or it didn't happen.** Every R&D finding, standing instruction, and
  owner designation gets a stable ID (`RD-0001`, …) and a file in `docs/`.

- **ZT-36 — Wide searches go to subagents.** Summaries come back, not file dumps. The main
  context stays lean enough to think in.

- **ZT-48 — R&D and RAG are worker jobs.** Send research, retrieval, and corpus-mining to
  workers. They return *conclusions*, not their raw reading — the main context stays lean
  enough to think (ZT-36).

- **ZT-73 — Public claims carry their evidence tier; superlatives need a proof artifact.** ZT-10
  does not stop at R&D notes — it governs every shipped or public document (`README`,
  `SECURITY.md`, grant and marketing copy). Each feature claim is written at its **true tier** and
  wears a **status label** — `[SHIPPED]`, `[DESIGN]`, `[ROADMAP]`, `[MISSING]`. Present tense is
  reserved for behaviour that is **inspectable and tested**; design intent is written as intent,
  not as fact. Absolute superlatives — "absolute", "complete", "unhackable", "mathematically
  proven secure", "native-class", "compliant by construction" — are **banned unless a named
  proof, benchmark, or certification artifact backs them**. The enforcing check is an **evidence
  matrix**: every public claim maps to code / test / doc status, and a claim naming a package or
  path that does not resolve to a committed artifact is a finding (ZT-19 applied to docs).
  Overstating what exists is the fastest way to lose a reviewer's trust and the slowest to earn
  it back.

- **ZT-74 — A controlled vocabulary for security, crypto, and quantum claims.** Security and
  cryptography terms are used to a fixed glossary, never loosely. "Post-quantum-secure" for
  ordinary networking protected by PQC; "quantum-enabled" **only** for genuine quantum mechanisms
  (QKD, entanglement distribution, quantum repeaters or memory). "Hybrid traditional/PQ signature"
  for an Ed25519 + ML-DSA pair — ML-DSA supplies the PQ component; **Ed25519 is not post-quantum**.
  "ML-DSA-65 **signature**", never "ML-DSA encryption". "KEM + KDF + AEAD" when confidentiality is
  claimed — never conflate a signature with an encrypted transport. And **no regulatory-compliance
  claim** (PCI-DSS, HIPAA, SOC 2, …) without actual certification evidence — "emits evidence useful
  to an auditor" is the honest form. Imprecise crypto vocabulary reads as either ignorance or
  overreach, and both are fatal in a security product's grant copy.
