import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent implements OnInit {
  user!: User;

  updatedUser = {
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  };

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const loggedUser = this.authService.getUser();
    if (loggedUser) {
      this.user = loggedUser;
    }
  }

  onUpdate(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const { name, email, currentPassword, newPassword } = this.updatedUser;

    if (!currentPassword) {
      this.errorMessage = 'Informe sua senha atual.';
      return;
    }

    if (currentPassword !== this.user.password) {
      this.errorMessage = 'Senha atual incorreta.';
      return;
    }

    const updatedData: User = {
      ...this.user,
      name: name.trim() || this.user.name,
      email: email.trim() || this.user.email,
      password: newPassword ? newPassword : this.user.password
    };

    this.http.put<User>(`http://localhost:3000/users/${this.user.id}`, updatedData).subscribe({
      next: (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.user = updatedUser;
        this.updatedUser = { name: '', email: '', currentPassword: '', newPassword: '' };
        this.successMessage = 'Informações atualizadas com sucesso!';
      },
      error: () => {
        this.errorMessage = 'Erro ao atualizar informações. Tente novamente.';
      }
    });
  }
}
