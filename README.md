# Sorry Mom Forum

A MERN stack project hosted on GitHub, featuring a Next.js frontend and PostgreSQL database.

## Branching Strategy

We follow a professional Git branching workflow designed for collaboration and stability.

### Core Branches
- **`main`**: The production-ready branch. Do not push directly. Create a Pull Request (PR) to merge changes.
- **`develop`**: The integration branch for ongoing development. This is the default branch for new features.

### Feature Branches
Use `feature/*` for new features.
- Example: `feature/authentication`, `feature/user-profile`

### Bugfix Branches
Use `bugfix/*` or `hotfix/*` for fixes.
- `bugfix/*`: Changes merged into `develop`.
- `hotfix/*`: Critical fixes merged directly into `main` (and backported to `develop`).

### Database Schema Changes
Use `schema/*` for database schema updates.
- Example: `schema/user-model-update`

#### Rules for Schema Changes:
1.  Isolate schema changes in a dedicated branch.
2.  Include migration notes in this README section or a dedicated migration guide.
3.  Include the updated model file.
4.  Assess and document backward compatibility impact.
5.  If an API change is required, create a related feature branch and ensure frontend compatibility.

---

## Workflow

1.  **Start a new task**:
    ```bash
    git checkout develop
    git pull origin develop
    git checkout -b feature/my-cool-feature
    ```

2.  **Commit Changes**:
    Follow Conventional Commits:
    - `feat: add login page`
    - `fix: resolve crash on startup`
    - `docs: update readme`
    - `chore: update dependencies`

3.  **Create a Pull Request**:
    Push your branch and open a PR against `develop`.
    - Fill out the PR template completely.
    - Request review from at least one team member.

4.  **Merge**:
    After approval and CI checks pass, merge the PR.

---

## Schema Changelog

Track all database schema modifications in [docs/schema-changelog.md](docs/schema-changelog.md).

## Environment Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/lokesh1008loki/sorry-mom-forum.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Set up environment variables:
    Copy `.env.example` to `.env` and fill in the required values.

4.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
