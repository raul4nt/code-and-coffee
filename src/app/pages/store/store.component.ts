import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class StoreComponent implements OnInit {
  products: Product[] = [];
  userId: string | null = null;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    try {
      const data = await this.productService.getProducts();
      this.products = data.map(product => ({ ...product, added: false }));
    } catch (err: any) {
      console.error('Erro ao buscar produtos', err);
    }

    this.userId = this.authService.getUserId();
  }

  async addToCart(product: Product) {
    if (!this.userId) {
      alert('Você precisa estar logado para adicionar ao pedido.');
      return;
    }

    product.added = true;

    setTimeout(() => {
      product.added = false;
    }, 2000);

    try {
      const order = await this.orderService.addProductToOrder(product);
      console.log('Produto adicionado ao pedido:', order);
    } catch (err: any) {
      console.error('Erro ao adicionar ao pedido', err);
    }
  }
}
