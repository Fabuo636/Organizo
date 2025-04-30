import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost/Organizo_api/API';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  constructor(private http: HttpClient) {}

  register(user: User): Observable<AuthResponse> {
    // Convertir les données au format attendu par l'API
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('password', user.password);
    if (user.phone) {
      formData.append('phone', user.phone);
    }

    console.log('URL de l\'API:', `${this.API_URL}/register.php`);
    console.log('Données envoyées:', {
      username: user.username,
      email: user.email,
      phone: user.phone
    });

    const headers = {
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };

    return this.http.post<AuthResponse>(`${this.API_URL}/register.php`, formData, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setToken(response.token);
            if (response.user) {
              this.setUser(response.user);
            }
          }
        })
      );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    // Convertir les données au format attendu par l'API
    const formData = new FormData();
    formData.append('email', credentials.email);
    formData.append('password', credentials.password);

    return this.http.post<AuthResponse>(`${this.API_URL}/login.php`, formData)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            this.setToken(response.token);
            if (response.user) {
              this.setUser(response.user);
            }
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}
