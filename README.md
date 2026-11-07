# Talent HUB AISD 🎓💼

A modern, full-stack Campus Placement Management System designed to streamline campus recruitment drives, student eligibility checks, interview schedules, and transactional offer management.

---

## 🌟 Key Features

- **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for **Students** and **Placement Officers / Admins**.
- **Automated Eligibility Engine**:
  - Minimum CGPA criteria validation.
  - Active backlogs restriction checks.
  - Branch/department-specific eligibility filters.
  - One-offer policy enforcement.
- **Placement Drive Management**: Create, view, filter, and close company recruitment listings with package (CTC) and timeline details.
- **Recruitment Pipeline Tracking**: Finite state machine (FSM) enforcing valid status transitions:
  `APPLIED` ➔ `SHORTLISTED` ➔ `INTERVIEW_SCHEDULED` ➔ `INTERVIEWED` ➔ `OFFERED` ➔ `ACCEPTED` (with `REJECTED` available at non-terminal states).
- **Interview Coordination**: Slot creation, scheduling, and real-time status management.
- **Transactional Offer Acceptance**: Atomic acceptance handling that locks out future applications upon accepting an offer.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) (with automatic JWT authentication interceptor)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **ORM / Database**: [SQLAlchemy](https://www.sqlalchemy.org/) with SQLite / PostgreSQL support
- **Data Validation**: [Pydantic](https://docs.pydantic.dev/)
- **Authentication**: JWT (JSON Web Tokens) with `python-jose` and password hashing with `passlib` / `bcrypt`

---

## 📂 Project Structure

```
Talent HUB AISD/
├── backend/
│   ├── app/
│   │   ├── dependencies/    # Auth & role dependency injection
│   │   ├── models/          # SQLAlchemy database models
│   │   ├── routers/         # API endpoint routers (auth, jobs, applications, etc.)
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # Core business rules (eligibility, FSM, offers)
│   │   ├── database.py      # Database connection & session setup
│   │   ├── main.py          # FastAPI application entrypoint
│   │   └── seed.py          # Database seeding script
│   ├── requirements.txt     # Python backend dependencies
│   └── .env.example         # Example environment configuration
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components (Navbar, Sidebar, Modals, etc.)
│   │   ├── context/         # AuthContext and state providers
│   │   ├── pages/           # Student & Admin pages
│   │   ├── services/        # Axios API service callers
│   │   ├── App.jsx          # Router & main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json         # Node.js dependencies & scripts
│   ├── tailwind.config.js   # Tailwind CSS configuration
│   └── vite.config.js       # Vite build configuration
├── database.sql             # SQL schema definitions
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python**: 3.10+ installed
- **Node.js**: 18+ and npm installed
- **Git**

---

### Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Ensure `DATABASE_URL` and `SECRET_KEY` are configured.)*

5. (Optional) Seed the database with sample data:
   ```bash
   python -m app.seed
   ```

6. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Interactive API docs will be available at: `http://localhost:8000/docs`

---

### Frontend Setup

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 📜 Business Rules & Domain Logic

1. **Eligibility Enforcement**:
   A student can only apply if:
   - The recruitment drive is currently open (`job.is_open == True`).
   - The student has not previously accepted an offer (`has_accepted_offer == False`).
   - Student CGPA $\ge$ Job minimum CGPA.
   - Student backlogs $\le$ Job allowed backlogs.
   - Student's branch matches the allowed branches (or no branch restrictions exist).

2. **Application Pipeline (FSM)**:
   Status changes must follow the strict workflow:
   - `APPLIED` ➔ `SHORTLISTED` ➔ `INTERVIEW_SCHEDULED` ➔ `INTERVIEWED` ➔ `OFFERED` ➔ `ACCEPTED`
   - Rejection (`REJECTED`) is allowed from any active state.

3. **Offer Acceptance**:
   Acceptance is an atomic transaction updating the offer, locking the student's status, and marking the application as `ACCEPTED`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
