# Demo Accounts - Login Credentials

The application includes built-in demo accounts that work **without a database**. You can use these accounts to test the application immediately.

## 🎓 Demo Accounts

### Teacher Account
- **Username:** `teacher`
- **Password:** `teacher123`
- **Role:** Teacher
- **Access:** Full teacher dashboard with course management, assessments, grading, and reports

### Student Account
- **Username:** `student`
- **Password:** `student123`
- **Role:** Student
- **Access:** Student dashboard with progress tracking, grades, and learning outcomes

### Additional Student Account
- **Username:** `student2`
- **Password:** `student123`
- **Role:** Student
- **Access:** Student dashboard (different student perspective)

## 🚀 Quick Start

1. **Start the application:**
   ```bash
   cd client
   npm run dev
   ```

2. **Login with demo credentials:**
   - Use the quick login buttons on the login page, OR
   - Enter credentials manually

3. **No database required!** All data is pre-loaded in the frontend.

## 📊 What's Included

### Sample Data:
- ✅ 3 Courses (CS101, CS201, CS301)
- ✅ 4 Assessments (Midterm, Assignments, Projects, Quizzes)
- ✅ Student grades and feedback
- ✅ Learning outcomes
- ✅ Course enrollments

### Features You Can Test:
- ✅ Login/Logout
- ✅ Course Management (Teacher)
- ✅ Assessment Creation (Teacher)
- ✅ Student Grading (Teacher)
- ✅ Performance Reports (Teacher)
- ✅ Student Progress Tracking
- ✅ Grade Viewing (Student)
- ✅ Learning Outcomes (Student)

## 💡 Notes

- All data is stored in memory (frontend only)
- Changes persist during session but reset on page refresh
- Works completely offline - no backend required
- Perfect for demos and testing

## 🔄 Switching Between Backend and Mock Data

The app automatically uses mock data if:
- Backend is not running
- Environment variable `VITE_USE_MOCK=true` is set

To force mock mode, create `.env` file:
```env
VITE_USE_MOCK=true
```

To use real backend:
```env
VITE_API_BASE=http://localhost:4000/api
VITE_USE_MOCK=false
```

