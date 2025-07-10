import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '@supabase/supabase-js';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  user: User | null = null;

  updatedUser = {
    name: '',
    email: '',
    newPassword: ''
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user) {
      this.updatedUser.name = this.user.user_metadata['name'];
      this.updatedUser.email = this.user.email || '';
    }
  }

  async onUpdate(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (!this.user) {
      this.errorMessage = 'Usuário não encontrado.';
      this.isLoading = false;
      return;
    }

    try {
      const { name, email, newPassword } = this.updatedUser;

      const updateData: any = {};

      if (newPassword) {
        updateData.password = newPassword;
      }

      if (email && email.trim() !== this.user.email) {
        updateData.email = email.trim();
      }

      if (name && name.trim() !== this.user.user_metadata['name']) {
        updateData.data = { ...this.user.user_metadata, name: name.trim() };
      }

      if (Object.keys(updateData).length === 0) {
        this.successMessage = 'Nenhuma informação nova para atualizar.';
        this.isLoading = false;
        return;
      }

      const { data, error } = await this.supabaseService.supabase.auth.updateUser(updateData);

      if (error) {
        throw error;
      }

      this.updatedUser.newPassword = '';
      this.successMessage = 'Informações atualizadas com sucesso!';

    } catch (error: any) {
      this.errorMessage = `Erro ao atualizar: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  async onDeleteAccount(): Promise<void> {
    const confirmed = window.confirm('Tem certeza que deseja apagar sua conta? Todos os seus pedidos também serão apagados. Essa ação não poderá ser desfeita.');
    if (!confirmed || !this.user) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { error } = await this.supabaseService.supabase.functions.invoke('delete-user-account');

      if (error) {
        throw error;
      }

      alert('Conta apagada com sucesso.');
      this.router.navigate(['/login']);

    } catch (error: any) {
      this.errorMessage = `Erro ao apagar a conta: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }
}
