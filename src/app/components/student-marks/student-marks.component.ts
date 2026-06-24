import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { OnInit } from '@angular/core';
import { Student } from '../../models/student';
import { Mark } from 'src/app/models/marks';

@Component({
  selector: 'app-student-marks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-marks.component.html',
  styleUrls: ['./student-marks.component.css'],
})
export class StudentMarksComponent implements OnInit {
  student: Student = { name: '', email: '', marks: [], courses: [] };
  loadError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : NaN;
      console.log('StudentMarks: route id=', idParam, id);
      if (isNaN(id)) {
        console.error('Invalid student id', idParam);
        this.student = { name: '', email: '', marks: [], courses: [] };
        return;
      }
      this.studentService.getStudentById(id).subscribe({
        next: (data: any) => {
          console.log('StudentMarks: student response', data);
          // normalize student marks field (some backends use `marksList`)
          if (data && !data.marks && data.marksList) {
            data.marks = data.marksList;
          }
          this.student = { ...this.student, ...(data || {}) } as Student;
          // If marks are not embedded in the student resource, fetch them separately
          if (
            !this.student?.marks ||
            (Array.isArray(this.student.marks) &&
              this.student.marks.length === 0)
          ) {
            this.studentService.getMarksByStudentId(id).subscribe({
              next: (marks: any[]) => {
                console.log('StudentMarks: marks response for id', id, marks);
                if (!Array.isArray(marks)) {
                  this.student.marks = [];
                  return;
                }
                // If backend returned marks with nested student objects, filter to requested id
                const nestedMatches = marks.filter(
                  (m: any) =>
                    m && m.student && Number(m.student.id) === Number(id),
                );
                if (nestedMatches.length > 0 && nestedMatches[0].student) {
                  const embeddedStudent = {
                    ...nestedMatches[0].student,
                  } as Student;
                  embeddedStudent.marks = nestedMatches.map((m: any) => ({
                    subject: m.subject,
                    marks: Number(m.marks),
                  })) as Mark[];
                  this.student = embeddedStudent;
                } else {
                  // fallback: try to filter by plain student id field on mark (studentId)
                  const byStudentIdField = marks.filter(
                    (m: any) =>
                      m && (m.studentId === id || m.studentId === String(id)),
                  );
                  if (byStudentIdField.length > 0) {
                    this.student.marks = byStudentIdField.map((m: any) => ({
                      subject: m.subject,
                      marks: Number(m.marks),
                    })) as Mark[];
                  } else {
                    // lastly, if backend returns all marks without relation, keep empty
                    this.student.marks = [];
                  }
                }
              },
              error: (err: any) => {
                console.error('Failed to load marks separately', err);
              },
            });
          }
          this.loadError = null;
        },
        error: (err: any) => {
          console.error('Failed to load student', err);
          this.loadError = err.message || 'Failed to load student';
          this.student = { name: '', email: '', marks: [], courses: [] };
        },
      });
    });
  }
}
