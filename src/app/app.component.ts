import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ProductCarouselComponent } from "./components/product-carousel/product-carousel.component";
import 'swiper/swiper-bundle.min.css';


@Component({
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, FooterComponent, ProductCarouselComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'code-and-coffee';
}
