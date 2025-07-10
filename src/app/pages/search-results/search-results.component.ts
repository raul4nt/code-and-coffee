import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SearchPipe } from '../../pipes/search.pipe';
import { Product } from '../../models/product.model';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

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
  userId: string | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParamMap.subscribe(params => {
      this.searchTerm = params.get('q') || '';
    });

    try {
      this.products = await this.productService.getProducts();
    } catch (error) {
      console.error('Erro ao carregar produtos', error);
    } finally {
      this.isLoading = false;
    }

    this.userId = this.authService.getUserId();
  }

  async addToCart(product: Product): Promise<void> {
    if (!this.userId) {
      alert('Você precisa estar logado para adicionar ao pedido.');
      return;
    }

    product.added = true;
    setTimeout(() => {
      product.added = false;
    }, 2000);

    try {
      await this.orderService.addProductToOrder(product);
    } catch (error) {
      console.error('Erro ao adicionar produto ao pedido', error);
    }
  }
}
