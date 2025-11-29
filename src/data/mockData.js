// Mock Data for Demo - Works without Database
// Demo Accounts:
// Teacher: username: "teacher", password: "teacher123"
// Student: username: "student", password: "student123"

export const mockUsers = [
  {
    id: 1,
    username: 'teacher',
    email: 'teacher@school.com',
    password: 'teacher123', // Plain text for demo
    role: 'teacher',
    first_name: 'Dr. Sarah',
    last_name: 'Johnson',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    username: 'student',
    email: 'student@school.com',
    password: 'student123', // Plain text for demo
    role: 'student',
    first_name: 'Alex',
    last_name: 'Martinez',
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 3,
    username: 'student2',
    email: 'student2@school.com',
    password: 'student123',
    role: 'student',
    first_name: 'Emma',
    last_name: 'Wilson',
    created_at: '2024-01-21T10:00:00Z'
  }
];

export const mockCourses = [
  {
    id: 1,
    name: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'Fundamentals of programming, algorithms, and data structures.',
    teacher_id: 1,
    teacher_first_name: 'Dr. Sarah',
    teacher_last_name: 'Johnson',
    enrolled_students: 2,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Web Development Fundamentals',
    code: 'CS201',
    description: 'Learn HTML, CSS, JavaScript, and React for modern web development.',
    teacher_id: 1,
    teacher_first_name: 'Dr. Sarah',
    teacher_last_name: 'Johnson',
    enrolled_students: 2,
    created_at: '2024-01-16T10:00:00Z'
  },
  {
    id: 3,
    name: 'Database Systems',
    code: 'CS301',
    description: 'SQL, database design, and data management principles.',
    teacher_id: 1,
    teacher_first_name: 'Dr. Sarah',
    teacher_last_name: 'Johnson',
    enrolled_students: 1,
    created_at: '2024-01-17T10:00:00Z'
  }
];

export const mockEnrollments = [
  { student_id: 2, course_id: 1, enrolled_at: '2024-01-20T10:00:00Z' },
  { student_id: 2, course_id: 2, enrolled_at: '2024-01-21T10:00:00Z' },
  { student_id: 3, course_id: 1, enrolled_at: '2024-01-22T10:00:00Z' },
  { student_id: 3, course_id: 2, enrolled_at: '2024-01-22T10:00:00Z' },
  { student_id: 2, course_id: 3, enrolled_at: '2024-01-23T10:00:00Z' }
];

export const mockLearningOutcomes = [
  {
    id: 1,
    course_id: 1,
    title: 'Understand basic programming concepts',
    description: 'Students will be able to write and debug simple programs.',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    course_id: 1,
    title: 'Apply algorithms to solve problems',
    description: 'Students will implement common algorithms and data structures.',
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 3,
    course_id: 2,
    title: 'Build responsive web applications',
    description: 'Students will create modern, responsive web interfaces.',
    created_at: '2024-01-16T10:00:00Z'
  }
];

export const mockAssessments = [
  {
    id: 1,
    course_id: 1,
    title: 'Midterm Exam',
    description: 'Covers chapters 1-5: Variables, Functions, Loops, Arrays, and Objects.',
    assessment_type: 'exam',
    max_score: 100,
    due_date: '2024-02-15',
    created_by: 1,
    course_name: 'Introduction to Computer Science',
    course_code: 'CS101',
    creator_first_name: 'Dr. Sarah',
    creator_last_name: 'Johnson',
    created_at: '2024-01-25T10:00:00Z'
  },
  {
    id: 2,
    course_id: 1,
    title: 'Programming Assignment 1',
    description: 'Create a calculator application using JavaScript.',
    assessment_type: 'assignment',
    max_score: 50,
    due_date: '2024-02-01',
    created_by: 1,
    course_name: 'Introduction to Computer Science',
    course_code: 'CS101',
    creator_first_name: 'Dr. Sarah',
    creator_last_name: 'Johnson',
    created_at: '2024-01-18T10:00:00Z'
  },
  {
    id: 3,
    course_id: 2,
    title: 'React Portfolio Project',
    description: 'Build a personal portfolio website using React.',
    assessment_type: 'project',
    max_score: 100,
    due_date: '2024-02-20',
    created_by: 1,
    course_name: 'Web Development Fundamentals',
    course_code: 'CS201',
    creator_first_name: 'Dr. Sarah',
    creator_last_name: 'Johnson',
    created_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 4,
    course_id: 2,
    title: 'Weekly Quiz 3',
    description: 'Quiz on React Hooks and State Management.',
    assessment_type: 'quiz',
    max_score: 25,
    due_date: '2024-02-05',
    created_by: 1,
    course_name: 'Web Development Fundamentals',
    course_code: 'CS201',
    creator_first_name: 'Dr. Sarah',
    creator_last_name: 'Johnson',
    created_at: '2024-01-28T10:00:00Z'
  }
];

