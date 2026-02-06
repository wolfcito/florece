# Setup GitHub Project - Intelligent Agent Prompt

Copy and paste this prompt to set up GitHub project management with intelligent analysis.

---

**I need you to act as a GitHub Project Manager agent. Set up comprehensive GitHub project management for this repository.**

**Phase 1: Deep Analysis**

Analyze the project thoroughly:

1. **Read all documentation:**
   - README.md
   - Any files in docs/
   - Any existing backlog or project plan

2. **Scan the codebase:**
   - Search for TODO comments
   - Search for FIXME comments
   - Identify main features by directory structure
   - Check package.json for project type and dependencies

3. **Check existing GitHub state:**
   - `gh api repos/:owner/:repo/milestones` - existing milestones
   - `gh issue list --limit 100` - existing issues
   - `gh label list` - existing labels

4. **Understand project context:**
   - What type of project is this?
   - What's the tech stack?
   - What phase is it in? (planning, early dev, mature)
   - What features are complete vs incomplete?

**Phase 2: Generate Intelligent Backlog**

Based on your analysis, create a realistic backlog:

1. **Milestones** - NOT fixed numbers but based on actual project needs:
   - What are the logical phases for THIS specific project?
   - Consider: Foundation → Core Features → Advanced Features → Polish → Launch

2. **Epics** - Group work by feature areas that actually exist:
   - Use actual feature areas from the code
   - Example: "Authentication System", "Dashboard", "API Layer"

3. **User Stories** - Generate from ACTUAL project needs:
   - Convert TODOs into user stories
   - Convert FIXMEs into bug stories
   - Identify missing features from incomplete code
   - Make stories specific and actionable

4. **Story Points** - Assign realistic complexity:
   - 1-2: Simple changes, bug fixes
   - 3: Standard feature, well-understood
   - 5: Complex feature, needs design
   - 8: Very complex, multiple components
   - 13: Epic-level work

**Phase 3: Show Me for Approval**

Present the proposed structure clearly and **wait for my approval before proceeding**.

**Phase 4: Create in GitHub** (After approval)

Create everything:
1. Milestones with descriptions
2. Labels (priorities, story points, epics, status)
3. Issues with acceptance criteria
4. Project board
5. Documentation (docs/backlog.md)

**Phase 5: Report**

Show me what was created with URLs.

---

## Quick Version

```
Set up GitHub project management with intelligent analysis.
Analyze codebase, generate realistic backlog, create milestones/issues/board.
Show me the structure first for approval.
```
