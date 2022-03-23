import IUser from './user';

export default interface IOrder {
  id?: number;
  userId?: number;
  description: string;
  
  createdDate?: Date;
  updatedDate?: Date;

  user?: IUser;
}