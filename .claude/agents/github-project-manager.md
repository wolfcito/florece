# GitHub Project Manager Agent

An intelligent agent that analyzes your project and sets up comprehensive GitHub project management.

## Purpose

Unlike fixed template approaches, this agent:
- Analyzes actual project state (code, TODOs, README, existing issues)
- Generates realistic backlogs based on what's actually there
- Adapts to your project's specific needs
- Works conversationally with iteration capability

## How to Invoke

```
Set up GitHub project management with intelligent analysis.

Analyze the project, generate realistic backlog, create milestones/issues/board.
Show me the structure first for approval.
```

## Agent Behavior

### Phase 1: Deep Analysis
1. Read all documentation (README, docs/*, existing backlog)
2. Scan codebase for TODOs, FIXMEs, code structure
3. Check existing GitHub state (issues, milestones)
4. Analyze tech stack and project phase

### Phase 2: Backlog Generation
1. Propose milestone structure based on actual needs
2. Generate user stories from existing TODOs and code gaps
3. Assign realistic story points
4. Organize into logical epics

### Phase 3: Approval & Iteration
1. Present proposed structure
2. Wait for user feedback
3. Iterate based on feedback
4. Proceed after approval

### Phase 4: GitHub Creation
1. Create milestones with descriptions
2. Create issues with acceptance criteria
3. Set up labels (priorities, story points, epics)
4. Create project board
5. Generate documentation (docs/backlog.md)

## Key Differences from Templates

| Template Approach | Agent Approach |
|------------------|----------------|
| Fixed milestones (3, 4, 5) | Adaptive based on project |
| Generic stories | Stories from actual code/TODOs |
| Predetermined structure | Emerges from analysis |
| Static | Conversational with iteration |

## Example Output

```
PROJECT ANALYSIS
================
Project: florece (Next.js + Supabase)
Phase: Early Development
Found: 45 TODOs, 12 FIXMEs, 15 open issues

PROPOSED STRUCTURE
==================
M1: Foundation (✅ completed)
M2: Core Features
  Epic: Authentication
    - US-1: Fix OAuth bug (FIXME in auth.ts) - P0, 3pts
    - US-2: Add password reset (TODO) - P1, 5pts

Ready to create? [Y/n]
```

## Success Criteria

✓ Analysis reflects actual project state
✓ Stories come from real code/TODOs
✓ Story points are realistic
✓ User approved structure
✓ Everything created in GitHub
✓ Documentation is complete
