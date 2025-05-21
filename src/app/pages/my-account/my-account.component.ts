import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

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
    private http: HttpClient,
    private router: Router
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

onDeleteAccount() {
  const confirmed = window.confirm('Tem certeza que deseja apagar sua conta? Essa ação não poderá ser desfeita.');
  // mensagenzinha padrão de navegador (aquele pop-up) pra perguntar se o usuário quer mesmo apagar a conta
  if (!confirmed) return;

  this.http.get<any[]>(`http://localhost:3000/orders?userId=${this.user.id}`).subscribe({
    // pegamos todos os pedidos relacionados a este usuário
    next: (orders) => {
      const deleteRequests = orders.map(order =>
        this.http.delete(`http://localhost:3000/orders/${order.id}`)
        // usamos o método map pra apagar um por um
      );

      const deleteUser = () => {
        this.http.delete(`http://localhost:3000/users/${this.user.id}`).subscribe(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          this.router.navigate(['/login']);
        });
      };

      if (deleteRequests.length > 0) {
        forkJoin(deleteRequests).subscribe({
          // se houver pedidos, usamos o forkJoin do rxjs (reativo) pra apagar todos os pedidos antes de apagar o usuário
          // basicamente ele executa várias requisições (observables nesse caso né) em paralelo e aguarda todas terminarem
          // pra continuar (se não, embola tudo — posso estar deletando as orders e o código deletar o usuário antes porque não esperou terminar)

          // é basicamente um async/await, equivalente ao Promise.all
          next: () => deleteUser(),
          error: () => this.errorMessage = 'Erro ao apagar pedidos. Tente novamente.'
        });
      } else {
        deleteUser();
        // se não houver pedidos, já apagamos direto o usuário
      }
    },
    error: () => {
      this.errorMessage = 'Erro ao verificar pedidos. Tente novamente.';
    }
  });
}
}
