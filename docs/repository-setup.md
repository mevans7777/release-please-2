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

Go to **Settings → Branches** and add a rule for `main`:

#### Required Settings:
- ✅ **Require a pull request before merging**
- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging** ← **Critical for clean squash merges**
  - ✅ **Status checks that are required:**
    - `pr-title-lint` (Validate PR Title)
    - `commit-lint` (Validate Commit Messages)

#### Recommended Settings:
- ✅ **Require linear history** (enforces squash merge only)
- ✅ **Do not allow bypassing the above settings** (enforces rules for admins)

#### Optional Security Settings:
- ✅ **Restrict pushes that create files**
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

## GitHub Repository Settings Secrets Setup

### 1. Relase Please Token

Go to **Settings → Developer Settings → Personal access tokens** and create a new token with the following permissions:

- ✅ **repo** (full control)
- ✅ **workflow** (full control)
- ✅ **write:packages** (full control)

Add the token to your repository secrets as `RELEASE_PLEASE_GITHUB_TOKEN`.

### 2. Coralogix API token for terraform

Create a new "Team Keys" token in Coralogix for the terraform workflows. A key in each Coralogix team (nonprod and prod) to be created called terraform-sa with the role SENDDATA.

Add the token to your repository secrets as `CORALOGIX_API_KEY_NONPROD`.

Add the token to your repository secrets as `CORALOGIX_API_KEY_PROD`.

### 3. Coralogix API token for OpenTelemetry collector

Create a new "Send-Your-Data API keys" key in Coralogix for the OpenTelemetry collector. A key in each Coralogix team (nonprod and prod) to be created called otel-collector with the role SENDDATA 

Add the token to your repository secrets as `OTEL_COLLECTOR_CORALOGIX_API_KEY_NONPROD`.

Add the token to your repository secrets as `OTEL_COLLECTOR_CORALOGIX_API_KEY_PROD`.

### 4. Fastly API token


The Fastly API token is required for the `fastly-exporter` to scrape real-time analytics from the Fastly API. Follow these steps to create a token with the minimum required permissions.

1.  **Navigate to the Fastly API token page**:
    - Go to [**Account → Personal tokens**](https://manage.fastly.com/account/personal/tokens) in the Fastly UI.

2.  **Create a new token** with the following settings:
    - **Name**: `her-ecom-observability-iac` (or a descriptive name)
    - **Scope**: `global:read` (Read-only access)
    - **Services**: Select **All services** for access.
    - **Expiration**: Choose an expiration date (e.g., 1 year). **Note**: For enhanced security, avoid setting the expiration to `Never`.

3.  **Copy the generated token** immediately, as it will not be shown again.

4.  **Add the token to GitHub repository secrets**:
    - Go to **Settings → Secrets and variables → Actions** in your GitHub repository.
    - Click **New repository secret**.
    - Name the secret `FASTLY_PROMETHEUS_EXPORTER_API_KEY`.
    - Paste the token value into the `Secret` field.

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
