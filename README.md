# Undergraduate Project Portal

A full-stack web application for managing and evaluating undergraduate final year projects at university level. The system supports the complete project lifecycle — from group registration and supervisor assignment to multi-phase evaluation and mark finalization.

---

## Features

### Role-Based Access
| Role | Access |
|---|---|
| **Student** | View their assigned project, track evaluation status, see finalized marks |
| **Evaluator** | View assigned groups, submit proposal / progress / final evaluation marks |
| **Admin** | Upload students via CSV, assign evaluators, manage groups, finalize marks |
| **HOD** | View all projects and year-on-year analytics |

### Core Functionality
- **Bulk registration** — upload students and groups via CSV with automatic user account creation
- **Three-phase evaluation** — Proposal, Progress, and Final evaluations with both group-level and individual student criteria
- **Per-student mark calculation** — on finalization, each student's total is computed from their individual criteria marks plus their share of group criteria marks
- **Project gallery** — Cloudinary-integrated image uploads with multi-image gallery view
- **Admin analytics** — year-on-year trends for projects, students, and evaluators with bar chart visualization
- **Evaluator dashboard** — paginated project card grid with year filter and evaluation status badges

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux Toolkit, redux-persist, React Router v6 |
| UI | Reactstrap (Bootstrap 4.6), Nucleo Icons, Font Awesome |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose ODM |
| Auth | JWT (JSON Web Tokens) |
| File Storage | Cloudinary |
| State | Redux Toolkit with full store persistence |

---

## Project Structure

```
UGP-Website/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controller/       # Route handlers
│   │   │   └── router/           # Express routers
│   │   ├── models/               # Mongoose schemas
│   │   └── app.js / server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Sidebar, Navbar, shared UI
│   │   ├── layouts/              # Admin, Auth layouts
│   │   ├── store/                # Redux slices and actions
│   │   ├── views/
│   │   │   └── examples/         # Page components
│   │   └── utils/
│   └── package.json
└── sample_data/                  # CSV templates for data upload
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
MONGO_URI=your_mongodb_atlas_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
```

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app runs on `http://localhost:3000`. The backend API runs on `http://localhost:5000`.

---

## Data Upload

Student groups are registered via the Admin panel using two CSV files:

**students.csv**
```
Reg_No,Name,Group_ID,Project_Title,Main_supervisor_name
SC/2021/001,Kavindu Perera,G001,Smart Attendance System,Dr. Jayasena
```

**evaluation_criteria.csv**
```
section,criteria,sub_criteria,marks_resaved,marks
proposal,Problem Definition,Individual,10,0
proposal,Literature Review,Group,15,0
```

Sample files are available in the `/sample_data` directory.

---

## Evaluation Workflow

```
Admin uploads CSV → Groups created with evaluation schema
       ↓
Admin assigns Evaluator to groups
       ↓
Evaluator submits Proposal marks (group + individual per student)
       ↓
Evaluator submits Progress marks
       ↓
Evaluator submits Final marks
       ↓
Admin finalizes → studentFinalMarks calculated per student
       ↓
Students can view their final marks
```

---

## Default Credentials (Development)

Student and evaluator accounts created via CSV upload use their registration number as both username and password (e.g., `SC/2021/001` / `SC/2021/001`). Admin accounts are created manually in the database.

---

## User Types

| userType | Role |
|---|---|
| 0 | Student |
| 1 | Evaluator |
| 2 | Admin |
| 3 | HOD |
