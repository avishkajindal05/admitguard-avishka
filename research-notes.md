# Research Notes — Sprint 0
**AdmitGuard | Avishka**  
Date: Sprint 0,

---

## What I Read / Watched

### Articles on Vibe Coding & Prompt Engineering

**1. "How to Actually Get Good Output from AI Coding Tools" — various sources**
- Key insight: The model doesn't know what you want — it knows what you *said*. These are different things.
- Vague prompts produce vague code. "Build a form" gives you a generic demo. "Build a form that validates phone numbers starting with 6–9, exactly 10 digits, and shows inline red error text on keystroke" gives you something usable.
- The most powerful pattern: **role + task + constraints + what NOT to do**. The "do NOT" part is underrated — it prevents the AI from padding your output with things you don't want (like Bootstrap defaults or placeholder logic).
- Start with structure, layer in logic. Never ask for everything at once.

**2. Google AI Studio Build Mode Documentation (aistudio.google.com)**
- Build mode generates a React app from prompts in the interface.
- You can iterate by adding follow-up prompts — the model has memory of the full generated file.
- Key tip: treat each prompt like a precise git commit — one concern per prompt. Don't mix "add a new field" with "fix the validation logic."
- The interface lets you preview live and copy the generated code.
- Gemini 2.0 Flash and Gemini 1.5 Pro are the recommended models for Build Mode. Flash is faster for iteration; Pro for complex logic.

**3. "Prompt Engineering for Developers" (general resource)**
- The chain-of-thought technique works well for rule engines: ask the AI to "think through the validation logic step by step before writing code."
- Giving the model **examples of edge cases** in the prompt prevents it from writing happy-path-only code.
- Framing: "You are a senior frontend developer" is more effective than "write me code" because it sets an expectation of quality, not just output.
- **Negative constraints matter**: "Do NOT use any external validation libraries. Write the logic from scratch." Otherwise the model defaults to whatever is most common in training data.

---

## What I Learned About Vibe Coding

### The Core Mental Model
Vibe coding is not "AI writes code, I paste it." It's a **structured prompting discipline** where you:
1. Know *exactly* what you want before you type anything
2. Break the problem into sequenced, layered prompts
3. Treat each prompt as a surgical instruction, not a wish
4. Review output critically and refine with precision follow-ups

### The Planning-First Advantage
The students who skip wireframing and jump to prompting hit a wall fast:
- The AI produces something, but not *their* something
- They spend 30 minutes trying to describe what they wanted differently
- They end up in a correction spiral

If you've sketched the form, listed the fields, mapped the validation rules, and drafted 3 prompts in advance — you walk into AI Studio with **a plan**, not a prayer.

### Prompt Structure That Works (What I'll Use)

```
Role: [who the AI is]
Task: [clear, specific task]
Context: [relevant background]
Constraints: [hard rules]
Do NOT: [anti-patterns to avoid]
Output format: [what you expect to receive]
```

### The Layered Prompting Strategy
- **Prompt 1** → Structure only (no logic)
- **Prompt 2** → Add strict rules (no soft rules yet)
- **Prompt 3** → Edge cases and fixes
- **Prompt 4+** → Soft fields, exceptions engine, audit log

Never mix structure with logic. Never ask for everything at once.

---

## What I Explored in Google AI Studio

- Opened aistudio.google.com → clicked "Build" tab
- The interface has a prompt panel on the left and a live preview on the right
- You can switch between Gemini models mid-session
- The generated code is a single React file — can be expanded into components after
- File attachments are supported — I could potentially paste my `rules.json` and ask it to wire validation from that config
- **Key discovery:** You can ask AI Studio to fix specific bugs by describing the broken behavior — it reads the existing generated code and patches it. This is better than re-prompting from scratch.

---

## Questions I Still Have

1. How do I structure the `rules.json` schema so the validation engine can read it cleanly? Should rules be per-field objects, or a flat array?
2. When soft field exceptions are approved, how do I persist the "approved" state alongside the audit log entry — same `localStorage` key or separate?
3. Can AI Studio handle a multi-view SPA (Form / Audit Log / Dashboard) in a single prompt, or do I need to build each view separately?
4. How do I prevent the AI from adding animations and hover effects I didn't ask for — should I explicitly list what NOT to include in every prompt?
5. What's the best way to handle the Percentage/CGPA toggle — two separate inputs that swap, or one input that changes validation range based on mode?

---

## Prioritized Must-Haves for Sprint 1

Based on the PRD and my research:

| Priority | Requirement | Why First |
|---|---|---|
| P0 | Form structure (all 11 fields) | Everything else depends on this |
| P0 | Strict validation (7 rules) | Core value proposition |
| P0 | Rejected status = hard block | Highest compliance risk |
| P0 | Submit button gate | UX correctness |
| P1 | Soft field exceptions UI | Core differentiator |
| P1 | Audit log (localStorage) | Traceability requirement |
| P2 | Dashboard metrics | Nice to have, review after P1 |
| P3 | CSV/JSON export | Last, least risky to skip |
