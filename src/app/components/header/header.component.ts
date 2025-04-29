import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchVisible = false
  searchTerm = ''

  constructor(private router: Router, private authService: AuthService) {}

  toggleSearchBar() {
    this.searchVisible = !this.searchVisible
    if (!this.searchVisible) this.searchTerm = ''
  }

  onSearch() {
    this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } })
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn()
  }

  logout(): void {
    return this.authService.logout()
  }
}