export const mockStudentAssessments = [
  {
    id: 1,
    student_id: 2,
    assessment_id: 1,
    score: 85,
    max_score: 100,
    percentage: 85.0,
    feedback: 'Excellent work! Strong understanding of concepts. Minor improvements needed in problem-solving approach.',
    graded_at: '2024-02-16T10:00:00Z',
    graded_by: 1
  },
  {
    id: 2,
    student_id: 2,
    assessment_id: 2,
    score: 45,
    max_score: 50,
    percentage: 90.0,
    feedback: 'Great implementation! Code is clean and well-documented.',
    graded_at: '2024-02-02T10:00:00Z',
    graded_by: 1
  },
  {
    id: 3,
    student_id: 2,
    assessment_id: 3,
    score: null,
    max_score: 100,
    percentage: null,
    feedback: null,
    graded_at: null,
    graded_by: null
  },
  {
    id: 4,
    student_id: 2,
    assessment_id: 4,
    score: 22,
    max_score: 25,
    percentage: 88.0,
    feedback: 'Good understanding of React concepts.',
    graded_at: '2024-02-06T10:00:00Z',
    graded_by: 1
  },
  {
    id: 5,
    student_id: 3,
    assessment_id: 1,
    score: 92,
    max_score: 100,
    percentage: 92.0,
    feedback: 'Outstanding performance! Excellent problem-solving skills.',
    graded_at: '2024-02-16T10:00:00Z',
    graded_by: 1
  },
  {
    id: 6,
    student_id: 3,
    assessment_id: 2,
    score: 48,
    max_score: 50,
    percentage: 96.0,
    feedback: 'Perfect implementation! Excellent code quality.',
    graded_at: '2024-02-02T10:00:00Z',
    graded_by: 1
  }
];

// Helper function to get user by credentials
export function authenticateUser(username, password) {
  const user = mockUsers.find(
    u => (u.username === username || u.email === username) && u.password === password
  );
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

// Helper function to get courses for a teacher
export function getTeacherCourses(teacherId) {
  return mockCourses.filter(c => c.teacher_id === teacherId);
}

// Helper function to get courses for a student
export function getStudentCourses(studentId) {
  const enrolledCourseIds = mockEnrollments
    .filter(e => e.student_id === studentId)
    .map(e => e.course_id);
  return mockCourses
    .filter(c => enrolledCourseIds.includes(c.id))
    .map(course => ({
      ...course,
      enrolled_at: mockEnrollments.find(
        e => e.student_id === studentId && e.course_id === course.id
      )?.enrolled_at
    }));
}

// Helper function to get assessments for a course
export function getCourseAssessments(courseId) {
  return mockAssessments.filter(a => a.course_id === courseId);
}

// Helper function to get student data
export function getStudentData(studentId) {
  const courses = getStudentCourses(studentId);
  const allAssessments = [];
  
  courses.forEach(course => {
    const courseAssessments = getCourseAssessments(course.id);
    courseAssessments.forEach(assessment => {
      const grade = mockStudentAssessments.find(
        sa => sa.student_id === studentId && sa.assessment_id === assessment.id
      );
      allAssessments.push({
        ...assessment,
        score: grade?.score || null,
        max_score: assessment.max_score,
        percentage: grade?.percentage || null,
        feedback: grade?.feedback || null,
        graded_at: grade?.graded_at || null
      });
    });
  });

  const gradedAssessments = allAssessments.filter(a => a.score !== null);
  const totalScore = gradedAssessments.reduce((sum, a) => sum + (a.score || 0), 0);
  const totalMaxScore = gradedAssessments.reduce((sum, a) => sum + (a.max_score || 0), 0);
  const averagePercentage = gradedAssessments.length > 0
    ? gradedAssessments.reduce((sum, a) => sum + (a.percentage || 0), 0) / gradedAssessments.length
    : null;

  return {
    ...mockUsers.find(u => u.id === studentId),
    courses,
    assessments: allAssessments,
    statistics: {
      total_assessments: allAssessments.length,
      graded_assessments: gradedAssessments.length,
      average_score: totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : null,
      average_percentage: averagePercentage
    }
  };
}



