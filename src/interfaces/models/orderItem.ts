import IOrder from './order';

export default interface IOrderItem {
    id?: number;
    orderId?: number;
    name: string;
    quantity: number;
    amount: number;
    
    createdDate?: Date;
    updatedDate?: Date;

    order?: IOrder;
}