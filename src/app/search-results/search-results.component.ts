import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SearchPipe } from '../pipes/search.pipe';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, SearchPipe],
  template: `
    <h2>Resultados para: "{{ searchTerm }}"</h2>
    <div *ngIf="!products?.length">Nenhum produto encontrado.</div>
    <div class="product-list">
      <div *ngFor="let p of products | searchFilter:searchTerm" class="product-card">
        <img [src]="p.imageUrl" alt="{{ p.name }}">
        <h3>{{ p.name }}</h3>
        <p>{{ p.description }}</p>
        <strong>R$ {{ p.price.toFixed(2) }}</strong>
      </div>
    </div>
  `,
  styles: [`
    .product-list { display: flex; flex-wrap: wrap; gap: 1rem; }
    .product-card { width: 200px; padding: .5rem; background: #fff; color: #000; }
  `]
})
export class SearchResultsComponent implements OnInit {
  searchTerm = '';
  products: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.searchTerm = params.get('q') || '';
    });
    this.http.get<{ products: Product[] }>('/assets/db.json').subscribe(data => {
      this.products = data.products;
    });
  }
}
