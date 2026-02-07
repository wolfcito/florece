# Claude Code Configuration

This directory contains Claude Code configuration, skills, agents, and project instructions.

## 📁 Structure

```
.claude/
├── CLAUDE.md                    # 📋 Project instructions (read by Claude)
├── STATUS.md                    # 📊 Current project status
├── settings.local.json          # ⚙️ Local settings & hooks
├── skills/                      # 🎯 Auto-detected skills
│   ├── pr.md                   # Generate PR descriptions
│   ├── github-setup.md         # GitHub project setup
│   └── README.md
├── agents/                      # 🤖 Agent definitions
│   ├── github-project-manager.md
│   └── README.md
├── prompts/                     # 📝 Ready-to-use prompts
│   └── setup-github-project.md
└── GITHUB_PROJECT_AGENT.md      # 📖 Quick start guide
```

## 🎯 Skills

Skills are auto-detected workflows triggered by natural language.

### Available Skills:

#### `/pr` - PR Description Generator
**Triggers:** "create pr", "generate pr", "pr description"
**What it does:** Analyzes git changes and generates PR title + description (text only)
**Location:** `.claude/skills/pr.md`

#### `/github-setup` - GitHub Project Manager
**Triggers:** "set up github", "configure github project", "organize issues"
**What it does:** Analyzes codebase and creates realistic GitHub milestones/issues
**Location:** `.claude/skills/github-setup.md`

## 📋 CLAUDE.md

Main instructions file that Claude reads at the start of every session.

**Key sections:**
- Package Manager (pnpm only)
- Git & PR Workflow
- Context Discipline
- TypeScript/ES Modules rules
- Firebase & Gemini security
- Architecture patterns
- Execution bias

**To update:** Edit `.claude/CLAUDE.md`

## ⚙️ Settings & Hooks

### Hooks Configuration
Located in `.claude/settings.local.json`

**Active hooks:**
- `PostToolUse` → Type-check after Edit/Write operations
- Catches TypeScript errors early
- Runs automatically after file changes

### Permissions
Pre-approved commands for faster workflow:
- Git operations (add, commit, push)
- GitHub CLI (gh)
- pnpm commands
- Project scripts

## 🤖 Agents

Agent definitions for specialized tasks.

### github-project-manager
**Purpose:** Intelligent GitHub project setup with context-aware analysis
**Location:** `.claude/agents/github-project-manager.md`
**Triggers:** Via skill or direct prompt

## 📊 STATUS.md

Session handoff document. Updated at the end of each session with:
1. What was completed
2. What's in progress (exact file/line references)
3. What's blocked and why
4. Exact next steps

**Usage:**
```bash
cat .claude/STATUS.md  # Read current status
```

## 🎨 Usage Patterns

### Starting a New Session
1. Read STATUS.md for context
2. Check CLAUDE.md for project rules
3. Review active TODOs

### Ending a Session
1. Update STATUS.md with progress
2. Commit all changes
3. Leave clear next steps

### Using Skills
Just say what you want in natural language:
```
"Create a PR for these changes"
"Set up GitHub for this project"
```

Skills auto-detect and execute.

### Manual Prompts
Copy prompts from `.claude/prompts/` for specific workflows.

## 🔧 Customization

### Add a New Skill
```bash
# Create skill file
touch .claude/skills/my-skill.md

# Add frontmatter
---
name: my-skill
description: What the skill does
triggers:
  - "trigger phrase 1"
  - "trigger phrase 2"
---

# Instructions here...
```

### Add a New Hook
Edit `.claude/settings.local.json`:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "ToolName",
        "hooks": [
          {
            "type": "command",
            "command": "your-command",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

### Update Project Rules
Edit `.claude/CLAUDE.md` with new guidelines.

## 📚 Resources

### Internal Docs
- `.claude/CLAUDE.md` - Project instructions
- `.claude/STATUS.md` - Current status
- `.claude/GITHUB_PROJECT_AGENT.md` - Agent quick start

### Project Docs
- `docs/AGENTS.md` - AI agent onboarding
- `docs/architecture.md` - System design
- `docs/backlog.md` - Product backlog

## 🎓 Best Practices

1. **Keep CLAUDE.md concise** - Only essential rules
2. **Update STATUS.md regularly** - After each session
3. **Use skills for repeated workflows** - Don't repeat yourself
4. **Document decisions** - Why, not just what
5. **Version control everything** - Commit .claude/ changes

## 🚀 Quick Start

### For Users
```bash
# Read current status
cat .claude/STATUS.md

# Use a skill
# Just say: "Create a PR for these changes"

# View project rules
cat .claude/CLAUDE.md
```

### For AI Agents
1. Read `CLAUDE.md` first
2. Check `STATUS.md` for context
3. Follow project conventions
4. Update `STATUS.md` when done

---

**Last Updated:** 2026-02-06
**Version:** 2.0 (Insights-driven improvements)
