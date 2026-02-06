# Claude Code Agents

Reusable agent definitions for common workflows.

## Available Agents

### 🦁 GitHub Project Manager

**Location:** `github-project-manager.md`

**Purpose:** Intelligently analyzes your project and sets up GitHub project management based on actual project state, not fixed templates.

**Quick Start:**
```
"Set up GitHub project management with intelligent analysis"
```

**What it does:**
1. Analyzes README, code, TODOs, existing GitHub state
2. Generates realistic backlog based on actual project needs
3. Creates milestones, issues, labels, and project board
4. Works iteratively with your approval

**When to use:**
- Starting a new project
- Organizing an existing project
- Restructuring GitHub project management
- After major feature additions
- When you have TODOs scattered in code

## How Agents Work

Unlike CLI tools with fixed templates:

| CLI Tool | Agent Approach |
|----------|----------------|
| Fixed templates | Adaptive based on project |
| Generic stories | Stories from real code |
| One command | Conversational with feedback |
| No context | Uses full project context |

## Integration

The agent system complements the `den-github-manager` CLI tool:

- **CLI Tool**: Quick setup, CI/CD automation
- **Agent**: Custom analysis, iteration, AI-powered

## Examples

### New Project
```
User: "Set up GitHub for my Next.js app"
Agent: [Analyzes Next.js structure]
       Proposing: 3 milestones, 5 epics, 18 stories
       ✅ Done!
```

### Existing Project with TODOs
```
User: "Organize my 50 TODOs into GitHub issues"
Agent: [Scans code, finds TODOs]
       Categorized into bugs, features, tasks
       ✅ Created 50 organized issues
```

## Files

```
.claude/
├── agents/
│   ├── README.md (this file)
│   └── github-project-manager.md
├── prompts/
│   └── setup-github-project.md
└── skills/
    ├── github-setup.md
    └── README.md
```

## Resources

- [Agent Definition](github-project-manager.md)
- [Skills System](../skills/README.md)
- [den-github-manager CLI](https://github.com/wolfcito/den-github-manager)
