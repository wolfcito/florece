---
name: github-setup
description: Intelligently analyze project and set up GitHub project management (milestones, issues, labels, project board) based on actual codebase, not templates
triggers:
  - "set up github"
  - "configure github project"
  - "organize github issues"
  - "create milestones"
  - "github project management"
  - "setup project board"
---

# GitHub Project Setup Skill

You are acting as an intelligent GitHub Project Manager. When invoked, you will:

## Automatic Workflow

### Phase 1: Silent Analysis (Don't ask, just do it)

1. **Read project documentation:**
   - README.md
   - docs/* (any documentation)
   - Any existing backlog files

2. **Scan codebase for work items:**
   ```bash
   # Find TODOs
   grep -r "TODO" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.py" --include="*.go" . 2>/dev/null | head -50

   # Find FIXMEs
   grep -r "FIXME" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.py" --include="*.go" . 2>/dev/null | head -50
   ```

3. **Check existing GitHub state:**
   ```bash
   gh api repos/:owner/:repo/milestones 2>/dev/null
   gh issue list --limit 50 --json number,title,state,labels,milestone
   gh label list
   ```

4. **Detect project type:**
   - Check package.json (Node.js)
   - Check requirements.txt (Python)
   - Check go.mod (Go)
   - Check Cargo.toml (Rust)

### Phase 2: Generate Intelligent Structure

Based on analysis, create a backlog that reflects **actual project needs**.

**DON'T:**
- Use fixed templates (3 milestones, 4 milestones, etc.)
- Generate generic stories like "Setup development environment"
- Ignore existing work

**DO:**
- Convert actual TODOs into user stories
- Convert FIXMEs into bug issues
- Use README roadmap as features
- Reflect real project phase
- Consider what's actually incomplete

**Story Points:**
- File changes < 50 lines = 1-2 points
- File changes 50-200 lines = 3-5 points
- New feature with tests = 5-8 points
- Major refactor or complex feature = 8-13 points

### Phase 3: Present for Approval

Show the user:
```
🔍 PROJECT ANALYSIS
===================
Project: [name]
Type: [tech stack]
Phase: [new/development/mature]

Found:
- X TODO comments
- Y FIXME comments
- Z existing issues

📋 PROPOSED GITHUB STRUCTURE
============================
Milestone 1: [Name] - [Description]
  Epic: [Name]
    - US-1: [Actual work from code] (P0, 3pts)

Total: X milestones, Y epics, Z issues

Ready to create? (Y/n)
```

**Wait for user approval before Phase 4**

### Phase 4: Create Everything (After approval)

```bash
# Create milestones
gh api repos/:owner/:repo/milestones \
  -f title="[Name]" \
  -f description="[Description]" \
  -f state="open"

# Create labels
gh label create "P0:Critical" --color "d73a4a" --force
gh label create "sp:3" --color "9e9e9e" --force
gh label create "in-progress" --color "0052cc" --force

# Create issues
gh issue create \
  --title "[Story Title]" \
  --body "[Description]" \
  --milestone "[Milestone]" \
  --label "P0:Critical,sp:3"

# Create project board
gh project create --owner @me --title "[Project] Board"
```

### Phase 5: Document Everything

Create or update `docs/backlog.md` with complete structure.

### Phase 6: Summary Report

```
✅ GITHUB PROJECT SETUP COMPLETE!

Created:
- X milestones
- Y labels
- Z issues
- 1 project board
- docs/backlog.md

View: https://github.com/[owner]/[repo]/milestones
```

## Key Principles

1. **Analyze, don't assume** - Every project is different
2. **Use actual data** - TODOs, code structure, README
3. **Show before creating** - Get user approval first
4. **Document everything** - Keep backlog.md as source of truth
5. **Be realistic** - Story points based on complexity

## Success Criteria

✓ Analysis reflects actual project state
✓ Stories come from real code/TODOs
✓ User approved structure
✓ Everything created in GitHub
✓ Documentation is complete
