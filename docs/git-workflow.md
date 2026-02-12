# Git Workflow Guide

This guide details the professional Git workflow set up for the **Sorry Mom Forum** project.

## 1. Branch Structure

| Branch | Purpose | Protection Rules |
| :--- | :--- | :--- |
| **`main`** | Production code. Stable. | **Safe**: No direct push.<br>**Reviews**: PR required (1 approval).<br>**Status**: Must be up to date. |
| **`develop`** | Integration branch. Default for dev. | **Reviews**: PR required before merge. |
| **`feature/*`** | New features (e.g., `feature/auth`). | No special protection (delete after merge). |
| **`bugfix/*`** | Non-critical bug fixes. | No special protection. |
| **`hotfix/*`** | Critical production fixes. | No special protection. |
| **`schema/*`** | Database schema changes. | **Strict**: Must follow schema rules below. |

## 2. GitHub Branch Protection Setup

Since I cannot directly configure GitHub repo settings via API for you, **you must apply these settings manually**:

1.  Go to **Settings** > **Branches** on GitHub.
2.  Click **Add rule**.
3.  **Rule for `main`**:
    *   **Branch name pattern**: `main`
    *   Check **Require a pull request before merging**.
    *   Check **Require approvals** (Set to 1).
    *   Check **Require status checks to pass before merging** (if you have CI).
    *   Check **Do not allow bypassing the above settings**.
4.  **Rule for `develop`**:
    *   **Branch name pattern**: `develop`
    *   Check **Require a pull request before merging**.
5.  **Set Default Branch**:
    *   Go to **Settings** > **General**.
    *   Change **Default branch** to `develop`.

## 3. Database Schema Workflow

Any change to `prisma/schema.prisma` requires:

1.  Create a branch: `git checkout -b schema/my-change develop`
2.  Update schema and run migration.
3.  Update **`docs/schema-changelog.md`** with details.
4.  Open a PR.

## 4. Pull Request Template

A template has been added at `.github/pull_request_template.md`. It will automatically load when you create a new PR on GitHub.

## 5. Cheat Sheet

**Start a Feature:**
```bash
git checkout develop
git pull
git checkout -b feature/new-login-screen
```

**Push Work:**
```bash
git add .
git commit -m "feat: design login form"
git push -u origin feature/new-login-screen
```

**Merge (via GitHub):**
1.  Open PR -> Select `develop` as base.
2.  Get approval -> Merge.
