import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { parseToBRL } from 'formatters/currency';
import { logError } from 'helpers/rxjs-operators/logError';
import IOrderItem from 'interfaces/models/orderItem';
import DeleteIcon from 'mdi-react/DeleteIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import orderService from 'services/order';

interface IProps {
  orderItem: IOrderItem;
  onDeleteComplete: () => void;
  isEditable: boolean;
}

const ListOrderItem = memo((props: IProps) => {
  const { orderItem, onDeleteComplete, isEditable } = props;

  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => setError(null), []);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja excluir o registro ${orderItem.name}?`)).pipe(
      filter(ok => ok),
      tap(() => setLoading(true)),
      switchMap(() => orderService.deleteItem(orderItem.id)),
      logError(),
      tap(
        () => {
          Toast.show(`${orderItem.name} foi removido`);
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
    return [{ text: 'Excluir', icon: DeleteIcon, handler: handleDelete }];
  }, [handleDelete]);

  if (deleted) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>{orderItem.id}</TableCell>
      <TableCell>{orderItem.name}</TableCell>
      <TableCell>{orderItem.quantity}</TableCell>
      <TableCell>{parseToBRL(orderItem.amount)}</TableCell>
      {isEditable && (
        <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
      )}
    </TableRow>
  );
});

export default ListOrderItem;
