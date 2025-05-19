import { Product } from "./product.model";

export interface Order {
  id?: number;
  userId: number;
  products: Product[]
  status: 'Em preparação' | 'Concluído' | 'Cancelado' | 'Entregue' | 'Aguardando confirmação'
  total: number
  createdAt: string
}
