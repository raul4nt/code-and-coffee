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
        data: {
          name: name,
          role: 'customer'
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

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
