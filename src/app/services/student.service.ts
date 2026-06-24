import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from '../models/student';
import { Course } from '../models/course';
import { Mark } from '../models/marks';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = '/students';

  constructor(private http: HttpClient) { }

  // Get all students
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // Get one student
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  // Create student — expects `Student` shaped payload (courses: Course[])
  addStudent(student: Student): Observable<Student> {
    const payload = this.withNormalizedCourses(student);
    return this.http.post<Student>(this.apiUrl, payload);
  }

  // Update student
  updateStudent(id: number, student: Student): Observable<Student> {
    const payload = this.withNormalizedCourses(student);
    return this.http.put<Student>(`${this.apiUrl}/${id}`, payload);
  }

  // Delete student
  deleteStudent(id: number): Observable<any> {
    // Some backends return text or an empty body on delete; request as text to avoid JSON parse errors
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' as const }).pipe(
      catchError(err => of(null))
    );
  }

  // Courses
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/courses');
  }

  // Allow creating a course without an `id` (backend will assign one)
  addCourse(course: Partial<Course>): Observable<Course> {
    const payload: any = { ...course };
    const nameValue = payload.courseName || payload.course_name || payload.name;
    if (nameValue) {
      payload.course_name = nameValue;
      payload.courseName = nameValue;
      payload.name = nameValue;
    }
    return this.http.post<Course>('/courses', payload as any);
  }

  // Marks
  getMarksByStudentId(id: number): Observable<Mark[]> {
    return this.http.get<Mark[]>(`/marks?student.id=${id}`);
  }

  addMark(studentId: number, mark: Mark): Observable<Mark> {
    return this.http.post<Mark>(`/marks/student/${studentId}`, mark);
  }

  // Attach courses to an existing student. Some backends require a separate endpoint per course.
  attachCourses(studentId: number, ids: number[]): Observable<any> {
    if (!ids || !ids.length) return of(null);
    const calls = ids.map(courseId =>
      this.http.post(`/courses/${courseId}/students`, [studentId]).pipe(
        catchError(() => of(null))
      )
    );
    return forkJoin(calls).pipe(
      catchError(() => of(null))
    );
  }

  // Ensure courses array contains only the keys backend expects (id and course_name)
  private withNormalizedCourses(student: Student): any {
    const courses = (student.courses || []).map(c => ({ id: c.id, course_name: c.course_name }));
    return { ...student, courses };
  }
}

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import {Student} from '../models/student';
// import { Observable } from 'rxjs';
// import {Mark} from '../models/marks';

// @Injectable({
//   providedIn: 'root'
// })
// export class StudentService {
// // Use relative paths so the Angular dev server proxy (proxy.conf.json) can forward requests
//   private apiUrl = '/students';

//   constructor(private http:HttpClient) { }


//  // FOR CREATE
//   addStudent(student: Student): Observable<Student> {
//     const payload = this.normalizeStudentPayload(student);
//     return this.http.post<Student>(this.apiUrl, payload);
//   }

//   // READ ALL
//   getStudents(): Observable<Student[]> {
//     return this.http.get<Student[]>(this.apiUrl);
//   }

//   // READ ONE
//   getStudentById(id: number): Observable<Student> {
//     return this.http.get<Student>(`${this.apiUrl}/${id}`);
//   }

//   // READ marks for a student
//   getMarksByStudentId(id: number): Observable<Mark[]> {
//     // relative path so proxy forwards to backend
//     return this.http.get<Mark[]>(`/marks?student.id=${id}`);
//   }

//   // UPDATE
//   updateStudent(id: number, student: Student): Observable<Student> {
//     const payload = this.normalizeStudentPayload(student);
//     return this.http.put<Student>(`${this.apiUrl}/${id}`, payload);
//   }

//   // Ensure we send course objects and ids in common shapes so different backends accept them
//   private normalizeStudentPayload(student: Student): any {
//     const payload: any = { ...student };
//     const rawCourses = (student as any).courses || [];
//     const courses = rawCourses.map((c: any) => {
//       if (!c) return c;
//       if (typeof c === 'number') return { id: c };
//       const id = c.id ?? c.courseId ?? c.course_id ?? null;
//       const name = c.course_name || c.courseName || c.name || undefined;
//       const out: any = {};
//       if (id != null) out.id = id;
//       if (name) out.course_name = name;
//       return out;
//     });
//     payload.courses = courses;
//     // also include arrays of ids under common keys
//     const ids = courses.map((c: any) => c && c.id).filter((x: any) => x != null);
//     payload.course_ids = ids;
//     payload.courseIds = ids;
//     return payload;
//   }

//   // DELETE
//   deleteStudent(id: number): Observable<string> {
//     return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' as const });
//   }
//   getCourses(): Observable<any[]> {
//     return this.http.get<any[]>('/courses');
//   }

//   // Create a new course
//   addCourse(course: { courseName?: string; course_name?: string; name?: string } ): Observable<any> {
//     // normalize payload to multiple common keys so different backends accept it
//     const payload: any = { ...course };
//     const nameValue = payload.courseName || payload.course_name || payload.name;
//     if (nameValue) {
//       payload.courseName = nameValue;
//       payload.course_name = nameValue;
//       payload.name = nameValue;
//     }
//     return this.http.post('/courses', payload);
//   }

//   // Create a mark record
//   // Create a mark record for a specific student using backend API: POST /marks/student/{studentId}
//   // addMark(studentId: number, mark: { subject: string; marks: number }): Observable<any> {
//   //   const payload: any = { subject: mark.subject, marks: mark.marks };
//   //   return this.http.post(`/marks/student/${studentId}`, payload);
//   // }

//   addMark(studentId: number, mark: Mark): Observable<Mark> {
//     return this.http.post<Mark>(`/marks/student/${studentId}`, mark);
// }

// }