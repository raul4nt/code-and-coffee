import { CommonModule } from '@angular/common'
import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core'
import { Router, NavigationStart, RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../services/auth.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchVisible = false
  searchTerm = ''
  private routerSub!: Subscription

  constructor(private router: Router, private authService: AuthService, private el: ElementRef) {}

  ngOnInit() {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.searchVisible = false
    })
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe()
  }

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
    this.authService.logout()
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target) && this.searchVisible) {
      this.searchVisible = false
    }
  }
}






// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [CommonModule, RouterModule, FormsModule],
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.css']
// })
// export class HeaderComponent {
//   searchVisible = false
//   searchTerm = ''

//   constructor(private router: Router, private authService: AuthService) {}

//   toggleSearchBar() {
//     this.searchVisible = !this.searchVisible
//     if (!this.searchVisible) this.searchTerm = ''
//   }

//   onSearch() {
//     this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } })
//   }

//   isLoggedIn(): boolean {
//     return this.authService.isLoggedIn()
//   }

//   logout(): void {
//     return this.authService.logout()
//   }
// }
