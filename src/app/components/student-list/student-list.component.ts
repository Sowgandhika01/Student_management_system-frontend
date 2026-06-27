import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  private routerSub?: Subscription;

  constructor(private studentService: StudentService, private router: Router) {}
//ngOnInit() is used to initialize your component by running code when the page loads.
//run this code when component loads   It runs once component is initialized--Load data from backend
  ngOnInit(): void {
    this.loadStudents();
    this.routerSub = this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.loadStudents();
    });
  }

  loadStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (data) => (this.students = data),
      error: (err) => console.error('Failed to load students', err),
    });
  }

  editStudent(id?: number): void {
    if (id == null) return;
    this.router.navigate(['/edit', id]);
  }

  deleteStudent(id?: number): void {
    if (id == null) return;
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.students = this.students.filter((student) => student.id !== id);
      },
      error: (err) => console.error('Failed to delete student', err),
    });
  }
    
    viewMarks(id?: number): void {
      if (id == null) return;
      this.router.navigate(['/marks', id]);
    }

    viewCourses(id?: number): void {
      if (id == null) return;
      this.router.navigate(['/courses', id]);
    }

    ngOnDestroy(): void {
      this.routerSub?.unsubscribe();
    }


  
}
 