import * as H from 'history';
import IOrder from 'interfaces/models/order';
import { RouteComponentProps } from 'react-router-dom';

export interface IResumeOrderProps extends RouteComponentProps<{ t: string }> {
  location: H.Location;
}

export interface ICreateOrderProps extends IResumeOrderProps {
  order: IOrder;
}
