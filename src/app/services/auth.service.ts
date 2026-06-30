import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authApiUrl = '/auth';
  private tokenKey = 'auth_token';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.loadUserFromStorage();
    }
  }

  private loadUserFromStorage(): void {
    if (!this.isBrowser) {
      return;
    }
    const token = this.getToken();
    if (token) {
      try {
        const payload = this.parseJwt(token);
        this.currentUserSubject.next(payload);
      } catch (e) {
        this.logout();
      }
    }
  }

  signup(userData: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.authApiUrl}/signup`, userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.authApiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
          const payload = this.parseJwt(response.token);
          this.currentUserSubject.next(payload);
        }
      })
    );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
    }
    this.currentUserSubject.next(null);
  }

  setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }
}
