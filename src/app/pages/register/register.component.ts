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

    this.authService.checkEmailExists(email).subscribe({
      next: (exists) => {
        if (exists) {
          this.errorMessage = 'O email já existe no banco de dados.';
          return;
        }
      // sempre precisamos usar o subscribe pra de fato pegar o VALOR de um observable. se tentamos usar q nem fazemos em apis back-end,
      // exemplo: if checkEmailExists, isso n daria certo pq a gente pega o observable e nao o valor dele
      // nesse caso nao é apenas um boolean, é um Observable<boolean>, entao pra termos acesso ao boolean q ta "dentro" do observable precisamos
      // do subscribe.

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
      },
      error: (err) => {
        console.error('Erro ao verificar email:', err);
        this.errorMessage = 'Erro ao verificar email. Tente novamente.';
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
