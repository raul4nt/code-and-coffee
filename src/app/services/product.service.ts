import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private supabaseService: SupabaseService) { }

  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.supabaseService.supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }

    return data as Product[];
  }

  async addProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
    const { data, error } = await this.supabaseService.supabase
      .from('products')
      .insert([product])
      .select(); 

    if (error) {
      console.error('Erro ao adicionar produto:', error);
      return null;
    }

    return data ? data[0] : null;
  }

  async updateProduct(product: Product): Promise<Product | null> {
    const { data, error } = await this.supabaseService.supabase
      .from('products')
      .update(product)
      .eq('id', product.id)
      .select();

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      return null;
    }

    return data ? data[0] : null;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const { error } = await this.supabaseService.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar produto:', error);
      return false;
    }

    return true;
  }
}
