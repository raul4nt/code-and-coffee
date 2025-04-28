import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

  toggleSearchBar() {
    this.searchVisible = !this.searchVisible
    if (!this.searchVisible) this.searchTerm = ''
  }

  onSearch() {
    this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } })
  }
}
