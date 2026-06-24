import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig) //For app running purpose, we are using the bootstrapApplication method to bootstrap the AppComponent with the provided appConfig. This method is part of Angular's platform-browser package and is used to initialize the application. If there are any errors during the bootstrapping process, they will be caught and logged to the console using the catch method.
  .catch((err) => console.error(err));
