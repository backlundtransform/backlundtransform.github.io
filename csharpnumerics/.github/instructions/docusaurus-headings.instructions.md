---
description: "Use when writing or editing Docusaurus documentation (.md files under docs/). Covers heading structure for correct sidebar navigation."
applyTo: "docs/**/*.md"
---

# Docusaurus Heading Conventions

Headings control sidebar navigation in Docusaurus. Keep navigation flat by using only `##` for section headings.

## Rules

- **Section headings** use `## 🔥 Title` — these appear in the sidebar/TOC navigation.
- **Sub-headings** use `**🔧 Title**` (bold text) — these stay inline and do NOT create navigation entries.
- Never use `###` or deeper headings (`####`, `#####`) — they clutter the sidebar or create unwanted nesting.
- Every `##` heading should have an emoji icon before the title.

## Examples

```markdown
## 🌫️ Gaussian Plume

Intro text...

**📐 Manning's Equation — Open-Channel Velocity**

Sub-section text...

**🔄 Fischer Longitudinal Dispersion**

Another sub-section...
```

## Anti-patterns

```markdown
<!-- BAD: ### creates nested navigation -->
### Manning's Equation

<!-- BAD: missing icon -->
## Gaussian Plume

<!-- BAD: #### deeply nested -->
#### Some Detail
```
