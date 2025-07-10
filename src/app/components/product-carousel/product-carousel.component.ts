import { Component, ElementRef, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service'; // Importamos o ProductService
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
  isLoading = true; // Adicionamos um estado de carregamento
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  swiperInstance!: Swiper;

  // Trocamos HttpClient por ProductService
  constructor(private productService: ProductService) {}

  // Transformamos o ngOnInit em async
  async ngOnInit(): Promise<void> {
    try {
      // Usamos o ProductService para buscar os produtos
      const allProducts = await this.productService.getProducts();
      // Pegamos apenas os 10 primeiros para o carrossel
      this.products = allProducts.slice(0, 10);
    } catch (error) {
      console.error('Erro ao carregar produtos para o carrossel:', error);
    } finally {
      this.isLoading = false;
    }
  }

  ngAfterViewInit(): void {
    // A inicialização do Swiper continua aqui.
    // Este método é chamado depois que o *ngFor termina de renderizar os produtos na tela.
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
      // Adicionando breakpoints para responsividade
      breakpoints: {
        // quando a largura da janela for >= 320px
        320: {
          slidesPerView: 1,
          spaceBetween: 10
        },
        // quando a largura da janela for >= 768px
        768: {
          slidesPerView: 2,
          spaceBetween: 20
        },
        // quando a largura da janela for >= 1024px
        1024: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });
  }
}
