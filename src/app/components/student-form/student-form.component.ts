import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../models/student';
import { StudentService } from '../../services/student.service';
import { forkJoin, of } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, TableModule],
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})

export class StudentFormComponent implements OnInit {
  id?: number;
  student: Student = { name: '', email: '', marks: [], courses: [] };
  courses: any[] = []
  isEditMode: boolean = false;

  constructor(
    private studentService: StudentService,
    private route: ActivatedRoute,
    public router: Router,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    this.studentService.getCourses().subscribe({
    next: (data) => {
      this.courses = data;
    },
    error: (err: any) => console.error('Failed to load courses', err),
  });


    if (idParam) {
      this.id = Number(idParam);
      this.isEditMode = true;

      this.studentService.getStudentById(this.id).subscribe({
        next: (data) => {
          if (data) {
            // normalize backend shapes (some use marksList)
            if ((data as any).marksList && !(data as any).marks) {
              (data as any).marks = (data as any).marksList;
            }
            this.student = data;
          } else {
            this.handleInvalidStudent();
          }
        },
        error: () => {
          this.handleInvalidStudent();
        },
      });
    }
  }

  handleInvalidStudent(): void {
    console.error('Student not found');
    this.isEditMode = false;
    this.id = undefined;
    this.student = { name: '', email: '', marks: [], courses: [] };
  }

  save(): void {
    let request;
    // debug: student object saved (logging removed)
    // Debug: log course ids and shapes before sending
    try {
      const courseDebug = (this.student.courses || []).map((c: any) => ({ id: c?.id, course_name: c?.course_name || c?.courseName || c?.name }));
    } catch (e) {
      // suppressed debug logging
    }

    if (this.isEditMode && this.id) {
      request = this.studentService.updateStudent(this.id, this.student);
    } else {
      request = this.studentService.addStudent(this.student);
    }

    request.subscribe({
      next: (saved: any) => {
        // After student saved/updated, sync marks (create marks that don't have id)
        const studentId = saved?.id ?? this.id;
        // student saved, id available in variable studentId
        const markCreates = (this.student.marks || [])
          .filter((m: any) => !m.id)
          .map((m: any) => {
            const payload = { subject: m.subject, marks: Number(m.marks) };
            // creating mark payload
            return this.studentService.addMark(studentId, payload);
          });

        const createAll = markCreates.length ? forkJoin(markCreates) : of([]);
        createAll.subscribe({
          next: (results: any) => {
            // marks created
            // refresh the student so marks appear in UI or when navigating to marks page
            // Ensure courses are attached (some backends require separate attach)
            const ids = (this.student.courses || []).map((c: any) => c && c.id).filter((x: any) => x != null);
            this.studentService.attachCourses(studentId, ids).subscribe({
              next: () => {
                this.studentService.getStudentById(studentId).subscribe({
                  next: refreshed => {
                    // refreshed student after mark create
                    if ((refreshed as any).marksList && !(refreshed as any).marks) {
                      (refreshed as any).marks = (refreshed as any).marksList;
                    }
                    this.student = refreshed;
                    this.router.navigate(['/']);
                  },
                  error: (err: any) => {
                    console.error('Failed to refresh student after creating marks', err);
                    this.router.navigate(['/']);
                  }
                });
              },
              error: (err: any) => {
                console.error('Failed to attach courses after save', err);
                this.studentService.getStudentById(studentId).subscribe({ next: refreshed => { this.student = refreshed; this.router.navigate(['/']); }, error: () => this.router.navigate(['/'])});
              }
            });
          },
          error: (err: any) => {
            console.error('Failed to save marks', err);
            this.router.navigate(['/']);
          }
        });
      },
      error: (err: any) => console.error('Failed to save student', err),
    });
  }


  addMark() {
    this.student.marks.push({  marks: 0 ,subject: ''});
  }

  removeMark(index: number) {
    this.student.marks.splice(index, 1);
  }

  onCourseChange(course: any, event: any) {
    // legacy handler kept for reference but not used by template
    if (event.target.checked) {
      this.student.courses.push(course);
    } else {
      this.student.courses = this.student.courses.filter(
        c => c.id !== course.id
      );
    }
  }

  // Add a new course to backend and refresh course list
  newCourseName = '';
  addCourseToDb() {
    const name = this.newCourseName && this.newCourseName.trim();
    if (!name) return;
    this.studentService.addCourse({ course_name: name }).subscribe({
      next: (created) => {
        // If backend returned the created course, append it; otherwise reload list
        if (created && (created as any).id) {
          const c: any = { ...created };
          c.course_name = c.course_name || c.courseName || c.name;
          this.courses = [...(this.courses || []), c];
        } else {
          this.studentService.getCourses().subscribe({ next: (data) => (this.courses = data) });
        }
        this.newCourseName = '';
      },
      error: (err: any) => console.error('Failed to add course', err)
    });
  }

  isCourseChecked(courseId: number): boolean {
    return !!this.student?.courses?.some(c => c.id === courseId);
  }

  addCourseToStudent(course: any) {
    // addCourseToStudent clicked
    if (!this.isCourseChecked(course.id)) {
      this.student.courses.push(course);
      // student.courses updated
    }
  }

  removeCourseFromStudent(course: any) {
    // removeCourseFromStudent clicked
    this.student.courses = (this.student.courses || []).filter((c: any) => c.id !== course.id);
  }
}

// export class StudentFormComponent implements OnInit {
//   id?: number;
//   student: Student = { name: '', email: '' };
//   isEditMode: boolean = false; // track mode clearly

//   constructor(
//     private studentService: StudentService,
//     private route: ActivatedRoute,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     const idParam = this.route.snapshot.paramMap.get('id');

//     if (idParam) {
//       this.id = Number(idParam);
//       this.isEditMode = true;

//       this.studentService.getStudentById(this.id).subscribe({
//         next: (data) => {
//           if (data) {
//             this.student = data;
//           } else {
//             // if backend returns null
//             this.handleInvalidStudent();
//           }
//         },
//         error: () => {
//           // handle invalid ID properly
//           this.handleInvalidStudent();
//         },
//       });
//     }
//   }

//   //  helper function
//   handleInvalidStudent(): void {
//     console.error('Student not found');

//     this.isEditMode = false;
//     this.id = undefined; 
//     this.student = { name: '', email: '' };

//     alert('Student not found. You can add a new student.');
//   }

//   save(): void {
//     let request;

//     if (this.isEditMode && this.id) {
//       // edit only if valid student exists
//       request = this.studentService.updateStudent(this.id, this.student);
//     } else {
//       // otherwise add new student
//       request = this.studentService.addStudent(this.student);
//     }

//     request.subscribe({
//       next: () => this.router.navigate(['/']),
//       error: (err) => console.error('Failed to save student', err),
//     });
//   }
// }