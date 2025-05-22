import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getOrdersFromAuthenticatedUser(): Observable<Order[]> {
    const userId = this.authService.getUserId();
    return this.http.get<Order[]>(`${this.apiUrl}?userId=${userId}`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${order.id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addProductToOrder(userId: number, product: Product): Observable<Order> {
    return this.http.get<Order[]>(`${this.apiUrl}?userId=${userId}`).pipe(
      switchMap((orders) => {
        let order = orders.find((order) => order.status === 'Aguardando confirmação');
        if (!order) {
          order = {
            userId,
            status: 'Aguardando confirmação',
            products: [product],
            total: product.price,
            createdAt: new Date().toISOString(),
          } as Order;
          return this.createOrder(order);
        } else {
          order.products.push(product);
          order.total += product.price;
          return this.updateOrder(order);
        }
      })
    );
  }
}



// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Order } from '../models/order.model';
// import { Product } from '../models/product.model';
// import { switchMap } from 'rxjs/operators';
// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class OrderService {
//   private apiUrl = 'http://localhost:3000/orders';

//   constructor(
//     private http: HttpClient,
//     private authService: AuthService
//   ) {}

//   createOrder(order: Order): Observable<Order> {
//     return this.http.post<Order>(this.apiUrl, order);
//   }

//   getOrdersFromAuthenticatedUser(): Observable<Order[]> {
//     const userId = this.authService.getUserId();
//     return this.http.get<Order[]>(`${this.apiUrl}?userId=${userId}`);
//   }

//   getOrderById(id: number): Observable<Order> {
//     return this.http.get<Order>(`${this.apiUrl}/${id}`);
//   }

//   updateOrder(order: Order): Observable<Order> {
//     return this.http.put<Order>(`${this.apiUrl}/${order.id}`, order);
//   }

//   deleteOrder(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }


//   addProductToOrder(userId: number, product: Product): Observable<Order> {
//     return this.http.get<Order[]>(`${this.apiUrl}?userId=${userId}`).pipe(
//       switchMap((orders) => {
//         let order = orders.find((order) => order.status === 'Aguardando confirmação');
//         if (!order) {

//           order = {
//             userId,
//             status: 'Aguardando confirmação',
//             products: [product],
//             total: product.price,
//             createdAt: new Date().toISOString(),
//           } as Order;
//           return this.createOrder(order);
//         } else {

//           order.products.push(product);
//           order.total += product.price;
//           return this.updateOrder(order);
//         }
//       })
//     );
//   }
// }
