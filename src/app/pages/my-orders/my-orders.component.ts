import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  async loadOrders(): Promise<void> {
    try {
      const data = await this.orderService.getOrdersFromAuthenticatedUser();
      this.orders = data;
    } catch (err: any) {
      console.error('Erro ao carregar pedidos', err);
    }
  }

  async confirmOrder(order: Order): Promise<void> {
    try {
      order.status = 'Em preparação';
      await this.orderService.updateOrder(order);
      console.log('Pedido confirmado');
      await this.loadOrders();
    } catch (err: any) {
      console.error('Erro ao confirmar pedido', err);
    }
  }

  async confirmDelivery(order: Order): Promise<void> {
    try {
      order.status = 'Entregue';
      await this.orderService.updateOrder(order);
      console.log('Pedido entregue');
      await this.loadOrders();
    } catch (err: any) {
      console.error('Erro ao confirmar entrega', err);
    }
  }

  async cancelOrder(order: Order): Promise<void> {
    try {
      order.status = 'Cancelado';
      await this.orderService.updateOrder(order);
      console.log('Pedido cancelado');
      await this.loadOrders();
    } catch (err: any) {
      console.error('Erro ao cancelar pedido', err);
    }
  }

  async deleteOrder(orderId: number): Promise<void> {
    try {
      await this.orderService.deleteOrder(orderId);
      console.log('Pedido excluído');
      await this.loadOrders();
    } catch (err: any) {
      console.error('Erro ao excluir pedido', err);
    }
  }

  get inProcessOrders() {
    return this.orders
      .filter(o =>
        o.status === 'Aguardando confirmação' || o.status === 'Em preparação'
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  get deliveredOrders() {
    return this.orders
      .filter(o => o.status === 'Entregue')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  get canceledOrders() {
    return this.orders
      .filter(o => o.status === 'Cancelado')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
