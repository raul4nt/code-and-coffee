import { Component, ElementRef, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import Swiper from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';

Swiper.use([Autoplay, Navigation]);

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.css']
})
export class ProductCarouselComponent implements OnInit, AfterViewInit {
  products: Product[] = [];
  isLoading = true;
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  swiperInstance!: Swiper;

  constructor(private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    try {
      const allProducts = await this.productService.getProducts();
      this.products = allProducts.slice(0, 10);
    } catch (error) {
      console.error('Erro ao carregar produtos para o carrossel:', error);
    } finally {
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {
    if (this.products.length > 0) {
      this.initSwiper();
    }
  }

  private initSwiper(): void {
    this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, {
      slidesPerView: 3,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  }
}
