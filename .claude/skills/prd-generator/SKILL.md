---
name: prd-generator
description: Generate comprehensive Product Requirement Documents (PRDs) from rough ideas, feature requests, or informal specifications. Use when the user provides a high-level concept, informal requirements, or asks to "create a PRD", "write a spec", "document requirements", or needs to structure informal ideas into a formal PRD. Converts unstructured input into well-structured PRDs with clear goals, requirements, success metrics, and implementation phases.
---

# PRD Generator

Generate professional Product Requirement Documents from informal specifications, rough ideas, or feature requests.

## Process Overview

1. **Gather input**: Understand the user's concept and any provided specifications
2. **Ask clarifying questions**: Confirm target users and technical constraints
3. **Generate PRD**: Create structured markdown document following industry standards
4. **Iterate if needed**: Refine based on feedback

## Workflow

### Step 1: Understand the Input

When the user provides a rough idea or informal specification:
- Read and analyze all provided information carefully
- Identify what's clear and what needs clarification
- Note any explicit scope, priorities, or constraints mentioned

### Step 2: Ask Critical Questions

ALWAYS ask these questions before generating the PRD (unless already clearly specified):

**Target Users:**
- "Who are the primary users of this feature/product?"
- "What are their main needs or pain points this addresses?"

**Technical Constraints:**
- "Are there any technical constraints I should know about?" (e.g., existing systems to integrate with, technology stack requirements, performance requirements, budget/timeline limitations)

Keep questions concise - maximum 3-4 questions in a single message to avoid overwhelming the user.

If the user says "you decide" or delegates decisions to Claude, use reasonable assumptions based on context and note them in the PRD's "Open Questions" section.

### Step 3: Generate the PRD

Create a comprehensive PRD following the template structure in `references/prd-template.md`.

**Key principles:**
- **Be specific**: Avoid vague language like "improve user experience" - use measurable targets
- **Prioritize ruthlessly**: Use P0/P1/P2 to distinguish must-haves from nice-to-haves
- **Stay user-focused**: Write from the user's perspective, not implementation details
- **Call out unknowns**: Use "Open Questions" section for anything uncertain
- **Keep it actionable**: Every requirement should be clear enough to implement and verify

**Adapting the template:**
- The template in `references/prd-template.md` is comprehensive but should be adapted based on project complexity
- Small features may not need all sections
- Large initiatives may need additional sections
- Use judgment to balance completeness with readability

**Implementation Phases:**
- When the user hasn't specified scope/priority, propose a sensible MVP (Phase 1) and enhancements (Phase 2+)
- MVP should include only the minimum needed to validate core value
- Base phase breakdown on what's most valuable to users first

### Step 4: Review Template Before Writing

ALWAYS view `references/prd-template.md` before generating the PRD to ensure consistency with the standard structure and guidelines.

### Step 5: Output Format

- Create a markdown file named `{feature-name}-prd.md`
- Use clear heading hierarchy (# for title, ## for main sections, ### for subsections)
- Write in present tense for requirements ("The system displays..." not "The system will display...")
- Be concise but complete - aim for clarity over brevity

## Examples

**Example Input:**
"We need an AI Agent to automate application approvals for our cloud services. Right now it's all manual and takes too long."

**Claude's Response:**
"I'll help you create a PRD for the cloud service approval automation AI Agent. First, let me clarify a few things:

1. Who are the primary users? (e.g., developers submitting requests, approval managers, IT admins)
2. Are there any technical constraints I should know about? (e.g., existing approval systems to integrate with, required approval workflows, security requirements)"

[After getting answers, Claude reads references/prd-template.md and generates a complete PRD]

---

**Example Input:**
"Create a PRD for adding dark mode to our Vietnamese language learning app"

**Claude's Response:**
"I'll create a PRD for dark mode functionality. Quick questions:

1. Who's the primary user base for your app? (helps me understand usage contexts)
2. Any technical constraints? (e.g., framework, existing theming system, supported platforms)"

[After getting answers, Claude generates a focused PRD appropriate for a feature addition]

## Best Practices

- **Don't over-engineer**: Match PRD complexity to project size
- **Ask questions efficiently**: Bundle related questions, maximum 3-4 per message
- **Be opinionated when delegated**: If user says "you decide," make reasonable assumptions and document them
- **Validate assumptions**: Include "Open Questions" section for uncertainties
- **Think user-first**: Requirements should be expressed from user perspective
- **Make it scannable**: Use clear structure so readers can quickly find relevant sections