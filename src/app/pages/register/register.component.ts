import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: User = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errorMessage = '';
  successMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const { name, email, password, confirmPassword } = this.user;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    if (name.trim().split(' ').length < 2) {
      this.errorMessage = 'Digite seu nome completo.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.errorMessage = 'Digite um email válido.';
      return;
    }

    if (password.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.successMessage = 'Cadastro realizado com sucesso! Redirecionando pra página de login...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        console.error('Erro ao registrar:', err);
        this.errorMessage = 'Erro ao registrar. Tente novamente.';
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
