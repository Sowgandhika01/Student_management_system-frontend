import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),                 //  REQUIRED for routing
    provideHttpClient(withFetch()),       //  with fetch enables the api requests
    provideClientHydration(withEventReplay()) //  optional SSR
  ],
};
