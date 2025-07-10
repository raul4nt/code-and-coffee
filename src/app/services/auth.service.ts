import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private currentSession: Session | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // Fica ouvindo o estado da autenticação em tempo real
    this.supabaseService.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        this.currentUser = session!.user;
        this.currentSession = session;
      } else if (event === 'SIGNED_OUT') {
        this.currentUser = null;
        this.currentSession = null;
        this.router.navigate(['/login']);
      }
    });
  }

  // Novo método para carregar a sessão inicial
  async loadSession() {
    const { data, error } = await this.supabaseService.supabase.auth.getSession();
    if (data.session) {
      this.currentSession = data.session;
      this.currentUser = data.session.user;
    }
    return data.session;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async register(name: string, email: string, password: string) {
    const { data, error } = await this.supabaseService.supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // Você pode guardar dados extras do usuário aqui
        data: {
          name: name,
          role: 'customer'
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    // O ideal é criar uma tabela 'profiles' para guardar o nome e o 'role'
    // mas o options.data já ajuda muito.

    return data;
  }

  async logout() {
    const { error } = await this.supabaseService.supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentSession;
  }

  getUser(): User | null {
    return this.currentUser;
  }

  getUserId(): string | null {
    return this.currentUser ? this.currentUser.id : null;
  }
}
