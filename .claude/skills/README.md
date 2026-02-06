# Claude Code Skills

Skills are auto-detected workflows that trigger when users use natural language.

## Available Skills

### 🦁 github-setup

**Trigger phrases:**
- "Set up GitHub"
- "Configure GitHub project"
- "Create milestones"
- "Organize GitHub issues"
- "GitHub project management"

**What it does:**
Automatically analyzes your project and sets up comprehensive GitHub project management WITHOUT requiring you to copy/paste prompts or run CLI commands.

**Usage:**
```
"Set up GitHub for this project"
```

The agent will:
1. ✅ Automatically analyze your codebase
2. ✅ Find TODOs and FIXMEs
3. ✅ Check existing GitHub state
4. ✅ Generate realistic backlog
5. ✅ Show you the structure for approval
6. ✅ Create everything in GitHub

## How Skills Work

### Traditional Approach ❌
```
User: "I need to configure GitHub"
Agent: "OK, what do you need?"
User: [Has to explain the whole process]
```

### Skills Approach ✅
```
User: "Set up GitHub"
Agent: [Auto-detects github-setup skill]
       [Already knows what to do]
       "Got it! Analyzing your project..."
```

## Why This Is Better

### For End Users
- ✅ Natural language - Just say what you want
- ✅ No installation - No npm packages, no CLI tools
- ✅ Context-aware - Agent has full project knowledge
- ✅ Conversational - Can iterate and adjust

### For Creators
- ✅ Auto-detection - Users don't need to know about the skill
- ✅ Reusable - Works in any project that includes this file
- ✅ Maintainable - Update one file, everyone benefits

## Distribution

### Copy to Any Project
```bash
cp -r .claude/skills /path/to/other/project/.claude/
```

### Git Submodule
```bash
git submodule add https://github.com/wolfcito/claude-skills .claude/skills
```

## Example Usage

```
User: "I have 30 TODOs in my code, help me organize them"

Agent: [Detects github-setup skill]
       "Analyzing your project...

       Found:
       - 32 TODOs
       - React + TypeScript app
       - 3 incomplete features

       Proposing structure:
       - 3 milestones
       - 32 issues from your TODOs

       Ready to create?"

User: "Yes!"

Agent: ✅ Done! https://github.com/you/project/milestones
```

## Target Audience

Anyone using AI coding agents (Claude Code, ChatGPT, Cursor) who wants to:
- Organize their GitHub projects
- Convert TODOs into issues
- Set up project management
- **Without installing tools or learning commands**

Just natural language. That's it.
