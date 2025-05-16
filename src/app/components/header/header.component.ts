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
  // elementref -> permite acessar elemento raiz do componente e verificar se foi feito um clique dentro ou fora dele

  ngOnInit() {
    this.routerSub = this.router.events.subscribe(event => {
      // listener pra ouvir os eventos
      if (event instanceof NavigationStart) this.searchVisible = false
      // se o evento for do tipo NavigationStart, ou seja, usuario navegou pra outra pagina, searchVisible vira false
      // entao se a barra de pesquisa estava ativa ela fica desativada novamente(fecha)
    })
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe()
    // quando evento é destruido, a gente usa unsubscribe pra evitar vazamento de memoria
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
    // quando ocorre um evento do tipo click, verifico se a searchVisible esta true(ativa, barra de pesquisa aberta)
    // e, usando o elementref, se o clique foi na barra de pesquisa ou fora
    // se foi fora, seto ela como false
    }
  }
}





