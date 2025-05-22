import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SearchPipe } from '../../pipes/search.pipe';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, SearchPipe],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  searchTerm = '';
  products: Product[] = [];
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private orderService: OrderService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.searchTerm = params.get('q') || '';
    });
    this.http.get<Product[]>(`${environment.apiUrl}products`).subscribe(data => {
      this.products = data;
    });
    this.userId = this.authService.getUserId();
  }

  addToCart(product: Product) {
    if (!this.userId) {
      alert('Você precisa estar logado para adicionar ao pedido.');
      return;
    }

    product.added = true;

    setTimeout(() => {
      product.added = false;
    }, 2000);

    this.orderService.addProductToOrder(this.userId, product).subscribe({
      next: () => {},
      error: () => {}
    });
  }
}



// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { SearchPipe } from '../../pipes/search.pipe';
// import { HttpClient } from '@angular/common/http';
// import { Product } from '../../models/product.model';
// import { OrderService } from '../../services/order.service';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-search-results',
//   standalone: true,
//   imports: [CommonModule, SearchPipe],
//   templateUrl: './search-results.component.html', // Referência ao arquivo HTML
//   styleUrls: ['./search-results.component.css'] // Referência ao arquivo CSS
// })
// export class SearchResultsComponent implements OnInit {
//   searchTerm = '';
//   products: Product[] = [];
//   userId: number | null = null;

//   constructor(
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private orderService: OrderService,
//     private authService: AuthService,
//   ) {}

//   ngOnInit() {
//     this.route.queryParamMap.subscribe(params => {
//       this.searchTerm = params.get('q') || '';
//     });
//     this.http.get<Product[]>('http://localhost:3000/products').subscribe(data => {
//       this.products = data;
//     });
//     this.userId = this.authService.getUserId();
//   }

//   addToCart(product: Product) {
//     if (!this.userId) {
//       alert('Você precisa estar logado para adicionar ao pedido.');
//       return;
//     }

//     product.added = true;

//     setTimeout(() => {
//       product.added = false;
//     }, 2000);

//     this.orderService.addProductToOrder(this.userId, product).subscribe({
//       next: () => {},
//       error: () => {}
//     });
//   }
// }
