import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`)
      .pipe(
        tap(users => {
          if (users.length > 0) {
            const token = 'fake-jwt-token'; 
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(users[0]));
          } else {
            throw new Error('Credenciais inválidas');
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
