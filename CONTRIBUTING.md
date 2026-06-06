# Contributing to goodWill 🩸

Thank you for your interest in contributing to **goodWill** — a real-time, location-based blood donation platform that connects patients in urgent need with registered donors, blood banks, and hospitals.

Every bug fix, feature, and improvement helps make blood donation faster and more accessible. Welcome! 🚀

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Fork & Clone the Repository](#fork--clone-the-repository)
  - [Setting Up the Development Environment](#setting-up-the-development-environment)
- [Project Structure](#project-structure)
- [Branch Naming Conventions](#branch-naming-conventions)
- [Making Changes](#making-changes)
  - [Commit Message Style](#commit-message-style)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Issues](#reporting-issues)
- [Need Help?](#need-help)

---

## Code of Conduct

By participating in this project, you agree to keep this space respectful, inclusive, and constructive. Be kind, patient, and welcoming — especially to first-time contributors.

---

## Getting Started

### Fork & Clone the Repository

1. **Fork** this repository by clicking the **Fork** button at the top-right of the [goodWill GitHub page](https://github.com/aanya-srivastava/goodWill).

2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/goodWill.git
   cd goodWill
   ```

3. **Add the upstream remote** to stay in sync with the original:
   ```bash
   git remote add upstream https://github.com/aanya-srivastava/goodWill.git
   ```

4. **Verify your remotes:**
   ```bash
   git remote -v
   # origin    https://github.com/YOUR_USERNAME/goodWill.git (fetch)
   # upstream  https://github.com/aanya-srivastava/goodWill.git (fetch)
   ```

---

### Setting Up the Development Environment

#### Prerequisites

| Tool | Purpose |
|------|---------|
| [Node.js](https://nodejs.org/) (v18+) | JavaScript runtime |
| [npm](https://npmjs.com/) | Package manager |
| [MongoDB](https://www.mongodb.com/try/download/community) | Local database |

> Make sure MongoDB is running locally on `mongodb://localhost:27017` before starting the backend.

#### Backend Setup (Express + MongoDB)

```bash
cd init
npm install
```

Seed the database with mock hospital records:

```bash
node seed-hospital.js
```

Start the backend server:

```bash
node server.js
```

#### Frontend Setup (React + Vite)

Open a new terminal, navigate back to the project root, and run:

```bash
cd ..
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

#### Keep your fork up to date before starting any new work:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## Project Structure

```text
goodWill/
├── src/                  # Frontend React source files (components, pages, hooks)
├── init/                 # Express backend (models, routes, seeders)
│   ├── server.js         # Entry point for the backend server
│   └── seed-hospital.js  # Script to populate mock hospital data
├── public/               # Static assets
├── components.json       # UI components definition
├── index.html            # Entry HTML
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration for frontend
└── README.md
```

- **Frontend changes** → `src/`
- **Backend/API changes** → `init/` (routes, models, middleware)
- **Database schema changes** → Mongoose models inside `init/`
- **Seed data changes** → `init/seed-hospital.js`

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/hospital/available` | Fetch hospitals sorted by blood type availability |
| `POST` | `/hospital/update` | Update hospital blood inventory upon donation |

---

## Branch Naming Conventions

Always create a new branch for your changes. **Never commit directly to `main`.**

Use this format:

```text
<type>/<short-description>
```

| Type | When to use | Example |
|------|-------------|---------|
| `feat` | New feature | `feat/donor-reward-system` |
| `fix` | Bug fix | `fix/blood-sort-filter` |
| `docs` | Documentation only | `docs/add-contributing-guide` |
| `chore` | Maintenance (deps, config) | `chore/update-dependencies` |
| `refactor` | Code restructuring, no behavior change | `refactor/hospital-model` |
| `test` | Adding or updating tests | `test/donation-api-routes` |
| `style` | UI or formatting tweaks | `style/donor-card-mobile` |

**Create your branch:**
```bash
git checkout -b feat/your-feature-name
```

---

## Making Changes

- Keep each PR **focused** — one feature or fix per PR.
- For **frontend changes**, ensure the UI stays responsive across desktop, tablet, and mobile — the project uses Tailwind CSS with a mobile-first approach.
- For **backend/API changes**, test your endpoints manually (via Postman or curl) before pushing and document any new routes in your PR description.
- For **Mongoose schema changes**, make sure existing seed data in `seed-hospital.js` stays compatible, or update it accordingly.
- For **major changes**, open an issue first to discuss your approach before writing code.
- Keep code clean and easy to review — avoid bundling unrelated changes in a single PR.

### Commit Message Style

Follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

```text
<type>(<optional scope>): <short description>
```

**Examples for goodWill:**
```text
feat(rewards): add 15-point reward on successful donation
fix(api): handle null blood type in /hospital/available response
docs: add setup instructions to CONTRIBUTING.md
chore(deps): upgrade mongoose to latest version
refactor(backend): split hospital routes into separate router file
style(ui): fix donor card overflow on small screens
```

**Rules:**
- Use **imperative mood** — "add", not "added" or "adds"
- Keep the subject line under **72 characters**
- Reference related issues at the bottom: `Closes #5` or `Fixes #12`

---

## Submitting a Pull Request

1. **Push your branch** to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```

2. Go to [aanya-srivastava/goodWill](https://github.com/aanya-srivastava/goodWill) on GitHub and click **"Compare & pull request"**.

3. Fill in the PR description with:
   - A clear **title** (e.g. `feat: add donor reward points system`)
   - **What changed** and **why**
   - Screenshots or recordings for any UI changes
   - API changes documented if backend was modified
   - The issue it resolves: `Closes #<issue-number>`

4. For major changes, open an issue first to discuss before submitting a PR.

5. A maintainer will review your PR. Requested changes are normal — address the feedback, push your updates, and you'll get merged once approved. 🎉

---

## Reporting Issues

Found a bug or have a feature idea? [Open an issue](https://github.com/aanya-srivastava/goodWill/issues)!

**Before opening an issue:**
- Search [existing issues](https://github.com/aanya-srivastava/goodWill/issues) to avoid duplicates.
- Check if it's already fixed in the latest commit on `main`.

**For bug reports, include:**
- Clear, descriptive title
- Steps to reproduce the problem
- Expected vs. actual behavior
- Your OS, Node.js version (`node -v`), and browser
- Terminal or browser DevTools error logs if available

**For feature requests, include:**
- The problem you're solving
- Your proposed solution
- Any alternatives you considered

---

## Need Help?

- Browse [open issues](https://github.com/aanya-srivastava/goodWill/issues) for context on ongoing work.
- Leave a comment on the relevant issue or PR.
- Reach the maintainer via GitHub: [aanya-srivastava](https://github.com/aanya-srivastava)

New to open source or the MERN stack? Look for issues tagged **`good first issue`** — they're scoped to be approachable for beginners. We'd love to have you! 💙

---

*This guide is open to improvement too. If something is unclear or missing — feel free to open a PR or issue for it.*

---

<div align="center">

Made with ❤️ by the goodWill team.

[![Star on GitHub](https://img.shields.io/github/stars/aanya-srivastava/goodWill?style=social)](https://github.com/aanya-srivastava/goodWill)
[![Fork on GitHub](https://img.shields.io/github/forks/aanya-srivastava/goodWill?style=social)](https://github.com/aanya-srivastava/goodWill/fork)

</div>