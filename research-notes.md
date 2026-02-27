# Research Notes — AdmitGuard
**Author:** Avishka Jindal
**Sprint:** 0 — Discovery & Planning Phase
**Project:** AdmitGuard — Admission Data Validation & Compliance System

---

## Overview

This document captures all independent research conducted during Sprint 0 (Wednesday evening, before the Thursday demo). It covers: Vibe Coding methodology, Google AI Studio Build Mode, prompt engineering techniques, UX best practices for form validation, existing solutions landscape, and key architectural decisions derived from research.

---

# 1️⃣ Vibe Coding & Google AI Studio Research

---

## 📘 Source: Google AI Studio Build Mode Documentation
https://ai.google.dev/gemini-api/docs/aistudio-build-mode

### What I Studied
- Build Mode architecture and Antigravity Agent multi-file generation
- Annotation mode workflow for UI-specific changes
- Deployment options: Cloud Run vs. external hosting
- API key handling and security implications
- Sharing and 403 error troubleshooting

### Key Learnings

**Antigravity Agent Architecture**
AI Studio manages multi-file changes intelligently and propagates updates across the stack. Critical for AdmitGuard because:
- Refactoring validation logic touches multiple files simultaneously
- Separating config from UI components requires coordinated changes
- Managing modular structure (views, components, utils) needs cross-file awareness

**Deployment Security**
- JavaScript apps run client-side → API keys embedded in frontend are exposed
- Secure deployment requires server-side key usage
- Cloud Run avoids exposing keys in shared apps

Impact on AdmitGuard:
- For prototype → client-side is acceptable (no sensitive keys used)
- For production → validation + key logic must move server-side

**Build Failure Debugging**
If a shared app throws a 403: check browser extensions, fix build issues via prompt, re-share clean build.
Takeaway: AI output must be validated before sharing. Never assume the first output is production-ready.

---

## 📘 Source: Google Codelab — Vibe Code with Gemini
https://codelabs.developers.google.com/vibe-code-with-gemini-in-aistudio#0

### What I Learned
- Iterative prompting is the core workflow — not one-shot generation
- Don't overload the first prompt
- Use annotation mode for precise UI refinement rather than describing changes in text
- Separate structure → logic → polish across prompts — never mix concerns

Important insight: LLMs perform best when given context + acceptance criteria, not vague intent.

---

## 📘 Source: Guide to Vibe Coding with Google AI Studio
https://medium.com/@davidlfliang/guide-vibe-coding-with-google-ai-studio-literally-4a3f6fb3400f

### Key Insight
API key is only needed when deploying outside AI Studio. For in-platform prototype, no server infrastructure is required.

Confirms: AdmitGuard Phase 1 can remain fully client-side without any infrastructure cost or complexity.

---

## 📘 Source: Various AI Coding Tool Articles

**Core insight:** The model doesn't know what you want — it knows what you *said*. These are different things.

- Vague prompts produce vague code. "Build a form" → generic demo. "Build a form that validates phone numbers starting with 6–9, exactly 10 digits, and shows inline red error text on keystroke" → something usable.
- The most powerful pattern: **role + task + constraints + what NOT to do**. The "do NOT" part is underrated — it prevents the AI from padding output with unwanted patterns (like Bootstrap defaults or placeholder validation logic).
- **Key discovery:** You can ask AI Studio to fix specific bugs by describing the broken behavior — it reads the existing generated code and patches it. Better than re-prompting from scratch.
- Gemini 2.0 Flash is faster for iteration; Gemini 1.5 Pro better for complex logic.

---

# 2️⃣ Prompt Engineering Research

---

## 📘 Source: Taming Vibe Coding — Engineer's Guide
https://medium.com/google-cloud/taming-vibe-coding-the-engineers-guide-fff70b6d807a

### Core Framework Learned

The four-part structure that maximizes output quality:
1. **Context** — What the app is and what already exists
2. **To Dos** — Precise, single-concern task definition
3. **Not To Dos** — Explicit anti-patterns to avoid
4. **Acceptance Criteria** — Testable conditions for "done"

Most important insight:
> Context engineering is the real engineering. The code is the output, not the work.

Providing documentation and examples before task assignment drastically improves output quality. This is why Prompt 1 was sent with the design doc, PDR, and napkin wireframe attached — not just the text description.

---

## 📘 Source: Dev.to — Ultimate Prompt Strategy
https://dev.to/dumebii/the-ultimate-prompt-strategy-how-to-vibe-code-production-ready-websites-4e9

### Key Concepts
- Adopt "Senior Architect" mindset — you are directing, not asking
- Treat AI as a capable junior developer who needs precise instructions
- Set standards before coding begins — the system prompt is your coding standards doc
- Use constraints as guardrails, not as optional suggestions

Takeaway: Output quality = clarity of constraints. Every ambiguity in the prompt becomes a guess in the code.

---

## 📘 Source: Prompt-Driven Development (Capgemini)
https://capgemini.github.io/ai/prompt-driven-development/

### Engineering Principles Applied to AdmitGuard
- Clean Architecture → UI separated from business logic (validation engine)
- Separation of concerns → config in `/config/rules.ts`, not in form components
- Client-side validation best practices → inline, real-time, not submit-time
- Structured error handling → strict vs. soft error states clearly differentiated

---

## 📘 Source: Andrej Karpathy on AI Code Review
https://x.com/karpathy/status/1886192184808149383

Insight: Use a strong model to critique your own code. Self-review via model = structured improvement loop.
Applied: Used Claude to audit the AdmitGuard codebase against the brief requirements — found CGPA threshold bug (5.0 vs 6.0), graduation year bug (2026 vs 2025), and exception auto-enable logic issue.

---

## Prompting Risks Identified

