import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SearchPipe } from '../../pipes/search.pipe';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, SearchPipe],
  template: `
  <h2 class="search-title">Resultados para: "{{ searchTerm }}"</h2>
  <div *ngIf="(products | searchFilter:searchTerm).length === 0" class="product-not-found">
    Nenhum produto encontrado :(
  </div>
  <div class="container my-4">
    <div class="row">
      <div *ngFor="let p of products | searchFilter:searchTerm" class="col-md-4">
        <div class="card mb-3">
          <img [src]="p.imageUrl" class="card-img-top" [alt]="p.name">
          <div class="card-body">
            <h5 class="card-title">{{ p.name }}</h5>
            <p class="card-text">{{ p.description }}</p>
            <p class="card-text"><strong>R$ {{ p.price | number: '1.2-2' }}</strong></p>
            <button class="btn btn-dark w-100" (click)="addToCart(p)">Adicionar ao Pedido</button>
            <p *ngIf="p.added" class="text-success mt-2">Produto adicionado</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  width: 100%;
  height: 180px;
  object-fit: contain;
  padding: 10px;
  background-color: #f8f9fa;
}

button {
  font-weight: bold;
}

.text-success {
  background-color: #d4edda;
  color: #155724;
  padding: 15px 20px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  width: 100%;
  display: block;
  margin-top: 10px;
}

.search-title, .product-not-found {
  text-align: center;
  margin-top: 20px;
  font-family: Arial, sans-serif;
}
  `]
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
    this.http.get<Product[]>('http://localhost:3000/products').subscribe(data => {
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
