import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SearchPipe } from '../../pipes/search.pipe';
import { Product } from '../../models/product.model';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service'; // Importamos o ProductService

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
  // O ID do usuário do Supabase é uma string (UUID)
  userId: string | null = null;
  isLoading = true; // Adicionamos um estado de carregamento

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService,
    private productService: ProductService // Injetamos o ProductService
  ) {}

  // Transformamos o ngOnInit em async para usar await
  async ngOnInit(): Promise<void> {
    this.route.queryParamMap.subscribe(params => {
      this.searchTerm = params.get('q') || '';
    });

    try {
      // Usamos o ProductService para buscar os produtos
      this.products = await this.productService.getProducts();
    } catch (error) {
      console.error('Erro ao carregar produtos', error);
      // Você pode adicionar uma mensagem de erro na tela aqui
    } finally {
      this.isLoading = false;
    }

    // Pegamos o ID do usuário do nosso AuthService já refatorado
    this.userId = this.authService.getUserId();
  }

  // Transformamos o addToCart em async
  async addToCart(product: Product): Promise<void> {
    if (!this.userId) {
      // IMPORTANTE: Substituir o alert por um modal/toast na sua UI
      alert('Você precisa estar logado para adicionar ao pedido.');
      return;
    }

    // Lógica de feedback visual para o usuário
    product.added = true;
    setTimeout(() => {
      product.added = false;
    }, 2000);

    try {
      // Chamamos o método refatorado do OrderService
      // Não precisamos mais passar o userId, o serviço já sabe quem está logado
      await this.orderService.addProductToOrder(product);
      // Opcional: mostrar um toast de sucesso aqui
    } catch (error) {
      console.error('Erro ao adicionar produto ao pedido', error);
      // Opcional: mostrar um toast de erro aqui
    }
  }
}
