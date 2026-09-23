<div align="center">

# 🅑 BaatSheet

**Speak a sentence → get a production-ready survey.**

An AI-powered Google Forms clone that builds entire forms — questions, options, descriptions and banner art — from a single prompt, typed or **spoken in Bangla (বাংলা) or English**.

[Features](#-features) · [Quick Start](#-quick-start) · [Run Locally](#-running-locally) · [Architecture](#-project-architecture) · [API](#-api-reference)

</div>

---

## 🤔 Why I built this

**I hate filing forms manually. Especially in 2026.**

Every time I needed a survey — customer feedback, a job application, an event RSVP — the workflow was the same: open Google Forms, add a title, add a description, type question 1, add 4 options, duplicate question 2, fix the typo in question 3… twenty minutes of pure drudgery before a single response even comes in.

So with generative AI everywhere, I asked myself one question:

> **Why am I still typing forms by hand?**

**BaatSheet** is the answer — a full Google Forms clone where **the AI does the boring part**. You describe the form you want, or just *say it out loud*, and within seconds you have a complete, shareable, production-ready survey. You only do the interesting part: review, tweak, share.

I originally built it for myself to stop suffering through form creation. It's now a full-stack app anyone can clone and self-host.

**What it solves:**

- ⏳ **Hours → seconds** — a form that took 20 minutes of clicking now takes one sentence.
- ⌨️ **No typing required** — speak your prompt hands-free in Bangla or English (plus 4 more languages).
- 🧠 **Writer's block** — don't know what to ask? Gemini designs context-aware questions and realistic options for you.
- 🌍 **Language barrier** — speak in বাংলা, get a complete form entirely in বাংলা (questions *and* options).
- 📊 **Raw responses → insight** — automatic executive summaries, sentiment breakdowns, themes and recommendations instead of a wall of rows.

---

## ✨ Features

### 🤖 Core AI Features

| Feature | What it does |
|---|---|
| 🤖 **Prompt-to-Form Generation** | Enter a prompt like *"Customer Satisfaction Survey for a Tech Product"* or *"Software Engineer Job Application"* — Gemini AI automatically generates context-aware questions with options, checkboxes, text fields, and descriptions. |
| 🎙️ **Multilingual Voice-to-Form** | Speak your prompt directly in **Bangla (বাংলা)** or **English** — plus Español, العربية, हिन्दी — using real-time browser speech recognition, and watch AI build your form hands-free. |
| 💡 **AI Question Generator & Refiner** | Generate extra questions or rephrase any existing question (or the form header) with 1 click, right inside the editor. |
| 🎨 **AI Banner Image Generator** | Create custom header/banner images on the fly from a text prompt, with aspect-ratio and style controls. |
| 📊 **AI Responses & Sentiment Insights** | One click gives you an executive summary, a positive/neutral/negative sentiment breakdown, key themes, and actionable recommendations from collected submissions. |

### ⚡ Form Builder Capabilities

- **Smooth drag-and-drop card reordering** — pointer-event physics with `requestAnimationFrame`, pre-measured layouts, and buttery `cubic-bezier` sibling shifting (no jitter).
- **Inline rich-text editor** — Bold, Italic, Underline, Links, Ordered/Unordered lists on titles, descriptions and questions.
- **Debounced cloud auto-save** — 700 ms snapshot-diffed autosave with save-status indicator (`Saving… / Saved / Error / Draft`) and a flush-on-unmount so fast navigation never loses keystrokes.
- **Guest draft migration** — build a form without an account (saved to `localStorage`); the moment you sign in, the draft is migrated to the cloud automatically.
- **Undo / Redo** — full history stack with `Ctrl+Z` / `Ctrl+Y` and header toolbar buttons.
- **Submission deadlines** — datetime deadline; expired forms show your custom closed message.
- **Response limits** — accept/reject responses toggle and *limit to 1 response per account*.
- **Verified account login** — require respondents to sign in so responses carry a verified email.
- **Responses dashboard** — paginated response list, CSV export, delete-all with confirmation, live accept-responses toggle.
- **Share modal, preview mode, public view page** — Google Forms-style `#responses` / `#settings` tabs and a real fillable respondent page with validation.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Redux Toolkit (RTK Query), Tailwind CSS 3, React Hook Form, React Router 6, Vite 5, Web Speech API |
| **Backend** | Node.js, Express 4, TypeScript, Mongoose 8, JWT (bcryptjs) |
| **Database** | MongoDB Atlas |
| **AI** | Google Gemini (`@google/genai`) — structured JSON output with schema + automatic model fallback chain · Pollinations.ai for banner images |
| **Deployment** | Frontend → Vercel (SPA rewrite) · Backend → Render · DB → MongoDB Atlas |

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/vishalsingh2972/baatsheet.git
cd baatsheet

# 2. Install dependencies (backend + frontend)
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 3. Configure environment (see below), then run both in separate terminals:
cd backend && npm run dev     # API → http://localhost:5000
cd frontend && npm run dev    # UI  → http://localhost:5173
```

Open **http://localhost:5173**, click the ✨ AI prompt, and speak or type your first form.

---

## 🏃 Running Locally

### Prerequisites

- **Node.js 18+** and npm
- A **MongoDB** instance — free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or a local `mongod`)
- A **Google Gemini API key** — [aistudio.google.com/apikey](https://aistudio.google.com/apikey) *(optional — the app falls back to built-in templates without it)*

### 1️⃣ Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
# Server Port
PORT=5000

# Environment (development | production)
NODE_ENV=development

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/baatsheet?retryWrites=true&w=majority

# Frontend Client URL (comma-separated for multiple)
CLIENT_URL=http://localhost:5173

# JWT Authentication Config
JWT_SECRET=your_super_secure_jwt_secret_key_123456
JWT_EXPIRES_IN=7d

# Google Gemini AI API Key (optional — AI degrades gracefully without it)
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the dev server:

```bash
npm run dev
```

Verify: `http://localhost:5000/health` → `{"status":"healthy", ...}`

### 2️⃣ Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
# Backend API Endpoint — point this at your local backend
VITE_API_URL=http://localhost:5000/api/v1
```

> ⚠️ **Note:** the code's built-in default is `http://localhost:5050/api/v1`, while the backend defaults to port **5000**. Always set `VITE_API_URL` explicitly (as above) or run the backend with `PORT=5050`.

Start the dev server:

```bash
npm run dev
```

Open **http://localhost:5173** 🎉

### 📜 Available Scripts

| Where | Command | What it does |
|---|---|---|
| `backend/` | `npm run dev` | Run API with hot-reload (`ts-node-dev`) |
| `backend/` | `npm run build` | Compile TypeScript → `dist/` |
| `backend/` | `npm start` | Run compiled production build |
| `frontend/` | `npm run dev` | Start Vite dev server (HMR) |
| `frontend/` | `npm run build` | Production build → `dist/` |
| `frontend/` | `npm run preview` | Preview the production build |
| `frontend/` | `npm run lint` | ESLint |

---

## 📁 Project Architecture

```
baatsheet/
├── backend/                        # Express + TypeScript + Mongoose
│   └── src/
│       ├── server.ts               # DB connect + listen + crash handlers
│       ├── app.ts                  # CORS, body limits, routes, 404, error handler
│       ├── config/                 # env config (port, mongo, jwt, gemini)
│       ├── errors/                 # ApiError + cast/duplicate/validation handlers
│       ├── shared/                 # catchAsync, sendResponse, jwtHelpers, httpStatus
│       └── app/
│           ├── middlewares/        # auth() (required) + optionalAuth
│           └── modules/            # feature modules: route → controller → service → model
│               ├── auth/           # signup, login, /me  (bcrypt + JWT)
│               ├── form/           # form CRUD, star, rename
│               ├── response/       # submit, list (owner-only), delete-all
│               └── ai/             # Gemini service, helpers, fallbacks, constants
│
└── frontend/                       # React 19 + Vite + RTK Query + Tailwind
    └── src/
        ├── App.jsx                 # router: /, /forms/create, /forms/:id/{edit,preview,view}, /login, /register
        ├── pages/                  # Home, CreateOrEditForm, FormPreview, FormView, Login, Register, 404
        ├── components/
        │   ├── createoreditform/   # editor canvas, drag-reorder, undo/redo, field actions
        │   ├── modals/             # AI prompt, AI question, image picker, share, auth, link
        │   ├── responses/          # response list, pagination, CSV export, AI insights
        │   ├── settings/           # responses / deadlines / presentation cards
        │   ├── preview/            # public fillable form + validation
        │   ├── header/ home/ auth/ common/ logo/
        ├── hooks/                  # useAuth, useAutoSave, useSpeechToText, useFormHistory…
        └── redux/                  # store, apiSlice + formApi/authApi, authSlice
```

**Design pattern:** the backend uses a layered `route → controller (catchAsync + sendResponse) → service → mongoose model` pattern per feature module; the frontend uses RTK Query endpoints with tag-based cache invalidation (`Form` / `User` / `Response`).

---

## 🔌 API Reference

All endpoints are mounted under **`/api/v1`**. Responses are wrapped as `{ success, message, data }`.
🔒 = requires `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` (alias `/auth/register`) | — | Create account, returns `{ user, token }` |
| POST | `/auth/login` | — | Sign in, returns `{ user, token }` |
| GET | `/auth/me` | 🔒 | Current profile |

### Forms
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/forms` | 🔒 | Create a form |
| GET | `/forms` | 🔒 | List my forms |
| GET | `/forms/:id` | — | Get a form (public share links) |
| PUT | `/forms/:id` | 🔒 | Full/partial update (autosave) |
| PATCH | `/forms/:id/name` | 🔒 | Rename |
| PATCH | `/forms/:id/star` | 🔒 | Toggle star |
| DELETE | `/forms/:id` | 🔒 | Delete |

### Responses
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/forms/:formId/responses` | optional | Submit a response (enforces deadline, closed form, verified login, 1-response limit) |
| GET | `/forms/:formId/responses` | 🔒 owner | List responses |
| DELETE | `/forms/:formId/responses` | 🔒 owner | Delete all responses |

### AI
| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/ai/generate-form` | `{ prompt }` | Full prompt-to-form generation |
| POST | `/ai/generate-options` | `{ questionTitle, questionType }` | 4–6 realistic choices |
| POST | `/ai/generate-question` | `{ prompt, context }` | Generate 1+ questions |
| POST | `/ai/edit-question` | `{ instruction, currentQuestion, formTitle }` | Rephrase/refine a question or header |
| POST | `/ai/generate-image` | `{ prompt, aspectRatio, style }` | Banner image (base64 data-URI) |
| POST | `/ai/summarize-responses` | `{ formTitle, questions, responses }` | Executive summary + sentiment + themes |

> **Resilience:** every AI endpoint validates + sanitizes model output and falls back to smart built-in templates if the API key is missing or Gemini fails, so the app never breaks.

---

## 🌐 Deployment

- **Frontend → Vercel**: set environment variable `VITE_API_URL=https://<your-backend>/api/v1`. `vercel.json` already rewrites all routes to `index.html`.
- **Backend → Render**: set `PORT`, `NODE_ENV=production`, `MONGODB_URI`, `CLIENT_URL` (your Vercel URL), `JWT_SECRET`, `GEMINI_API_KEY`. CORS allows your `CLIENT_URL` and `*.vercel.app` previews in production.
- **Database → MongoDB Atlas**: free M0 cluster works fine.

---

## 🗺️ Roadmap

- [ ] Templates gallery & duplicate-form
- [ ] Charts / per-question analytics in Responses
- [ ] File-upload question type
- [ ] Collaborative (multi-owner) editing
- [ ] Email notifications on new responses
- [ ] Rate-limiting + request validation on the API

---

## 🙏 Acknowledgements

- Google **Gemini** for structured form generation
- **Pollinations.ai** for free image generation
- The **Web Speech API** for hands-free Bangla/English dictation

---

<div align="center">
Made with 😤 and a deep hatred of filling forms manually — <b>baatsheet</b>
</div>