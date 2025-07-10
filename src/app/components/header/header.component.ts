import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core'; // Adicionado ViewChild
import { Router, NavigationStart, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchVisible = false;
  searchTerm = '';
  sidebarOpen = false;
  private routerSub!: Subscription;

  @ViewChild('searchToggleButton') searchToggleButton!: ElementRef;
  @ViewChild('searchBarElement') searchBarElement!: ElementRef;

  constructor(private router: Router, private authService: AuthService, private el: ElementRef) {}
  // elementref -> permite acessar elemento raiz do componente e verificar se foi feito um clique dentro ou fora dele

  ngOnInit() {
    this.routerSub = this.router.events.subscribe(event => {
      // listener pra ouvir os eventos
      if (event instanceof NavigationStart) {
        this.searchVisible = false;
        this.sidebarOpen = false;
      }
    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
    // quando evento é destruido, a gente usa unsubscribe pra evitar vazamento de memoria
  }

  toggleSearchBar() {
    this.searchVisible = !this.searchVisible;
    if (!this.searchVisible) this.searchTerm = '';
    if (this.searchVisible && this.sidebarOpen) {
      this.sidebarOpen = false;
    }
  }

  onSearch() {
    this.router.navigate(['/search'], { queryParams: { q: this.searchTerm } });
    this.searchVisible = false;
    this.searchTerm = '';
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.sidebarOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    const isClickInsideSearchBar = this.searchBarElement?.nativeElement.contains(targetElement);
    const isClickOnSearchToggle = this.searchToggleButton?.nativeElement.contains(targetElement);
    const isClickInsideSidebar = this.el.nativeElement.querySelector('.sidebar')?.contains(targetElement);
    const isClickOnNavbarToggler = this.el.nativeElement.querySelector('.navbar-toggler')?.contains(targetElement);


    if (this.searchVisible && !isClickInsideSearchBar && !isClickOnSearchToggle) {
      this.searchVisible = false;
      this.searchTerm = '';
    }

    if (this.sidebarOpen && !isClickInsideSidebar && !isClickOnNavbarToggler) {
      this.sidebarOpen = false;
    }
    // quando ocorre um evento do tipo click, verifico se a searchVisible esta true(ativa, barra de pesquisa aberta)
    // e, usando o elementref, se o clique foi na barra de pesquisa ou fora
    // se foi fora, seto ela como false
  }

  getUserName(): string {
    const user = this.authService.getUser();
    return user?.user_metadata['name'] || 'Usuário';
  }

  navigateToAccount(): void {
    this.router.navigate(['/my-account']);
    this.sidebarOpen = false;
    // neste caso to usando o navigate, criando uma funçao propria pra navegar, pq lá no html ta como span(que é o que eu quero)
    // com o span fica do estilo q eu quero, o problema é q ele n fica com o cursor aquele da maozinha quando passamos em cima(como se fsse uma tag A)
    // ai usando um metodo especifico de navigaçao como o navigate(especificando a rota desejada, neste caso a my-account), ele fica e funciona como uma tag a mesmo
    // mantendo o span
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    if (this.sidebarOpen && this.searchVisible) {
      this.searchVisible = false;
    }
  }
}
