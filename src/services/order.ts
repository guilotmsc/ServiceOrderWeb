import IOrder from 'interfaces/models/order';
import IOrderItem from 'interfaces/models/orderItem';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { Observable } from 'rxjs';

import apiService, { ApiService } from './api';

export class OrderService {
  constructor(private apiService: ApiService) {}

  public list(params: IPaginationParams): Observable<IPaginationResponse<IOrder>> {
    return this.apiService.get('/order', params);
  }

  public listOrderItems(params: IPaginationParams, orderId: Number): Observable<IPaginationResponse<IOrderItem>> {
    return this.apiService.get(`/order_item/${orderId}`, params);
  }

  public listOrderItemsByOrderId(orderId: Number): Observable<IOrderItem> {
    return this.apiService.get(`/order_item/list_by_order${orderId}`);
  }

  public save(model: Partial<IOrder>): Observable<IOrder> {
    return this.apiService.post('/order', model);
  }

  public saveItem(model: Partial<IOrder>): Observable<IOrderItem> {
    return this.apiService.post('/order_item', model);
  }

  public delete(id: number): Observable<void> {
    return this.apiService.delete(`/order/${id}`);
  }

  public deleteItem(id: number): Observable<void> {
    return this.apiService.delete(`/order_item/${id}`);
  }
}

const orderService = new OrderService(apiService);

export default orderService;
