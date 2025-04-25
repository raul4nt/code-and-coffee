// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient }     from '@angular/common/http';
// import { Product }        from '../../models/product.model';

// @Component({
//   selector: 'app-product-carousel',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './product-carousel.component.html',
//   styleUrls: ['./product-carousel.component.css']
// })
// export class ProductCarouselComponent implements OnInit {
//   products: Product[] = [];
//   currentIndex  = 0;
//   visibleCount  = 3;

//   constructor(private http: HttpClient) {}

//   ngOnInit() {
//     this.http.get<Product[]>('http://localhost:3000/products')
//       .subscribe(data => this.products = data.slice(0, 10));
//   }

//   prev() {
//     if (this.currentIndex > 0) {
//       this.currentIndex--;
//     }
//   }

//   next() {
//     if (this.currentIndex < this.products.length - this.visibleCount) {
//       this.currentIndex++;
//     }
//   }

//   get visibleProducts(): Product[] {
//     return this.products.slice(
//       this.currentIndex,
//       this.currentIndex + this.visibleCount
//     );
//   }
// }

import { Component, OnInit }    from '@angular/core';
import { CommonModule }          from '@angular/common';
import { SwiperModule }          from 'swiper/angular';
import { Product }               from '../../models/product.model';
import { HttpClient }            from '@angular/common/http';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [ CommonModule, SwiperModule ],
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.css']
})
export class ProductCarouselComponent implements OnInit {
  products: Product[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Product[]>('http://localhost:3000/products')
      .subscribe(data => this.products = data.slice(0, 10));
  }
}
