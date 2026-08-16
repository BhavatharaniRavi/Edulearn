# EduLearn — Online Course Learning Platform (MERN Stack)

A full-stack online course platform built with MongoDB, Express, React, and Node.js.

## Features
- JWT authentication with roles: **student**, **instructor**, **admin**
- Instructors can create courses, add lessons, view their course list
- Students can browse/search courses, enroll, track progress, and leave reviews
- Course ratings (average rating auto-calculated from reviews)
- Progress tracking per enrollment (percentage of lessons completed)
- Clean, responsive React UI (no CSS framework dependency)

## Tech Stack
- **Frontend:** React 18, React Router v6, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Auth:** JSON Web Tokens (JWT), bcryptjs for password hashing

## Project Structure
```
online-course-platform/
├── backend/
│   ├── config/db.js
│   ├── models/          (User, Course, Lesson, Enrollment)
│   ├── middleware/auth.js
│   ├── controllers/     (auth, course, enrollment logic)
│   ├── routes/          (auth, course, enrollment routes)
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.js
    │   ├── components/  (Navbar, PrivateRoute)
    │   ├── pages/        (Home, Login, Register, Courses, CourseDetail, Dashboard, CreateCourse)
    │   ├── App.js
    │   └── styles.css
    └── .env.example
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: set MONGO_URI and a strong JWT_SECRET
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if your backend runs elsewhere
npm start
```
Frontend runs at `http://localhost:3000`.

## API Reference

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register (role: student/instructor) |
| POST | /api/auth/login | Public | Login, returns JWT |
| GET  | /api/auth/me | Private | Get logged-in user profile |

### Courses
| Method | Route | Access | Description |
|---|---|---|---|
| GET | /api/courses | Public | List courses (supports ?keyword=&category=&level=) |
| GET | /api/courses/:id | Public | Get single course with lessons & reviews |
| GET | /api/courses/instructor/mine | Instructor/Admin | Get my created courses |
| POST | /api/courses | Instructor/Admin | Create a course |
| PUT | /api/courses/:id | Owner/Admin | Update a course |
| DELETE | /api/courses/:id | Owner/Admin | Delete a course |
| POST | /api/courses/:id/lessons | Owner/Admin | Add a lesson |
| POST | /api/courses/:id/reviews | Private | Add a review |

### Enrollments
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/enrollments/:courseId | Private | Enroll in a course |
| GET | /api/enrollments/my | Private | Get my enrollments |
| PUT | /api/enrollments/:courseId/progress | Private | Mark lesson complete / update progress |

## How Auth Works
1. On register/login, the backend signs a JWT containing the user ID.
2. The frontend stores `{ _id, name, email, role, token }` in `localStorage`.
3. Axios attaches `Authorization: Bearer <token>` to every request via an interceptor.
4. The `protect` middleware verifies the token and loads `req.user`; `authorize(...roles)` restricts routes by role.

## Suggested Next Steps
- Add video upload/streaming (e.g. via Cloudinary or AWS S3) instead of raw URLs
- Add payment integration (Stripe) for paid courses
- Add pagination for course listing
- Add a quiz/assessment model per lesson
- Deploy backend (Render/Railway) + frontend (Vercel/Netlify) + MongoDB Atlas
