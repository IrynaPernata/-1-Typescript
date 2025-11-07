"use strict";
//Створення Enum
Object.defineProperty(exports, "__esModule", { value: true });
var StudentStatus;
(function (StudentStatus) {
    StudentStatus[StudentStatus["Active"] = 0] = "Active";
    StudentStatus[StudentStatus["Academic_Leave"] = 1] = "Academic_Leave";
    StudentStatus[StudentStatus["Graduated"] = 2] = "Graduated";
    StudentStatus[StudentStatus["Expelled"] = 3] = "Expelled";
})(StudentStatus || (StudentStatus = {}));
var CourseType;
(function (CourseType) {
    CourseType[CourseType["Mandatory"] = 0] = "Mandatory";
    CourseType[CourseType["Optional"] = 1] = "Optional";
    CourseType[CourseType["Special"] = 2] = "Special";
})(CourseType || (CourseType = {}));
var Semester;
(function (Semester) {
    Semester[Semester["First"] = 0] = "First";
    Semester[Semester["Second"] = 1] = "Second";
})(Semester || (Semester = {}));
var Grade;
(function (Grade) {
    Grade[Grade["Excellent"] = 5] = "Excellent";
    Grade[Grade["Good"] = 4] = "Good";
    Grade[Grade["Satisfactory"] = 3] = "Satisfactory";
    Grade[Grade["Unsatisfactory"] = 2] = "Unsatisfactory";
})(Grade || (Grade = {}));
var Faculty;
(function (Faculty) {
    Faculty[Faculty["Computer_Science"] = 0] = "Computer_Science";
    Faculty[Faculty["Economics"] = 1] = "Economics";
    Faculty[Faculty["Law"] = 2] = "Law";
    Faculty[Faculty["Engineering"] = 3] = "Engineering";
})(Faculty || (Faculty = {}));
//Реалізація класу
class UniversityManagementSystem {
    students = [];
    courses = [];
    grades = [];
    studentEnrollments = new Map();
    courseEnrollments = new Map();
    studentIdCounter = 1;
    courseIdCounter = 1;
    // метод для пошуку студента
    findStudent(studentId) {
        return this.students.find(s => s.id === studentId);
    }
    //Допоміжний метод для пошуку курсу
    findCourse(courseId) {
        return this.courses.find(c => c.id === courseId);
    }
    //Зарахування нового студента до університету
    enrollStudent(studentData) {
        const newStudent = {
            ...studentData,
            id: this.studentIdCounter++,
        };
        this.students.push(newStudent);
        this.studentEnrollments.set(newStudent.id, new Set());
        console.log(`Студента ${newStudent.fullName} зараховано з ID ${newStudent.id}`);
        return newStudent;
    }
    //Додавання нового курсу до системи
    addCourse(courseData) {
        const newCourse = {
            ...courseData,
            id: this.courseIdCounter++,
        };
        this.courses.push(newCourse);
        this.courseEnrollments.set(newCourse.id, new Set());
        console.log(`Додано курс ${newCourse.name} (ID: ${newCourse.id})`);
        return newCourse;
    }
    //Реєстрація студента на курс
    registerForCourse(studentId, courseId) {
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
        const courseRegistry = this.courseEnrollments.get(courseId);
        if (courseRegistry.size >= course.maxStudents) {
            throw new Error(`На курс "${course.name}" досягнуто ліміту студентів (${course.maxStudents}).`);
        }
        const studentRegistry = this.studentEnrollments.get(studentId);
        if (studentRegistry.has(courseId)) {
            throw new Error(`${student.fullName} вже зареєстрований на курс "${course.name}".`);
        }
        //Реєстрація
        studentRegistry.add(courseId);
        courseRegistry.add(studentId);
        console.log(`${student.fullName} успішно зареєстрований на курс "${course.name}".`);
    }
    //Встановлення оцінки студенту за курс
    setGrade(studentId, courseId, grade) {
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
        const gradeRecord = {
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
    updateStudentStatus(studentId, newStatus) {
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
    getStudentsByFaculty(faculty) {
        return this.students.filter(s => s.faculty === faculty);
    }
    //Отримання всіх оцінок студента
    getStudentGrades(studentId) {
        return this.grades.filter(g => g.studentId === studentId);
    }
    //Отримання списку доступних для реєстрації курсів
    getAvailableCourses(faculty, semester) {
        // Фільтрує за факультетом та семестром
        const relevantCourses = this.courses.filter(c => c.faculty === faculty && c.semester === semester);
        // Фільтрує ті, де є вільні місця
        const availableCourses = relevantCourses.filter(c => {
            const registry = this.courseEnrollments.get(c.id);
            return registry ? registry.size < c.maxStudents : false;
        });
        return availableCourses;
    }
    //Розрахунок середнього балу студента
    calculateAverageGrade(studentId) {
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
    getHonorsStudentsByFaculty(faculty) {
        const facultyStudents = this.getStudentsByFaculty(faculty);
        const honorsStudents = [];
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
    getTrueHonorsStudents(faculty) {
        const facultyStudents = this.getStudentsByFaculty(faculty);
        return facultyStudents.filter(student => {
            const grades = this.getStudentGrades(student.id);
            if (grades.length === 0)
                return false;
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
}
catch (e) {
    console.error(e.message);
}
try {
    console.log(`\nТестуємо ліміт курсу ${tsCourse.name}`);
    ums.registerForCourse(studentC.id, tsCourse.id);
}
catch (e) {
    console.error(e.message);
}
try {
    console.log('\nТестує невідповідність факультетів');
    ums.registerForCourse(studentLaw.id, tsCourse.id);
}
catch (e) {
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
}
catch (e) {
    console.error(e.message);
}
try {
    console.log('\nТестує виставлення оцінки без реєстрації');
    ums.setGrade(studentC.id, tsCourse.id, Grade.Good);
}
catch (e) {
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
//# sourceMappingURL=university.js.map