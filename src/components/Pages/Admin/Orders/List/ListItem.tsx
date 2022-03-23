import TableCell from '@material-ui/core/TableCell';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { dateFormat } from 'formatters/date';
import { logError } from 'helpers/rxjs-operators/logError';
import IOrder from 'interfaces/models/order';
import DeleteIcon from 'mdi-react/DeleteIcon';
import EyeIcon from 'mdi-react/EyeIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import orderService from 'services/order';

import { PressableTableRow } from './styles';

interface IProps {
  order: IOrder;
  onShow: (order: IOrder) => void;
  onDeleteComplete: () => void;
}

const ListItem = memo((props: IProps) => {
  const { order, onShow, onDeleteComplete } = props;

  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => setError(null), []);

  const handleShow = useCallback(() => {
    onShow(order);
  }, [onShow, order]);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja excluir o registro ${order.id}?`)).pipe(
      filter(ok => ok),
      tap(() => setLoading(true)),
      switchMap(() => orderService.delete(order.id)),
      logError(),
      tap(
        () => {
          Toast.show(`${order.id} foi removido`);
          setLoading(true);
          setDeleted(true);
          onDeleteComplete();
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, []);

  const options = useMemo<IOption[]>(() => {
    return [
      { text: 'Visualizar', icon: EyeIcon, handler: handleShow },
      { text: 'Excluir', icon: DeleteIcon, handler: handleDelete }
    ];
  }, [handleDelete, handleShow]);

  if (deleted) {
    return null;
  }

  return (
    <PressableTableRow onClick={handleShow}>
      <TableCell>{order.id}</TableCell>
      <TableCell>{order.description}</TableCell>
      <TableCell>{dateFormat(order.createdDate)}</TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </PressableTableRow>
  );
});

export default ListItem;
