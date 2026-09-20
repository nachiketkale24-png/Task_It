# Task_It 📋

A full-stack **Team Task Management System** built as a Mini Project. Task_It enables teams to manage projects, assign tasks, track progress, and collaborate efficiently — all in one place.

🔗 **Live Frontend:** [task-it-gamma-six.vercel.app](https://task-it-gamma-six.vercel.app)  
🔗 **Live Backend API:** [task-it-nvyh.onrender.com](https://task-it-nvyh.onrender.com)

---

## ✨ Features

- 🔐 **Authentication** — JWT-based login/register + Google Sign-In via Firebase
- 👥 **Team Management** — Create teams, invite members, assign roles (Owner / TeamLead / Intern)
- 📁 **Projects** — Create and manage projects linked to teams
- ✅ **Task Management** — Full task lifecycle with priorities, deadlines, subtasks, comments & attachments
- 📊 **Dashboard** — Real-time stats, activity feed, overdue tasks, member workload chart, task status chart
- 📄 **Documents** — Upload and manage team documents via Cloudinary
- 🔔 **Notifications** — In-app notifications + email reminders for deadlines
- 📈 **Reports** — Export project/task reports as PDF or Excel
- 🐙 **GitHub Integration** — Link GitHub repositories to projects
- 🛡️ **RBAC** — Role-Based Access Control across Teams, Projects, and Tasks
- ⚙️ **Settings** — User profile and account settings

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React (Vite) | UI Framework |
| React Router v6 | Client-side Routing |
| Axios | HTTP Client |
| Recharts | Charts & Data Visualization |
| Firebase SDK | Google Authentication |
| date-fns | Date Formatting |
| React Icons | Icon Library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server Framework |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Authentication |
| Firebase Admin SDK | Google Auth Verification |
| Cloudinary + Multer | File/Document Uploads |
| Nodemailer | Email Notifications |
| PDFKit + ExcelJS | Report Generation |
| Helmet + Morgan | Security & Logging |

---

## 📁 Project Structure

```
Task_It/
├── backend/
│   ├── src/
│   │   ├── config/         # DB & Firebase config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth & other middleware
│   │   ├── models/         # Mongoose schemas (User, Team, Project, Task, ...)
│   │   ├── routes/         # Express routers
│   │   ├── services/       # Business logic & cron jobs
│   │   ├── utils/          # RBAC, email helpers
│   │   ├── validators/     # Input validation
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components (layout, dashboard, tasks, ...)
    │   ├── pages/          # Page-level components (auth, dashboard, teams, ...)
    │   ├── routes/         # AppRoutes with ProtectedRoute HOC
    │   ├── services/       # API call functions
    │   ├── utils/          # RBAC helpers
    │   └── main.jsx
    ├── vercel.json         # SPA routing config for Vercel
    └── package.json
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Firebase project (for Google Auth)
- Cloudinary account (for document uploads)

### 1. Clone the Repository
```bash
git clone https://github.com/shristitapse/Task_It.git
cd Task_It
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# GitHub Integration
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run the frontend:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 🔑 Role-Based Access Control (RBAC)

| Role | Permissions |
|---|---|
| **Owner** | Full access — manage team, members, projects, and all tasks |
| **TeamLead** | Create/edit projects and tasks, manage team members |
| **Intern** | View and update only their own assigned tasks |

---

## 📡 API Endpoints

| Module | Base Route |
|---|---|
| Auth | `/api/auth` |
| Teams | `/api/team` |
| Projects | `/api/projects` |
| Tasks | `/api/tasks` |
| Dashboard | `/api/dashboard` |
| Reports | `/api/reports` |
| Notifications | `/api/notifications` |
| Documents | `/api/documents` |
| Users | `/api/users` |
| Settings | `/api/settings` |
| GitHub | `/api/github` |

---

## ☁️ Deployment

| Service | Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | [Render](https://render.com) |
| Database | MongoDB Atlas |
| File Storage | Cloudinary |

### Deploying Backend on Render
1. Set **Root Directory** to `backend`
2. **Build Command:** `npm install`
3. **Start Command:** `npm start`
4. Add all environment variables in the Render dashboard under **Environment**

### Deploying Frontend on Vercel
1. Set **Root Directory** to `frontend`
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`
4. Add all `VITE_*` environment variables in Vercel dashboard under **Environment Variables**

---

## 👨‍💻 Team

| Name | Role |
|---|---|
| Shrishti Tapse | Backend Development |
| Chinmay Karmalkar | Firebase Authentication |
| Nachiket Kale | Frontend & Deployment |

---

## 📝 License

This project was developed as a **Mini Project** for academic purposes  now check.
