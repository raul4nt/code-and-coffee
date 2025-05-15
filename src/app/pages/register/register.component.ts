import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

    onRegister() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'As senhas não coincidem.'
        return
      }

      this.successMessage = 'Cadastro realizado com sucesso!';
      setTimeout(() => this.router.navigate(['/login']), 2000)

    }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
}


}
