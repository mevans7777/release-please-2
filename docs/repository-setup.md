# Repository Setup Guide

## GitHub Repository Settings

To ensure squash merge commits follow your commitlint format, configure these GitHub repository settings:

### 1. Squash Merge Configuration

Go to **Settings → General → Pull Requests** and configure:

- ✅ **Allow squash merging**
- ✅ **Default to pull request title for squash merge commits**
- ✅ **Automatically delete head branches**
- ❌ **Allow merge commits** (optional - disable for cleaner history)
- ❌ **Allow rebase merging** (optional - disable for consistency)

### 2. Branch Protection Rules

Go to **Settings → Rulesets** and add a branch ruleset for `main`:

Ruleset Name: `main`
Enforcement status: `Active`
Target branch: `main`

#### Rules - Branch rules Required Settings:
- ✅ **Restrict deletions**
- ✅ **Require linear history**
- ✅ **Require a pull request before merging**
   - `Required approvals`: `1`
   - `Require approval of the most recent reviewable push`: `true`
   - `Allowed merge methods`: `Squash`
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging** ← **Critical for clean squash merges**
  - ✅ **Status checks that are required:**
    - `pr-title-lint` (Validate PR Title)
    - `commit-lint` (Validate Commit Messages)
    - `lint-code` (Lint Code)
    - `unit-tests` (Run Unit Tests)
    - `terrgrunt-check` (Run Terragrunt Check)
    - `terrgrunt-plan` (Run Terragrunt Plan)
    - `code-build` (Build Code)
    - `code-package` (Package Code)
    - `deploy` (Deploy)
    - `e2e-tests` (Run E2E Tests)
- ✅ **Block force pushes**

#### Optional Security Settings:
- ✅ **Require signed commits**

### 3. PR Title Template

Consider adding a PR template in `.github/pull_request_template.md`:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] feat: New feature
- [ ] fix: Bug fix
- [ ] docs: Documentation update
- [ ] chore: Maintenance task
- [ ] refactor: Code refactoring

## JIRA Ticket
- Link: [TICKET-123](https://your-jira.atlassian.net/browse/TICKET-123)

---
**PR Title Format:** `<type>: <JIRA-TICKET> - <description>`
**Example:** `feat: EVO-1234 - add user authentication`
```

## Developer Workflow for Out-of-Date Branches

When GitHub shows "This branch is out-of-date with the base branch":

### Option 1: Rebase (Recommended)
```bash
git checkout your-feature-branch
git fetch origin
git rebase origin/main
git push --force-with-lease
```

### Option 2: Merge main into branch
```bash
git checkout your-feature-branch
git fetch origin
git merge origin/main
git push
```

### Why Rebase is Preferred:
- **Cleaner history** - No merge commits in PR
- **Linear timeline** - Easier to follow changes
- **Better for squash merge** - Cleaner final commit

## How It Works

1. **Developer creates PR** with properly formatted title
2. **PR Title Validation** runs and checks format
3. **Commit Validation** runs on all commits in PR
4. **Branch must be up-to-date** with main before merge
5. **Both validations must pass** before merge is allowed
6. **Squash merge** uses PR title as commit message
7. **Result:** Clean main branch with consistent commit format

## Benefits

- **Consistent History** - All commits on main follow the same format
- **JIRA Integration** - Every commit traceable to a ticket
- **Clean Timeline** - Squash merges create linear history
- **Automated Enforcement** - No manual checking required
