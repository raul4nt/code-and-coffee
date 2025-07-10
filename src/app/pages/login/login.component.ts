import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async onLogin() {
    try {
      await this.authService.login(this.email, this.password);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
      // se tiver uma returnUrl(checar auth guard), redirecionara pra la ao logar,
      // se nao, vai pra pagina principal mesmo.
      this.router.navigateByUrl(returnUrl);
    } catch (err: any) {
      console.error('Erro ao fazer login', err);
      this.errorMessage = 'Email ou senha inválidos.';
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
