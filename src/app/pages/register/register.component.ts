import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errorMessage = '';
  successMessage = '';

  constructor(private router: Router, private authService: AuthService) {}

  async onRegister(): Promise<void> {
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

    try {
      await this.authService.register(name, email, password);
      this.successMessage = 'Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta. Redirecionando...';
      setTimeout(() => this.router.navigate(['/login']), 4000);

    } catch (err: any) {
      console.error('Erro ao registrar:', err);
      if (err.message && err.message.includes('User already registered')) {
        this.errorMessage = 'Este e-mail já está cadastrado.';
      } else {
        this.errorMessage = 'Erro ao registrar. Tente novamente.';
      }
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
