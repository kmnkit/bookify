# PRD Template

This template provides the standard structure for Product Requirement Documents.

## Document Structure

```markdown
# [Product/Feature Name]

## Overview
Brief 2-3 sentence summary of what this is and why it matters.

## Background
- **Problem statement**: What problem are we solving?
- **Current situation**: What exists today and why is it insufficient?
- **Opportunity**: What value will this create?

## Goals and Success Metrics
- **Primary goal**: Main objective this feature aims to achieve
- **Success metrics**: 
  - Metric 1: [Specific, measurable target]
  - Metric 2: [Specific, measurable target]
- **Non-goals**: What this PRD explicitly does NOT cover

## Target Users
- **Primary users**: Who will use this most?
- **User needs**: What are their core needs and pain points?
- **User scenarios**: 2-3 concrete examples of how they'll use this

## Requirements

### Functional Requirements
**Must Have (P0):**
- Requirement 1: [Clear, testable requirement]
- Requirement 2: [Clear, testable requirement]

**Should Have (P1):**
- Requirement 3: [Nice-to-have feature]

**Could Have (P2):**
- Requirement 4: [Future enhancement]

### Non-Functional Requirements
- **Performance**: Response time, throughput, scalability expectations
- **Security**: Authentication, authorization, data protection needs
- **Compatibility**: Browser/OS/device support, integration requirements
- **Usability**: Accessibility, user experience standards

## Technical Constraints
- Constraint 1: [Technology, infrastructure, or architectural limitation]
- Constraint 2: [Budget, timeline, or resource constraint]

## User Experience
- **Key user flows**: Step-by-step description of primary workflows
- **UI/UX considerations**: Important design principles or patterns
- **Error handling**: How should errors and edge cases be handled?

## Dependencies
- **Internal dependencies**: Other teams/systems/features this depends on
- **External dependencies**: Third-party services or APIs required

## Implementation Phases
**Phase 1 (MVP):**
- Core functionality to validate the concept
- Timeline: [Estimate]

**Phase 2:**
- Enhanced features based on feedback
- Timeline: [Estimate]

## Open Questions
- Question 1: [Unresolved decision or unclear requirement]
- Question 2: [Item needing stakeholder input]

## Appendix
- Related documents
- Research findings
- Alternative approaches considered
```

## Section Guidelines

### Overview
Keep it concise. Someone reading only this section should understand the essence of the feature.

### Background
Focus on the "why" before the "what." Establish context and justify the need.

### Goals and Success Metrics
Be specific and measurable. "Improve user experience" is vague; "Reduce task completion time by 30%" is clear.

### Target Users
Use concrete personas or roles, not abstract categories. Include their motivations and pain points.

### Requirements
- Use clear, testable language
- Prioritize ruthlessly using P0/P1/P2
- Each requirement should be independently verifiable
- Avoid implementation details unless they're true constraints

### Technical Constraints
Only include genuine constraints, not preferences. These shape solution design.

### User Experience
Focus on the user's perspective, not UI implementation details. Describe workflows, not wireframes.

### Implementation Phases
Separate MVP from enhancements. MVP should be the minimum needed to validate core value.

### Open Questions
Explicitly call out what's undecided. This prevents assumptions and ensures discussions happen.