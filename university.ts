//Створення Enum

enum StudentStatus {
  Active,
  Academic_Leave, 
  Graduated,      
  Expelled,       
}


enum CourseType {
  Mandatory, 
  Optional,  
  Special,  
}

enum Semester {
  First,
  Second,
}


enum Grade {
  Excellent = 5,
  Good = 4,
  Satisfactory = 3,
  Unsatisfactory = 2,
}


enum Faculty {
  Computer_Science,
  Economics,
  Law,
  Engineering,
}

//Створення інтерфейсів

interface Student {
  id: number;
  fullName: string;
  faculty: Faculty;
  year: number; 
  status: StudentStatus;
  enrollmentDate: Date; 
  groupNumber: string;
}


interface Course {
  id: number;
  name: string;
  type: CourseType;
  credits: number; 
  semester: Semester;
  faculty: Faculty; 
  maxStudents: number; 
}


interface GradeRecord {
  studentId: number;
  courseId: number;
  grade: Grade; 
  date: Date;
  semester: Semester;
}

//Реалізація класу

class UniversityManagementSystem {
  private students: Student[] = [];
  private courses: Course[] = [];
  private grades: GradeRecord[] = [];

  private studentEnrollments: Map<number, Set<number>> = new Map();
  private courseEnrollments: Map<number, Set<number>> = new Map();

  private studentIdCounter: number = 1;
  private courseIdCounter: number = 1;

  // метод для пошуку студента
   
  private findStudent(studentId: number): Student | undefined {
    return this.students.find(s => s.id === studentId);
  }

  //Допоміжний метод для пошуку курсу

  private findCourse(courseId: number): Course | undefined {
    return this.courses.find(c => c.id === courseId);
  }

  //Зарахування нового студента до університету
  
  public enrollStudent(studentData: Omit<Student, 'id'>): Student {
    const newStudent: Student = {
      ...studentData,
      id: this.studentIdCounter++,
    };

    this.students.push(newStudent);
    this.studentEnrollments.set(newStudent.id, new Set());
    console.log(`Студента ${newStudent.fullName} зараховано з ID ${newStudent.id}`);
    return newStudent;
  }

  //Додавання нового курсу до системи
  public addCourse(courseData: Omit<Course, 'id'>): Course {
    const newCourse: Course = {
      ...courseData,
      id: this.courseIdCounter++,
    };

    this.courses.push(newCourse);
    this.courseEnrollments.set(newCourse.id, new Set());
    console.log(`Додано курс ${newCourse.name} (ID: ${newCourse.id})`);
    return newCourse;
  }

  //Реєстрація студента на курс

  
  public registerForCourse(studentId: number, courseId: number): void {
    const student = this.findStudent(studentId);
    const course = this.findCourse(courseId);

    if (!student) {
      throw new Error(`Студента з ID ${studentId} не знайдено.`);
    }
    if (!course) {
      throw new Error(`Курс з ID ${courseId} не знайдено.`);
    }
    if (student.status !== StudentStatus.Active) {
      throw new Error(`${student.fullName} не є активним студентом.`);
    }
    if (student.faculty !== course.faculty) {
      throw new Error(`Студент факультету ${Faculty[student.faculty]} не може зареєструватися на курс факультету ${Faculty[course.faculty]}.`);
    }

    const courseRegistry = this.courseEnrollments.get(courseId)!;
    if (courseRegistry.size >= course.maxStudents) {
      throw new Error(`На курс "${course.name}" досягнуто ліміту студентів (${course.maxStudents}).`);
    }

    const studentRegistry = this.studentEnrollments.get(studentId)!;
    if (studentRegistry.has(courseId)) {
      throw new Error(`${student.fullName} вже зареєстрований на курс "${course.name}".`);
    }

    //Реєстрація
    studentRegistry.add(courseId);
    courseRegistry.add(studentId);

    console.log(`${student.fullName} успішно зареєстрований на курс "${course.name}".`);
  }

  //Встановлення оцінки студенту за курс

