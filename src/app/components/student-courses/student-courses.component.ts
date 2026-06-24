import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-student-courses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-courses.component.html',
  styleUrls: ['./student-courses.component.css']
})
export class StudentCoursesComponent implements OnInit {
  student: any = { courses: [] };
  loadError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : NaN;
      if (isNaN(id)) {
        console.error('Invalid student id', idParam);
        this.student = { courses: [] };
        return;
      }

      this.studentService.getStudentById(id).subscribe({
        next: data => {
          this.student = data;
          this.loadError = null;
        },
        error: err => {
          console.error('Failed to load student', err);
          this.loadError = err.message || 'Failed to load student';
          this.student = { courses: [] };
        }
      });
    });
  }
}
