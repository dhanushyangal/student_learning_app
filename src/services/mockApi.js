// Mock API Service - Works without backend
import { 
  authenticateUser, 
  getTeacherCourses, 
  getStudentCourses,
  getStudentData,
  mockCourses,
  mockAssessments,
  mockStudentAssessments,
  mockUsers,
  mockEnrollments
} from '../data/mockData';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Authentication
  async login(credentials) {
    await delay(800);
    const user = authenticateUser(credentials.username, credentials.password);
    if (user) {
      return { data: user };
    }
    throw { response: { data: { error: 'Invalid credentials' } } };
  },

  async register(userData) {
    await delay(800);
    // In real app, this would create a new user
    // For demo, just return the user data
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      created_at: new Date().toISOString()
    };
    const { password: _, ...userWithoutPassword } = newUser;
    return { data: userWithoutPassword };
  },

  // Courses
  async getCourses(params = {}) {
    await delay(500);
    if (params.teacher_id) {
      return { data: getTeacherCourses(parseInt(params.teacher_id)) };
    }
    if (params.student_id) {
      return { data: getStudentCourses(parseInt(params.student_id)) };
    }
    return { data: mockCourses };
  },

  async getCourse(id) {
    await delay(300);
    const course = mockCourses.find(c => c.id === parseInt(id));
    if (!course) {
      throw { response: { status: 404, data: { error: 'Course not found' } } };
    }
    
    const students = mockEnrollments
      .filter(e => e.course_id === parseInt(id))
      .map(e => {
        const user = mockUsers.find(u => u.id === e.student_id);
        return {
          ...user,
          enrolled_at: e.enrolled_at
        };
      });
    
    const outcomes = []; // Could add mock outcomes
    
    return {
      data: {
        ...course,
        students,
        learning_outcomes: outcomes
      }
    };
  },

  async createCourse(courseData) {
    await delay(600);
    const newCourse = {
      id: mockCourses.length + 1,
      ...courseData,
      created_at: new Date().toISOString()
    };
    mockCourses.push(newCourse);
    return { data: newCourse };
  },

  // Assessments
  async getAssessments(params = {}) {
    await delay(500);
    let assessments = [...mockAssessments];
    
    if (params.course_id) {
      assessments = assessments.filter(a => a.course_id === parseInt(params.course_id));
    }
    if (params.student_id) {
      const studentCourses = getStudentCourses(parseInt(params.student_id));
      const courseIds = studentCourses.map(c => c.id);
      assessments = assessments.filter(a => courseIds.includes(a.course_id));
    }
    
    return { data: assessments };
  },

  async getAssessment(id) {
    await delay(300);
    const assessment = mockAssessments.find(a => a.id === parseInt(id));
    if (!assessment) {
      throw { response: { status: 404, data: { error: 'Assessment not found' } } };
    }
    return { data: assessment };
  },

  async createAssessment(assessmentData) {
    await delay(600);
    const newAssessment = {
      id: mockAssessments.length + 1,
      ...assessmentData,
      created_at: new Date().toISOString()
    };
    mockAssessments.push(newAssessment);
    return { data: newAssessment };
  },

  // Students
  async getStudent(id) {
    await delay(500);
    const studentData = getStudentData(parseInt(id));
    if (!studentData.id) {
      throw { response: { status: 404, data: { error: 'Student not found' } } };
    }
    return { data: studentData };
  },

  async getStudentCourseProgress(studentId, courseId) {
    await delay(400);
    const studentData = getStudentData(parseInt(studentId));
    const course = studentData.courses.find(c => c.id === parseInt(courseId));
    if (!course) {
      throw { response: { status: 404, data: { error: 'Course not found' } } };
    }
    
    const assessments = mockAssessments
      .filter(a => a.course_id === parseInt(courseId))
      .map(assessment => {
        const grade = mockStudentAssessments.find(
          sa => sa.student_id === parseInt(studentId) && sa.assessment_id === assessment.id
        );
        return {
          ...assessment,
          score: grade?.score || null,
          max_score: assessment.max_score,
          percentage: grade?.percentage || null,
          feedback: grade?.feedback || null,
          graded_at: grade?.graded_at || null
        };
      });

    return {
      data: {
        course,
        assessments,
        learning_outcomes: []
      }
    };
  },

  // Grades
  async getAssessmentGrades(assessmentId) {
    await delay(400);
    const grades = mockStudentAssessments
      .filter(sa => sa.assessment_id === parseInt(assessmentId))
      .map(grade => {
        const user = mockUsers.find(u => u.id === grade.student_id);
        return {
          ...grade,
          student_first_name: user?.first_name,
          student_last_name: user?.last_name,
          student_email: user?.email
        };
      });
    return { data: grades };
  },

  async gradeAssessment(assessmentId, gradeData) {
    await delay(600);
    const existing = mockStudentAssessments.find(
      sa => sa.assessment_id === parseInt(assessmentId) && sa.student_id === gradeData.student_id
    );
    
    const assessment = mockAssessments.find(a => a.id === parseInt(assessmentId));
    const percentage = (gradeData.score / assessment.max_score) * 100;
    
    if (existing) {
      Object.assign(existing, {
        score: gradeData.score,
        max_score: assessment.max_score,
        percentage,
        feedback: gradeData.feedback,
        graded_at: new Date().toISOString(),
        graded_by: gradeData.graded_by
      });
    } else {
      mockStudentAssessments.push({
        id: mockStudentAssessments.length + 1,
        student_id: gradeData.student_id,
        assessment_id: parseInt(assessmentId),
        score: gradeData.score,
        max_score: assessment.max_score,
        percentage,
        feedback: gradeData.feedback,
        graded_at: new Date().toISOString(),
        graded_by: gradeData.graded_by
      });
    }
    
    const user = mockUsers.find(u => u.id === gradeData.student_id);
    return {
      data: {
        ...existing || mockStudentAssessments[mockStudentAssessments.length - 1],
        student_first_name: user?.first_name,
        student_last_name: user?.last_name,
        student_email: user?.email
      }
    };
  },

  // Reports
  async getCourseReport(courseId) {
    await delay(600);
    const course = mockCourses.find(c => c.id === parseInt(courseId));
    if (!course) {
      throw { response: { status: 404, data: { error: 'Course not found' } } };
    }
    
    const students = mockEnrollments
      .filter(e => e.course_id === parseInt(courseId))
      .map(e => {
        const user = mockUsers.find(u => u.id === e.student_id);
        const assessments = mockAssessments.filter(a => a.course_id === parseInt(courseId));
        const grades = assessments.map(a => {
          const grade = mockStudentAssessments.find(
            sa => sa.student_id === e.student_id && sa.assessment_id === a.id
          );
          return grade ? { ...grade, title: a.title, assessment_type: a.assessment_type, max_score: a.max_score } : null;
        }).filter(g => g !== null);
        
        const totalScore = grades.reduce((sum, g) => sum + (g.score || 0), 0);
        const totalMaxScore = grades.reduce((sum, g) => sum + (g.max_score || 0), 0);
        const avgPercentage = grades.length > 0
          ? grades.reduce((sum, g) => sum + (g.percentage || 0), 0) / grades.length
          : 0;
        
        return {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          grades,
          total_score: totalScore,
          total_max_score: totalMaxScore,
          average_percentage: avgPercentage,
          completed_assessments: grades.length,
          total_assessments: assessments.length
        };
      });
    
    const assessments = mockAssessments.filter(a => a.course_id === parseInt(courseId));
    const allPercentages = students.flatMap(s => s.grades.map(g => g.percentage)).filter(p => p);
    const courseAverage = allPercentages.length > 0
      ? allPercentages.reduce((sum, p) => sum + p, 0) / allPercentages.length
      : 0;
    
    return {
      data: {
        course,
        assessments,
        students,
        statistics: {
          total_students: students.length,
          total_assessments: assessments.length,
          course_average: courseAverage,
          completion_rate: assessments.length > 0
            ? (students.reduce((sum, s) => sum + s.completed_assessments, 0) / (assessments.length * students.length)) * 100
            : 0
        }
      }
    };
  }
};

