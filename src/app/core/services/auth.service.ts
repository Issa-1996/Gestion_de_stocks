import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { User, LoginRequest, LoginResponse, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Mock users for demo
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@gestion.com',
      firstName: 'Admin',
      lastName: 'Système',
      role: UserRole.ADMIN,
      avatar: 'https://ui-avatars.com/api/?name=Admin+Système',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      email: 'manager@gestion.com',
      firstName: 'Manager',
      lastName: 'Principal',
      role: UserRole.MANAGER,
      avatar: 'https://ui-avatars.com/api/?name=Manager+Principal',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() {
    this.loadUserFromStorage();
  }

  get currentUser() {
    return this.currentUserSignal.asReadonly();
  }

  get isAuthenticated() {
    return this.isAuthenticatedSignal.asReadonly();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Mock login - password is "password" for all users
    const user = this.mockUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password === 'password') {
      const response: LoginResponse = {
        user,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      };

      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
      this.saveUserToStorage(user, response.token);

      return of(response).pipe(delay(500));
    }

    return throwError(() => new Error('Email ou mot de passe incorrect')).pipe(delay(500));
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }

  private saveUserToStorage(user: User, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    const token = localStorage.getItem('authToken');

    if (userStr && token) {
      const user = JSON.parse(userStr);
      this.currentUserSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    }
  }
}
