
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

type TimeSlot = "8:00-9:35" | "9:45-10:20" | "11:45-13:20" | "13:30-15:05" | "15:15-16:50";


type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";



type Professor = {
  id: number;
  name: string;
  department: string;
};


type Classroom = {
  number: string; 
  capacity: number;
  hasProjector: boolean;
};


type Course = {
  id: number;
  name: string;
  type: CourseType;
};


type Lesson = {
  id: number; 
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};


/**
 * Type alias для опису конфлікту в розкладі
 */
type ScheduleConflict = {
  type: "ProfessorConflict" | "ClassroomConflict";
  lessonDetails: Lesson; // Заняття, з яким виник конфлікт
};



/**
 * Бази даних
 */
const professors: Professor[] = [
  { id: 1, name: "Dr. Anna Kovalenko", department: "Computer Science" },
  { id: 2, name: "Dr. Ivan Petrenko", department: "Physics" },
];


const classrooms: Classroom[] = [
  { number: "101", capacity: 50, hasProjector: true },
  { number: "102", capacity: 30, hasProjector: false },
  { number: "201", capacity: 40, hasProjector: true },
];


const courses: Course[] = [
  { id: 10, name: "Introduction to TypeScript", type: "Lecture" },
  { id: 11, name: "TypeScript Labs", type: "Lab" },
  { id: 20, name: "Quantum Mechanics", type: "Seminar" },
];


const schedule: Lesson[] = [
  {
    id: 100,
    courseId: 10,
    professorId: 1,
    classroomNumber: "101",
    dayOfWeek: "Monday",
    timeSlot: "8:00-9:35",
  },
  {
    id: 101,
    courseId: 20,
    professorId: 2,
    classroomNumber: "102",
    dayOfWeek: "Monday",
    timeSlot: "11:45-13:20",
  },
];


/**
 * Перевіряє, чи не створює нове заняття конфліктів у розкладі.
 */
function validateLesson(lesson: Lesson): ScheduleConflict | null {
  const classroomConflict = schedule.find(
    (l) =>
      l.dayOfWeek === lesson.dayOfWeek &&
      l.timeSlot === lesson.timeSlot &&
      l.classroomNumber === lesson.classroomNumber
  );

  if (classroomConflict) {
    return { type: "ClassroomConflict", lessonDetails: classroomConflict };
  }

  //  Перевірка на конфлікт професора
  const professorConflict = schedule.find(
    (l) =>
      l.dayOfWeek === lesson.dayOfWeek &&
      l.timeSlot === lesson.timeSlot &&
      l.professorId === lesson.professorId
  );

  if (professorConflict) {
    return { type: "ProfessorConflict", lessonDetails: professorConflict };
  }


  return null;
}



/**
 * Додає нового професора
 */
function addProfessor(professor: Professor): void {

  if (professors.find((p) => p.id === professor.id)) {
    console.warn(`Professor with ID ${professor.id} already exists.`);
    return;
  }
  professors.push(professor);
  console.log(`Professor ${professor.name} added.`);
}

/**
 * Додає нове заняття до розкладу, якщо немає конфліктів.
 * returns true, якщо заняття додано, false - якщо виник конфлікт.
 */
function addLesson(lesson: Lesson): boolean {
  if (schedule.find((l) => l.id === lesson.id)) {
    console.error(`Failed to add lesson. Lesson ID ${lesson.id} already exists.`);
    return false;
  }

  const conflict = validateLesson(lesson);

  if (conflict) {
    console.error(
      `Failed to add lesson ${lesson.id}. ${conflict.type} with existing lesson ${conflict.lessonDetails.id}.`
    );
    return false;
  }

  schedule.push(lesson);
  console.log(`Lesson ${lesson.id} added successfully.`);
  return true;
}

/**
 * Знаходить вільні аудиторії у вказаний час.
 */
function findAvailableClassrooms(
  timeSlot: TimeSlot,
  dayOfWeek: DayOfWeek
): string[] {

  const allClassroomNumbers = classrooms.map((c) => c.number);

  const occupiedClassroomNumbers = schedule
    .filter((l) => l.dayOfWeek === dayOfWeek && l.timeSlot === timeSlot)
    .map((l) => l.classroomNumber);

  return allClassroomNumbers.filter(
    (number) => !occupiedClassroomNumbers.includes(number)
  );
}

/**
 * Повертає повний розклад для конкретного професора.
 */
function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule.filter((l) => l.professorId === professorId);
}


/**
 * Розраховує відсоток використання аудиторії за тиждень.
 */
