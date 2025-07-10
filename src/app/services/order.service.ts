import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) { }

  async createOrder(order: Partial<Order>): Promise<Order | null> {
    const { data, error } = await this.supabaseService.supabase
      .from('orders')
      .insert([order])
      .select();

    if (error) {
      console.error('Erro ao criar pedido:', error);
      return null;
    }
    return data ? data[0] : null;
  }

  async getOrdersFromAuthenticatedUser(): Promise<Order[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
        return [];
    }

    const { data, error } = await this.supabaseService.supabase
      .from('orders')
      .select('*')
      .eq('userId', userId);

    if (error) {
      console.error('Erro ao buscar pedidos do usuário:', error);
      return [];
    }
    return data as Order[];
  }

  async getOrderById(id: number): Promise<Order | null> {
    const { data, error } = await this.supabaseService.supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar pedido por ID:', error);
      return null;
    }
    return data as Order;
  }

  async updateOrder(order: Order): Promise<Order | null> {
    const { data, error } = await this.supabaseService.supabase
      .from('orders')
      .update(order)
      .eq('id', order.id)
      .select();

    if (error) {
      console.error('Erro ao atualizar pedido:', error);
      return null;
    }
    return data ? data[0] : null;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const { error } = await this.supabaseService.supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar pedido:', error);
      return false;
    }
    return true;
  }

  async addProductToOrder(product: Product): Promise<Order | null> {
    const userId = this.authService.getUserId();
    if (!userId) throw new Error('Usuário não autenticado.');

    const { data: existingOrders, error } = await this.supabaseService.supabase
      .from('orders')
      .select('*')
      .eq('userId', userId)
      .eq('status', 'Aguardando confirmação');

    if (error) throw new Error('Erro ao buscar pedidos existentes.');

    let order = existingOrders?.[0];

    if (!order) {
      return this.createOrder({
        userId,
        status: 'Aguardando confirmação',
        products: [product],
        total: product.price,
      });
    } else {
      order.products.push(product);
      order.total += product.price;
      return this.updateOrder(order);
    }
  }
}
