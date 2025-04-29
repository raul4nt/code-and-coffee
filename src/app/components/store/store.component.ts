import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-store',
  standalone: true,
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  imports: [CommonModule]
})
export class StoreComponent implements OnInit {
  products: any[] = [];
  addedMessage: string = '';
  timeout: any;

  constructor(private productsService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productsService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  addToCart(product: any) {
    this.addedMessage = 'Adicionado';
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.addedMessage = '';
    }, 2000);
  }
}
