import { Routes } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { StudentFormComponent } from './components/student-form/student-form.component';
import { StudentMarksComponent } from './components/student-marks/student-marks.component';
import { StudentCoursesComponent } from './components/student-courses/student-courses.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: '', 
    component: StudentListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'add', 
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'edit/:id', 
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  {
    path:'marks/:id',
    component:StudentMarksComponent,
    canActivate: [authGuard]
  },
  {
    path:'courses/:id',
    component:StudentCoursesComponent,
    canActivate: [authGuard]
  }
];