  public setGrade(studentId: number, courseId: number, grade: Grade): void {
    const student = this.findStudent(studentId);
    const course = this.findCourse(courseId);

    if (!student || !course) {
      throw new Error('Студента або курс не знайдено.');
    }

    // Перевірка, чи студент зареєстрований на цей курс
    const isEnrolled = this.studentEnrollments.get(studentId)?.has(courseId);
    if (!isEnrolled) {
      throw new Error(`${student.fullName} не зареєстрований на курс "${course.name}", неможливо виставити оцінку.`);
    }

    // Створює новий запис про оцінку
    const gradeRecord: GradeRecord = {
      studentId: studentId,
      courseId: courseId,
      grade: grade, 
      date: new Date(),
      semester: course.semester,
    };

    this.grades.push(gradeRecord);
    console.log(`${student.fullName} отримав оцінку "${Grade[grade]}" (${grade}) за курс "${course.name}".`);
  }

  //Оновлення статусу студента
  
 
  public updateStudentStatus(studentId: number, newStatus: StudentStatus): void {
    const student = this.findStudent(studentId);
    if (!student) {
      throw new Error(` Студента з ID ${studentId} не знайдено.`);
    }

    // Не можна змінити статус випускника або відрахованого
    if (student.status === StudentStatus.Graduated || student.status === StudentStatus.Expelled) {
      console.warn(`Статус студента ${student.fullName} (${StudentStatus[student.status]}) не може бути змінений.`);
      return;
    }

    if (student.status === newStatus) {
      console.warn(`${student.fullName} вже має статус ${StudentStatus[newStatus]}.`);
      return;
    }

    student.status = newStatus;
    console.log(`Статус ${student.fullName} оновлено на ${StudentStatus[newStatus]}.`);
  }

  //Отримання списку студентів за факультетом

  public getStudentsByFaculty(faculty: Faculty): Student[] {
    return this.students.filter(s => s.faculty === faculty);
  }

  //Отримання всіх оцінок студента
  
  public getStudentGrades(studentId: number): GradeRecord[] {
    return this.grades.filter(g => g.studentId === studentId);
  }

  //Отримання списку доступних для реєстрації курсів
  
  public getAvailableCourses(faculty: Faculty, semester: Semester): Course[] {
    // Фільтрує за факультетом та семестром
    const relevantCourses = this.courses.filter(
      c => c.faculty === faculty && c.semester === semester
    );

    // Фільтрує ті, де є вільні місця
    const availableCourses = relevantCourses.filter(c => {
      const registry = this.courseEnrollments.get(c.id);
      return registry ? registry.size < c.maxStudents : false;
    });

    return availableCourses;
  }

  //Розрахунок середнього балу студента
  
  public calculateAverageGrade(studentId: number): number {
    const studentGrades = this.getStudentGrades(studentId);

    if (studentGrades.length === 0) {
      return 0;
    }

    // Сумує всі оцінки
    const total = studentGrades.reduce((sum, record) => sum + record.grade, 0);
    const average = total / studentGrades.length;

    return parseFloat(average.toFixed(2));
  }

  /**
   * Отримання списку відмінників по факультету
   * Відмінник - той, у кого середній бал >= 4.5
   */
  public getHonorsStudentsByFaculty(faculty: Faculty): Student[] {
    const facultyStudents = this.getStudentsByFaculty(faculty);
    const honorsStudents: Student[] = [];

    const HONORS_THRESHOLD = 4.5; 

    for (const student of facultyStudents) {
      const avgGrade = this.calculateAverageGrade(student.id);
      if (avgGrade >= HONORS_THRESHOLD) {
        honorsStudents.push(student);
      }
    }
    return honorsStudents;
  }

  /**
   * Отримання списку справжніх відмінників
   * Ті, у кого немає оцінок нижче 4
   */
  public getTrueHonorsStudents(faculty: Faculty): Student[] {
    const facultyStudents = this.getStudentsByFaculty(faculty);

    return facultyStudents.filter(student => {
      const grades = this.getStudentGrades(student.id);
      if (grades.length === 0) return false;

      return grades.every(g => g.grade >= Grade.Good);
    });
  }
}

const ums = new UniversityManagementSystem();

console.log('\nДодавання курсів');
const tsCourse = ums.addCourse({
  name: "TypeScript",
  type: CourseType.Special,
  credits: 5,
  semester: Semester.First,
  faculty: Faculty.Computer_Science,
  maxStudents: 2,
});

