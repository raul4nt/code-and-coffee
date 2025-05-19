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
  imports: [CommonModule]
})
export class StoreComponent implements OnInit {
  products: Product[] = [];
  userId: number | null = null;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data.map(product => ({ ...product, added: false }));
    });

    this.userId = this.authService.getUserId();
  }

  addToCart(product: any) {
    if (!this.userId) {
      alert('Você precisa estar logado para adicionar ao pedido.');
      return;
    }

    product.added = true;

    setTimeout(() => {
      product.added = false;
    }, 2000);

    this.orderService.addProductToOrder(this.userId, product).subscribe({
      next: (order) => {
        console.log('Produto adicionado ao pedido:', order);
      },
      error: (err) => {
        console.error('Erro ao adicionar ao pedido', err);
      }
    });
  }
}
