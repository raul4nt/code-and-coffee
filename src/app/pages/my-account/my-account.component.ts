import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '@supabase/supabase-js'; // Importa o tipo User do Supabase
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service'; // Importamos o SupabaseService
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
  // O tipo do usuário agora é o User do Supabase
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
    private supabaseService: SupabaseService, // Usaremos para atualizar o usuário
    private router: Router
  ) {}

  ngOnInit(): void {
    // Pegamos o usuário diretamente do serviço de autenticação
    this.user = this.authService.getUser();
    if (this.user) {
      // Pré-populamos os campos com os dados existentes
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

      // O objeto de atualização para o Supabase
      const updateData: any = {};

      // Adiciona a nova senha se ela foi preenchida
      if (newPassword) {
        updateData.password = newPassword;
      }

      // Adiciona o novo email se ele mudou
      if (email && email.trim() !== this.user.email) {
        updateData.email = email.trim();
      }

      // Adiciona o novo nome nos metadados se ele mudou
      if (name && name.trim() !== this.user.user_metadata['name']) {
        updateData.data = { ...this.user.user_metadata, name: name.trim() };
      }

      // Se não há nada para atualizar, apenas informa o usuário
      if (Object.keys(updateData).length === 0) {
        this.successMessage = 'Nenhuma informação nova para atualizar.';
        this.isLoading = false;
        return;
      }

      // Chama o método de atualização do Supabase
      const { data, error } = await this.supabaseService.supabase.auth.updateUser(updateData);

      if (error) {
        throw error;
      }

      // Limpa o campo de senha e exibe sucesso
      this.updatedUser.newPassword = '';
      this.successMessage = 'Informações atualizadas com sucesso!';

    } catch (error: any) {
      this.errorMessage = `Erro ao atualizar: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }

  async onDeleteAccount(): Promise<void> {
    // IMPORTANTE: Substituir window.confirm por um modal customizado na sua UI
    const confirmed = window.confirm('Tem certeza que deseja apagar sua conta? Todos os seus pedidos também serão apagados. Essa ação não poderá ser desfeita.');
    if (!confirmed || !this.user) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Esta é a implementação correta para o conceito A.
      // Você deve chamar uma Edge Function para apagar o usuário e seus dados.
      // A função abaixo é um exemplo de como você faria a chamada.
      const { error } = await this.supabaseService.supabase.functions.invoke('delete-user-account');

      if (error) {
        throw error;
      }

      // Se a Edge Function foi bem sucedida, ela já fez o logout e invalidou a sessão.
      // Apenas navegamos para o login.
      alert('Conta apagada com sucesso.'); // Substituir por um toast/snackbar
      this.router.navigate(['/login']);

    } catch (error: any) {
      this.errorMessage = `Erro ao apagar a conta: ${error.message}`;
    } finally {
      this.isLoading = false;
    }
  }
}
