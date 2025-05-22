import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<any> {
    return this.http
      .get<any[]>(`${this.apiUrl}users?email=${email}&password=${password}`)
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

  register(name: string, email: string, password: string): Observable<any> {
    const newUser = {
      name,
      email,
      password,
      role: 'customer',
      token: ''
    }

    return this.http.post<any>(`${this.apiUrl}users`, newUser);
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getUserId(): number | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}users`).pipe(
      map(users => users.some(user => user.email.toLowerCase() === email.toLowerCase()))
    );
  }
}



// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { map, Observable } from 'rxjs';
// import { tap } from 'rxjs';
// import { User } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   private apiUrl = 'http://localhost:3000';

//   constructor(
//     private http: HttpClient,
//     private router: Router
//   ) { }

//   login(email: string, password: string): Observable<any> {
//     return this.http
//       .get<any[]>(`${this.apiUrl}/users?email=${email}&password=${password}`)
//       .pipe(
//         tap(users => {
//           if (users.length > 0) {
//             const token = 'fake-jwt-token';
//             localStorage.setItem('authToken', token);
//             localStorage.setItem('user', JSON.stringify(users[0]));
//           } else {
//             throw new Error('Credenciais inválidas');
//           }
//         })
//       );
//   }

//   register(name: string, email: string, password: string): Observable<any> {
//     const newUser = {
//       name,
//       email,
//       password,
//       role: 'customer',
//       token: ''
//     }

//     return this.http.post<any>(`${this.apiUrl}/users`, newUser);
//   }

//   logout() {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//     this.router.navigate(['/login']);
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('authToken');
//   }

//   getUser(): any {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   }

//   getUserId(): number | null {
//     const user = this.getUser();
//     return user ? user.id : null;
//   }

//   checkEmailExists(email: string): Observable<boolean> {
//     return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
//       map(users => users.some(user => user.email.toLowerCase() === email.toLowerCase()))
//     );
//   // temos q usar/converter usando o toLowerCase pq o json-server nao suporta a comparaçao sem ser case sensitive
// }

// }
