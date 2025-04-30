import { Product } from "./product.model";

export interface Order {
  id?: number;
  userId: number;
  products: Product[]
  status: 'Pendente' | 'Concluído' | 'Cancelado' | 'Entregue'
  total: number
  createdAt: string
}
