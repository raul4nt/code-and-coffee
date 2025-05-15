import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name.trim() || !this.email.trim() || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Preencha todos os campos.';
      return;
    }

    if (this.name.trim().split(' ').length < 2) {
      this.errorMessage = 'Digite seu nome completo.';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Digite um email válido.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.successMessage = 'Cadastro realizado com sucesso! Redirecionando pra página de login...';
        setTimeout(() => this.router.navigate(['/login']), 5000);
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
