# CIPHER CASE – THE MYSTERY HUNT
> **"Observe. Connect. Solve."**

A full-stack, fully digital non-technical mystery hunt web application built for college cultural events. Conduct entire mystery solving competitions digitally with automatic scoring, tie-breaking, server-synced countdown timers, and automatic progression across 3 rounds for 30 registered teams.

---

## 📌 Project Overview

**CIPHER CASE** is an interactive web platform designed for conducting multi-round deduction and observation events without requiring cybersecurity or programming knowledge.

### Event Structure
* **30 Teams** participate initially (`TEAM001` to `TEAM030`).
* **Round 1: Identify The Case** (15 minutes limit, 10 questions, 50 marks total). Top 10 teams qualify automatically.
* **Round 2: Trace The Clues** (20 minutes limit, 8 questions, 50 marks total, max 2 hints per team with -2 marks penalty). Top 5 teams qualify automatically.
* **Round 3: Crack The Case** (25 minutes limit, 5 major tasks, 100 marks total). Top 3 winners selected automatically.

---

## 🛠 Tech Stack

* **Frontend**: React.js (v18), Vite, Tailwind CSS, Lucide Icons, Framer Motion, Canvas Confetti, QRCode.react
* **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt.js
* **Database**: MongoDB, Mongoose
* **Environment**: Local Node.js runtime

---

## 📁 Folder Structure

```
shedefends/
├── .env                    # Local environment config
├── .env.example            # Template environment config
├── README.md               # Documentation & Setup guide
├── package.json            # Root package runner
├── server/
│   ├── config/             # DB connection config
│   ├── middleware/         # Auth & Admin validation
│   ├── models/             # Team, Round, Question, Submission schemas
│   ├── routes/             # Auth, Rounds, Admin, Clues, Teams API
│   ├── index.js            # Express app entry point
│   └── seed.js             # 30 Teams & Questions database seeder
└── client/
    ├── src/
    │   ├── components/     # Navbar, Footer, Timer, EvidenceCard, QRCodeClue, etc.
    │   ├── context/        # AuthContext
    │   ├── pages/          # Home, Rules, TeamLogin, Dashboard, Rounds 1-3, Results, Admin
    │   ├── App.jsx         # Router & Route guards
    │   └── index.css       # Tailwind & styling rules
    ├── index.html
    └── vite.config.js
```

---

## ⚙️ Installation & Setup

### Prerequisites
* **Node.js**: v18 or higher
* **MongoDB**: Running locally at `mongodb://127.0.0.1:27017/ciphercase` or a MongoDB Atlas URI.

### 1. Install Dependencies
Run from the root directory:
```bash
npm install
```
This automatically installs dependencies for both `server` and `client`.

### 2. Environment Configuration
Create `.env` file in the root folder (or copy `.env.example`):
```env
MONGO_URI=mongodb://127.0.0.1:27017/ciphercase
JWT_SECRET=ciphercase_secret_key_2026_super_secure
PORT=5000
```

### 3. Seed Database
Populate 30 teams (`TEAM001` to `TEAM030`), admin credentials (`ADMIN`/`admin123`), and all questions for Rounds 1, 2, and 3:
```bash
npm run seed
```

### 4. Run Application locally
Start both Backend and Frontend concurrently with a single command:
```bash
npm run dev
```
* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000`

---

## 🔐 Login Credentials

### Admin Login
* **Portal**: `/admin/login`
* **Username**: `ADMIN`
* **Password**: `admin123`

### Team Login Examples
* **Portal**: `/login`
* **Team IDs**: `TEAM001`, `TEAM002`, ..., `TEAM030`
* **Passwords**: `team001`, `team002`, ..., `team030`

---

## 🎯 How to Conduct the Event (Organizer Workflow)

1. **Log in as Admin** (`/admin/login`).
2. **Start Round 1**: Click `[ START ROUND 1 ]` in the Admin Control Panel.
3. **Participants Log In**: All 30 teams log in with their Team IDs and start solving Round 1 ("THE MISSING EVENT FILE").
4. **End & Finalize Round 1**: Click `[ END ROUND 1 ]` -> `[ FINALIZE ROUND 1 ]`. The backend ranks teams by highest score and lower completion time, automatically qualifying the Top 10 teams.
5. **Start Round 2**: Click `[ START ROUND 2 ]`. Only the 10 qualified teams will see Round 2 unlocked on their dashboards.
6. **End & Finalize Round 2**: Click `[ END ROUND 2 ]` -> `[ FINALIZE ROUND 2 ]`. Automatically qualifies the Top 5 teams for Round 3.
7. **Start Round 3**: Click `[ START ROUND 3 ]`. Top 5 finalists solve the final case dossier.
8. **Finalize Event**: Click `[ FINALIZE ROUND 3 ]`. System selects Rank 1 as Winner, Rank 2 as Runner Up, Rank 3 as Second Runner Up.
9. **Publish Results**: Click `[ PUBLISH RESULTS PAGE ]` to display the victory podium on `/results`.

---

## 🧪 Development / Testing Mode

Admin can reset all event data at any point during testing:
* Navigate to Admin Dashboard -> `DEV / TEST MODE`.
* Click **RESET ALL TEAMS & SUBMISSIONS** to clear database submissions and restart from Round 1.
