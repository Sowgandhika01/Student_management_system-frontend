import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { StudentMarksComponent } from './components/student-marks/student-marks.component';
import { StudentCoursesComponent } from './components/student-courses/student-courses.component';

export const routes: Routes = [
  { path: '', component: StudentListComponent },
  { path: 'add', component: StudentFormComponent },
  { path: 'edit/:id', component: StudentFormComponent },
  {path:'marks/:id',component:StudentMarksComponent},
  {path:'courses/:id',component:StudentCoursesComponent}
];