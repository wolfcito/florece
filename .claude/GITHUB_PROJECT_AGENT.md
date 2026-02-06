# 🦁 GitHub Project Manager - Agent & Skill System

## What We Built

An intelligent agent and skill system that analyzes projects and generates realistic GitHub project management - evolved from CLI templates to AI-powered context-aware setup.

## The Evolution

```
Manual Setup → CLI Templates → Intelligent Agent ✨
```

### ❌ Problem with CLI Templates (den-github-manager)
- Fixed templates: "simple=3, startup=4"
- Generic stories don't match real work
- No iteration or feedback

### ✅ Solution: Intelligent Agent
- Analyzes actual project state
- Generates stories from real code/TODOs
- Conversational with iteration
- Uses full project context

## How to Use

### For End Users (Natural Language)

Just say to Claude Code:

```
"Set up GitHub for this project"
```

That's it! The agent:
1. ✅ Analyzes your codebase
2. ✅ Finds TODOs/FIXMEs
3. ✅ Checks existing GitHub state
4. ✅ Generates realistic structure
5. ✅ Shows you for approval
6. ✅ Creates everything in GitHub

### Example Conversation

```
User: "Organize my GitHub issues"

Agent: [Auto-detects github-setup skill]
       "Analyzing your project...

       Found:
       - 32 TODOs in code
       - Next.js + TypeScript
       - Auth 60% complete
       - Dashboard started

       Proposing:
       - 3 milestones
       - 32 issues from your TODOs
       - Realistic story points

       Ready to create?"

User: "Yes!"

Agent: ✅ Done! https://github.com/you/repo/milestones
```

## Files Created

```
.claude/
├── agents/
│   ├── README.md                  # Agents overview
│   └── github-project-manager.md # Agent definition
├── prompts/
│   └── setup-github-project.md   # Copy-paste prompt
├── skills/
│   ├── README.md                  # Skills overview
│   └── github-setup.md            # Auto-detected skill
└── GITHUB_PROJECT_AGENT.md       # This guide
```

## Target Audience

**Anyone using AI coding agents** (Claude Code, ChatGPT, Cursor) who wants to:
- Organize GitHub projects
- Convert TODOs into issues
- Set up project management
- **Without installing tools or learning commands**

Just natural language. That's it.

## Distribution

### Copy to Any Project
```bash
cp -r .claude/skills /path/to/project/.claude/
```

### Git Submodule
```bash
git submodule add https://github.com/wolfcito/claude-skills .claude/skills
```

## Integration with CLI Tool

Both tools work together:

| Tool | Use Case |
|------|----------|
| **CLI (den-github-manager)** | Quick setup, CI/CD, scripts |
| **Agent/Skill** | Context-aware, iteration, natural language |

Install CLI: `npm install -g den-github-manager`

## Key Principles

1. **Analyze, don't assume** - Every project is different
2. **Use actual data** - TODOs, code, README
3. **Show before creating** - Get approval first
4. **Natural language** - No commands to learn
5. **Auto-detection** - Works transparently

## Success Criteria

✓ User uses natural language
✓ Agent auto-detects what to do
✓ Analysis reflects actual project
✓ Stories come from real code
✓ User approves structure
✓ Everything created in GitHub

---

**Ready to try it?** Just say: "Set up GitHub for this project"