function getClassroomUtilization(classroomNumber: string): number {
  if (!classrooms.find((c) => c.number === classroomNumber)) {
    console.warn(`Classroom ${classroomNumber} not found.`);
    return 0;
  }

  // Допоміжні масиви для розрахунку загальної кількості слотів
  const allTimeSlots: TimeSlot[] = ["8:00-9:35", "9:45-10:20","11:45-13:20","13:30-15:05","15:15-16:50"];
  const allWeekDays: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const totalSlotsPerWeek = allTimeSlots.length * allWeekDays.length; 

  if (totalSlotsPerWeek === 0) return 0;

  // Кількість занять, що проводяться в цій аудиторії
  const lessonsInClassroom = schedule.filter(
    (l) => l.classroomNumber === classroomNumber
  ).length;

  return (lessonsInClassroom / totalSlotsPerWeek) * 100;
}

/**
 * Визначає найпопулярніший тип занять на основі розкладу.
 */
function getMostPopularCourseType(): CourseType | null {
  if (schedule.length === 0) return null;

  const typeCounts = {
    Lecture: 0,
    Seminar: 0,
    Lab: 0,
    Practice: 0,
  };

  for (const lesson of schedule) {
    const course = courses.find((c) => c.id === lesson.courseId);
    if (course) {
      typeCounts[course.type]++;
    }
  }

  // Знаходимо найпопулярніший
  let mostPopular: CourseType = "Lecture";
  let maxCount = 0;

  const types: CourseType[] = ["Lecture", "Seminar", "Lab", "Practice"];
  for (const type of types) {
    if (typeCounts[type] > maxCount) {
      maxCount = typeCounts[type];
      mostPopular = type;
    }
  }

  return mostPopular;
}


/**
 * Змінює аудиторію для існуючого заняття, якщо нова аудиторія вільна.
 */
function reassignClassroom(
  lessonId: number,
  newClassroomNumber: string
): boolean {
  const lessonIndex = schedule.findIndex((l) => l.id === lessonId);
  const originalLesson = schedule[lessonIndex];
  if (!originalLesson) { 
    console.warn(`Lesson ID ${lessonId} not found.`);
    return false;
  }

  // Перевіряємо, чи існує нова аудиторія
  if (!classrooms.find((c) => c.number === newClassroomNumber)) {
    console.warn(`New classroom ${newClassroomNumber} does not exist.`);
    return false;
  }
 

  // Перевіряємо чи вільна нова аудиторія в той самий час
  const conflict = schedule.find(
    (l) =>
      l.dayOfWeek === originalLesson.dayOfWeek &&
      l.timeSlot === originalLesson.timeSlot &&
      l.classroomNumber === newClassroomNumber
  );

  if (conflict) {
    console.warn(
      `Cannot reassign. New classroom ${newClassroomNumber} is occupied by lesson ${conflict.id}.`
    );
    return false;
  }

  // Оновлюємо аудиторію
originalLesson.classroomNumber = newClassroomNumber;
  console.log(`Lesson ${lessonId} reassigned to classroom ${newClassroomNumber}.`);
  return true;
}

/**
 * Видаляє заняття з розкладу за його ID.
 */
function cancelLesson(lessonId: number): void {
  const lessonIndex = schedule.findIndex((l) => l.id === lessonId);

  if (lessonIndex > -1) {
    schedule.splice(lessonIndex, 1);
    console.log(`Lesson ${lessonId} cancelled.`);
  } else {
    console.warn(`Lesson ${lessonId} not found, cannot cancel.`);
  }
}



console.log("Schedule:", schedule);
console.log("Classroom 101 Utilization:", getClassroomUtilization("101").toFixed(2) + "%");

console.log("\nAdding New Lesson");
const newLessonSuccess: Lesson = {
  id: 102,
  courseId: 11,
  professorId: 1,
  classroomNumber: "101",
  dayOfWeek: "Tuesday",
  timeSlot: "8:00-9:35",
};
addLesson(newLessonSuccess);

console.log("\nAdding New Lesson");
const newLessonConflict: Lesson = {
  id: 103,
  courseId: 11, 
  professorId: 2, 
  classroomNumber: "201",
  dayOfWeek: "Monday",
  timeSlot: "8:00-9:35",
};
addLesson(newLessonConflict);

console.log("\nFinding Available Classrooms");
console.log(
  "Available classrooms on Monday at 8:00-9:35:",
  findAvailableClassrooms("8:00-9:35", "Monday")
); 

console.log("\nGetting Professor Schedule");
console.log("Schedule for Dr. Petrenko:", getProfessorSchedule(2));

console.log("\nReassigning Classroom");
reassignClassroom(100, "201");
reassignClassroom(101, "201");

console.log("\nCancelling Lesson");
cancelLesson(101);


console.log("Schedule:", schedule);
console.log("Most Popular Course Type:", getMostPopularCourseType());
console.log("Classroom 101 Utilization:", getClassroomUtilization("101").toFixed(2) + "%");