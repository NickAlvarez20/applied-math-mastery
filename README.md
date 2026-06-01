# Applied Math Mastery Project

## Table of Contents

- [Project Name](#project-name)
- [About](#about)
- [Prerequisites](#prerequisites)
- [Features](#features)
- [Getting Started & Installation](#getting-started--installation)
- [Usage](#usage)
- [Learning Outcomes](#learning-outcomes)
- [Contributing](#contributing)
- [License](#license)
- [Credits & Acknowledgements](#credits--acknowledgements)
- [Contact](#contact)

## Project Name

**Applied Math Mastery**

## About

Applied Math Mastery is a free, open-source math learning platform that helps students build real mastery—not just memorization. It connects algebra, calculus, statistics, geometry, etc. to careers, salary impact, and everyday applications. Visit https://appliedmathmastery.vercel.app for the live deployment. 

The app is a full-stack web project: a **React + TypeScript** frontend (Vite) talks to a **Go** REST API (Fiber). Learners browse subjects and topics, study concepts in **Forge Mode**, complete adaptive exercises, track XP and streaks, unlock achievements, and compete on global leaderboards.

## Prerequisites

To run this project locally you need:

- **[Go](https://go.dev/dl/)** 1.26+ (backend API)
- **[Node.js](https://nodejs.org/)** 18+ and **npm** (frontend)

Additional libraries are installed automatically via `go mod` and `npm install`—no manual dependency setup beyond those tools.

Optional for deployment:

- A [Vercel](https://vercel.com/) account (the project is configured for Vercel experimental services: Vite frontend + Go backend)

## Features

MathForge includes these features:

* **Subject & topic hub** — Browse Algebra, Calculus, Statistics, and Geometry with real-world context for each topic
* **Forge Mode** — Story-driven concept lessons, Plotly visualizations, and adaptive multiple-choice exercises per topic
* **Career Explorer** — See which careers each subject unlocks, average salaries, and estimated salary boosts from mastery
* **Gamified progress** — XP, levels, streaks, daily challenges, mastery badges, and achievement unlocks
* **Global leaderboard** — Weekly and all-time rankings to stay motivated
* **User accounts** — Register, log in, and sync progress via JWT-authenticated API routes
* **Personal dashboard** — Track completed topics, streaks, and recommended next steps
* **Light & dark themes** — Theme toggle with persisted UI preferences

## Getting Started & Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/NickAlvarez20/applied-math-mastery.git
cd applied-math-mastery
```

### Backend setup

```bash
cd backend
go mod download
```

Create a `.env` file in the project root (or `backend/`) if you want to override defaults:

```env
PORT=4000
JWT_SECRET=your-secret-here
ALLOWED_ORIGINS=http://localhost:5173
```

Start the API server:

```bash
go run .
```

The backend listens on `http://localhost:4000` by default.

### Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API calls to the backend at `/api/v1/...`.

### Verify installation

- Backend health: `GET http://localhost:4000/api/v1/health`
- Subjects list: `GET http://localhost:4000/api/v1/subjects`
- Open `http://localhost:5173` in your browser

## Usage

Run both services during development (backend and frontend in separate terminals):

```bash
# Terminal 1 — backend
cd backend && go run .

# Terminal 2 — frontend
cd frontend && npm run dev

# Shortcut - CTRL + SHIFT + B || CTRL + C to shutdown servers

```

Then:

1. Open the app at `http://localhost:5173`
2. Browse **Subjects** or **Career Explorer**
3. Sign up or log in to save progress
4. Open a topic and enter **Forge Mode** to study concepts and complete exercises
5. Check your **Dashboard**, **Achievements**, and **Leaderboard** as you earn XP

Build the frontend for production:

```bash
cd frontend && npm run build
```

For Vercel deployment details (routing, env vars, and production API paths), see [DEPLOY.md](./DEPLOY.md).

## Learning Outcomes

This project helped me:

* Build a **full-stack application** with a Go REST API and a React + TypeScript SPA
* Design **RESTful routes** for auth, subjects, progress, exercises, achievements, and leaderboards
* Implement **JWT authentication**, protected routes, rate limiting, and CORS in a real backend
* Create an interactive **learning UX** with adaptive exercises, gamification (XP, streaks, badges), and data visualizations
* Deploy a **monorepo** to Vercel using experimental services (Vite frontend + Go backend on one domain)

## Contributing

This is primarily a personal learning / portfolio repository, so formal contributions aren't required. However, if you spot bugs, have project ideas, or want to add improvements, feel free to:

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

Please include clear explanations of your changes and test any new code.

## License

This repository is open and free for educational use. It is hosted online at appliedmathmastery.vercel.app where people can create short-term accounts using local storage and login and play around.


## Credits & Acknowledgements

This project was created by [NickAlvarez20](https://github.com/NickAlvarez20) as part of my journey to learn **Go** and **TypeScript/React** full-stack development. View the source at [applied-math-mastery](https://github.com/NickAlvarez20/applied-math-mastery) or explore more of my work on GitHub.

Built with [Go Fiber](https://gofiber.io/), [React](https://react.dev/), [Vite](https://vitejs.dev/), [Zustand](https://zustand.docs.pmnd.rs/), and [Plotly.js](https://plotly.com/javascript/).

## Contact

You can find this project at [NickAlvarez20/applied-math-mastery](https://github.com/NickAlvarez20/applied-math-mastery) and more of my work at [NickAlvarez20 on GitHub](https://github.com/NickAlvarez20).