const algorithmsCourse = ums.addCourse({
  name: "Data Structures and Algorithms",
  type: CourseType.Mandatory,
  credits: 10,
  semester: Semester.First,
  faculty: Faculty.Computer_Science,
  maxStudents: 50,
});

const lawCourse = ums.addCourse({
  name: "Law",
  type: CourseType.Mandatory,
  credits: 10,
  semester: Semester.First,
  faculty: Faculty.Law,
  maxStudents: 50,
});

console.log('\nЗарахування студентів');
const studentA = ums.enrollStudent({
  fullName: "Іван Петренко",
  faculty: Faculty.Computer_Science,
  year: 2,
  status: StudentStatus.Active,
  enrollmentDate: new Date("2024-09-01"),
  groupNumber: "CS-201",
});

const studentB = ums.enrollStudent({
  fullName: "Марія Іваненко",
  faculty: Faculty.Computer_Science,
  year: 2,
  status: StudentStatus.Active,
  enrollmentDate: new Date("2024-09-01"),
  groupNumber: "CS-201",
});

const studentC = ums.enrollStudent({
  fullName: "Олег Сидоренко",
  faculty: Faculty.Computer_Science,
  year: 3,
  status: StudentStatus.Active,
  enrollmentDate: new Date("2023-09-01"),
  groupNumber: "CS-301",
});

const studentLaw = ums.enrollStudent({
  fullName: "Анна Гончар",
  faculty: Faculty.Law,
  year: 1,
  status: StudentStatus.Active,
  enrollmentDate: new Date("2025-09-01"),
  groupNumber: "LAW-101",
});

console.log('\nРеєстрація на курси');
try {
  ums.registerForCourse(studentA.id, tsCourse.id);
  ums.registerForCourse(studentB.id, tsCourse.id); 
  ums.registerForCourse(studentA.id, algorithmsCourse.id);
} catch (e: any) {
  console.error(e.message);
}


try {
  console.log(`\nТестуємо ліміт курсу ${tsCourse.name}`);
  ums.registerForCourse(studentC.id, tsCourse.id); 
} catch (e: any) {
  console.error(e.message);
}


try {
  console.log('\nТестує невідповідність факультетів');
  ums.registerForCourse(studentLaw.id, tsCourse.id); 
} catch (e: any) {
  console.error(e.message);
}

console.log('\nОтримання доступних курсів');
const availableCSCourses = ums.getAvailableCourses(Faculty.Computer_Science, Semester.First);
console.log(`Доступні курси для CS (1 семестр):`, availableCSCourses.map(c => c.name));

console.log('\nВстановлення оцінок');
try {
  ums.setGrade(studentA.id, tsCourse.id, Grade.Excellent); 
  ums.setGrade(studentA.id, algorithmsCourse.id, Grade.Good); 
  ums.setGrade(studentB.id, tsCourse.id, Grade.Excellent); 
} catch (e: any) {
  console.error(e.message);
}

try {
  console.log('\nТестує виставлення оцінки без реєстрації');
  ums.setGrade(studentC.id, tsCourse.id, Grade.Good); 
} catch (e: any) {
  console.error(e.message);
}

console.log('\nРозрахунок середнього балу');
const avgA = ums.calculateAverageGrade(studentA.id);
console.log(`Середній бал ${studentA.fullName}: ${avgA}`); 

const avgB = ums.calculateAverageGrade(studentB.id);
console.log(`Середній бал ${studentB.fullName}: ${avgB}`);

const avgC = ums.calculateAverageGrade(studentC.id);
console.log(`Середній бал ${studentC.fullName}: ${avgC}`);

console.log('\n Отримання списку відмінників');
const honorsCS = ums.getHonorsStudentsByFaculty(Faculty.Computer_Science);
console.log(`Відмінники на ${Faculty[Faculty.Computer_Science]}:`, honorsCS.map(s => s.fullName)); 

console.log('\nОновлення статусу');
ums.updateStudentStatus(studentC.id, StudentStatus.Academic_Leave);
console.log(ums.getStudentsByFaculty(Faculty.Computer_Science).find(s => s.id === studentC.id)?.status === StudentStatus.Academic_Leave); 