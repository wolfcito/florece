---
name: pr
description: Generate PR title and description in markdown format (text only, no execution)
triggers:
  - "create pr"
  - "generate pr"
  - "pr description"
  - "pull request"
---

# /pr - Generate PR Description

Generate a pull request title and description based on current branch changes.

## Instructions

1. **Analyze Changes:**
   - Run `git status` to see current branch and uncommitted files
   - Run `git diff` to see unstaged changes
   - Run `git diff --staged` to see staged changes
   - Run `git log origin/main..HEAD --oneline` to see commits on this branch

2. **Generate PR Content:**
   - Create a concise PR title (under 70 characters)
   - Write a clear description with:
     - **Summary:** What this PR does (1-3 sentences)
     - **Changes:** Bulleted list of key changes
     - **Testing:** How to test/verify the changes
     - **Notes:** Any important context or decisions

3. **Output Format:**
   ```markdown
   ## Title
   [Your PR title here]

   ## Summary
   [Brief description of what this PR accomplishes]

   ## Changes
   - Change 1
   - Change 2
   - Change 3

   ## Testing
   - [ ] Step 1
   - [ ] Step 2
   - [ ] Step 3

   ## Notes
   [Any additional context, breaking changes, or follow-up items]

   Wolfcito 🐾 @akawolfcito
   ```

4. **IMPORTANT:**
   - Output **TEXT ONLY** - do NOT execute `gh pr create`
   - Do NOT push or create the PR unless explicitly asked
   - Just provide the markdown content for the user to review

## Example Usage

User: "/pr"
Claude: [Analyzes git changes and outputs PR markdown as text]

User: "Create the PR with that description"
Claude: [Now executes `gh pr create` with the description]