### Vibe Collapse (Context Rot)
Long AI Studio sessions degrade output quality as context window fills.
Solution:
- Restart session if looping on the same bug
- Reset context when stuck after 2+ failed attempts
- Avoid infinite refinement cycles — move to a new prompt with fresh framing

### The Kitchen Sink Anti-Pattern
Dumping every requirement into one prompt = the AI loses focus, picks the easiest interpretation of each constraint, and produces superficially correct but logically weak code.
Solution: One concern per prompt. The 8-prompt sequence was designed around this.

---

# 3️⃣ Prompt Structure Used in This Project

Derived from research and applied to all 8 AdmitGuard prompts:

```
Role: [who the AI is — "senior frontend developer building an internal business tool"]
Task: [clear, specific, single-concern task]
Context: [what already exists, what not to break]
Constraints: [hard rules the output must follow]
Do NOT: [anti-patterns to actively avoid]
Output format: [what deliverable is expected]
Acceptance criteria: [testable conditions for "done"]
```

### The Layered Prompting Strategy Applied
- **Prompt 1** → Structure only (no logic — reserve hooks for later wiring)
- **Prompt 2** → Strict validation only (no soft rules yet)
- **Prompt 3** → Edge case verification and bug fixing
- **Prompt 4** → Soft rules + exception override flow
- **Prompt 5** → Exception counter + flagging system
- **Prompt 6** → Config refactor — move rules out of components
- **Prompt 7** → Audit log + localStorage persistence
- **Prompt 8** → UI polish (annotation mode)

---

# 4️⃣ UX Research — Form Validation

---

## 📘 Source: LogRocket — Inline vs After-Submission Validation
https://blog.logrocket.com/ux-design/ux-form-validation-inline-after-submission/

### Key Learnings
- Inline validation (errors as you type) reduces cognitive load vs. submit-time error dumps
- Immediate feedback prevents form frustration and abandonment
- Clear, human-readable error messages improve completion rate
- Reserve space for error messages — avoid layout shift when they appear

Decision: AdmitGuard uses real-time inline validation (onChange + onBlur), with reserved error space below every field to prevent layout shift.

---

# 5️⃣ Existing Solutions Landscape

Understanding what already exists and where AdmitGuard fits:

---

## Enterprise Admission Systems

**Slate** (US higher-ed)
- Strengths: Rule workflows, decision logs, audit tracking
- Weakness: Enterprise-heavy, expensive, admin-dependent rule editing

**LeadSquared** (Indian EdTech)
- Strengths: Workflow stages, conditional routing
- Weakness: Exception governance is weak, config flexibility limited

**Ellucian Banner**
- Full ERP-grade admissions. Complete overkill for a lightweight compliance layer.

---

## Internal Tool Builders

Retool / AppSheet / Jotform Enterprise
- Strengths: Conditional logic, basic validation
- Weakness: Manual rule engineering, no structured exception tracking

---

## Business Rule Engines (BRMS)

IBM ODM / Red Hat Drools / FICO Decision Management
- Strengths: Rule versioning, traceability, governance
- Weakness: Infrastructure-heavy, not UI-first, built for banking not EdTech

---

## Current Reality: Google Forms + Sheets + Apps Script

The actual operational stack at most Indian EdTech companies.
- Weak validation (if any)
- Manual override culture
- No structured exception governance
- No immutable audit trail

**This is exactly what AdmitGuard replaces.**

---

## Strategic Position

AdmitGuard fits the gap between:

```
[Google Sheets — too weak] ←— AdmitGuard —→ [Enterprise BRMS — too heavy]
```

It is: lightweight, config-driven, exception-governed, audit-enabled, and deployable in hours — not months.

---

# 6️⃣ Git & Development Environment

---

## 📘 Source: GitHub Git Init Guide
https://github.com/git-guides/git-init

Decision: Micro-commit per feature — one commit per validation sprint checkpoint. Each commit maps to a prompt result so the build history tells the story of the development process.

---

# 7️⃣ Architectural Decisions Derived from Research

| Decision | What | Why |
|----------|------|-----|
| 1 | Separate UI from validation engine | Maintainability — changing a rule shouldn't touch a component |
| 2 | Rules in `/config/rules.ts`, not hardcoded | Operations team can update without code changes |
| 3 | Inline validation (strict vs. soft) | UX best practice — error at entry, not at submit |
| 4 | Structured rationale enforcement | Prevents exception abuse — accountability, not just bypass |
| 5 | Exception count tracking (system rule) | Surfaces high-risk entries for manager review |
| 6 | Audit log via `localStorage` | Zero infrastructure, survives page refresh, exportable |
| 7 | Micro-commit per sprint checkpoint | GitHub shows build progression, maps to prompt log |

---

# 8️⃣ Open Questions (Documented for Honesty)

1. Should Phase 2 move validation server-side to prevent client-side bypass?
2. How to prevent rationale keyword gaming ("special case" entered with no real justification)?
3. Should exception density feed into a risk score, not just a binary flag?
4. Can rules be versioned per cohort (e.g., different age range for different programs)?
5. How would multi-user access work — who can approve exceptions at manager level?

---

# 9️⃣ Summary of Learning

Vibe Coding is not about writing prompts randomly. It is a **structured prompting discipline**:

1. Know exactly what you want before you type anything
2. Break the problem into sequenced, layered prompts — one concern per prompt
3. Treat each prompt as a surgical instruction, not a wish
4. Review output critically against acceptance criteria before moving on
5. Document what the AI got wrong — that's where the real learning lives

The real engineering happens in: planning, rule modeling, architecture separation, and risk awareness.
The AI is the implementation layer. The engineer is the decision layer.

> The students who research on Wednesday will be 2 hours ahead on Thursday. That was the point.

---

*End of Research Notes — Sprint 0*
