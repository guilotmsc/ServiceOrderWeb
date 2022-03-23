import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Toolbar from 'components/Layout/Toolbar';
import CardLoader from 'components/Shared/CardLoader';
import EmptyAndErrorMessages from 'components/Shared/Pagination/EmptyAndErrorMessages';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import TableCellSortable from 'components/Shared/Pagination/TableCellSortable';
import TablePagination from 'components/Shared/Pagination/TablePagination';
import TableWrapper from 'components/Shared/TableWrapper';
import usePaginationObservable from 'hooks/usePagination';
import IOrder from 'interfaces/models/order';
import RefreshIcon from 'mdi-react/RefreshIcon';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import listOrderItems from 'services/order';

import { ICreateOrderProps } from '../interfaces/order.interface';
import ListOrderItem from '../List/ListOrderItem';
import Form from './Form';
import { useStyle } from './styles';

const CreateOrderPage = memo((props: ICreateOrderProps) => {
  const classes = useStyle(props);
  const [order, setOrder] = useState<IOrder>(null);
  const { history, location } = props;

  useEffect(() => {
    if (!location?.state?.order) {
      history.push('/pedidos');
    }

    setOrder(location?.state?.order);

    return () => {
      setOrder(null);
    };
  }, [location, history]);

  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => listOrderItems.listOrderItems(params, order?.id),
    { orderBy: 'createdDate', orderDirection: 'desc' },
    [order?.id]
  );

  const { total, results } = data || ({ total: 0, results: [] } as typeof data);

  const handleRefresh = useCallback(() => refresh(), [refresh]);

  const onComplete = useCallback(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleFinish = useCallback(() => {
    history.push('/pedidos');
  }, [history]);

  return (
    <Fragment>
      <Toolbar title='Novo pedido' />

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h5' variant='h5' align='center' className={classes.heading}>
            Novo Pedido
          </Typography>
          <Typography component='h6' variant='h6' className={classes.heading}>
            Descrição: {order?.description}
          </Typography>

          <Form order={order} onComplete={onComplete} />

          <Card>
            <CardLoader show={loading} />

            <TableWrapper minWidth={500}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellSortable
                      paginationParams={params}
                      disabled={loading}
                      onChange={mergeParams}
                      column='name'
                    >
                      Item
                    </TableCellSortable>
                    <TableCellSortable
                      paginationParams={params}
                      disabled={loading}
                      onChange={mergeParams}
                      column='description'
                    >
                      Item
                    </TableCellSortable>
                    <TableCellSortable
                      paginationParams={params}
                      disabled={loading}
                      onChange={mergeParams}
                      column='quantity'
                    >
                      Quantidade
                    </TableCellSortable>
                    <TableCellSortable
                      paginationParams={params}
                      disabled={loading}
                      onChange={mergeParams}
                      column='amount'
                    >
                      Valor
                    </TableCellSortable>
                    <TableCellActions>
                      <IconButton disabled={loading} onClick={handleRefresh}>
                        <RefreshIcon />
                      </IconButton>
                    </TableCellActions>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <EmptyAndErrorMessages
                    colSpan={5}
                    error={error}
                    loading={loading}
                    hasData={results.length > 0}
                    onTryAgain={refresh}
                  />
                  {results.map(orderItem => (
                    <ListOrderItem
                      key={orderItem.id}
                      orderItem={orderItem}
                      onDeleteComplete={refresh}
                      isEditable={true}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>

            <TablePagination total={total} disabled={loading} paginationParams={params} onChange={mergeParams} />
          </Card>

          <Divider />

          <Fragment>
            <div className={classes.buttons}>
              <Button color='primary' variant='contained' onClick={handleFinish}>
                Finalizar
              </Button>
            </div>
          </Fragment>
        </Paper>
      </main>
    </Fragment>
  );
});

export default CreateOrderPage;
