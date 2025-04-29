import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  imports: [CommonModule]
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Erro ao carregar pedidos', err);
      }
    });
  }

  confirmDelivery(order: Order): void {
    order.status = 'Entregue';
    this.orderService.updateOrder(order).subscribe({
      next: () => {
        console.log('Entrega confirmada');
        this.loadOrders();
      },
      error: (err) => {
        console.error('Erro ao confirmar entrega', err);
      }
    });
  }

  cancelOrder(order: Order): void {
    order.status = 'Cancelado';
    this.orderService.updateOrder(order).subscribe({
      next: () => {
        console.log('Pedido cancelado');
        this.loadOrders();
      },
      error: (err) => {
        console.error('Erro ao cancelar pedido', err);
      }
    });
  }

  deleteOrder(orderId: number): void {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => {
        console.log('Pedido excluído');
        this.loadOrders();
      },
      error: (err) => {
        console.error('Erro ao excluir pedido', err);
      }
    });
  }
}
