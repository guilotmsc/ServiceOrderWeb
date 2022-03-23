import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
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
import { dateFormat } from 'formatters/date';
import usePaginationObservable from 'hooks/usePagination';
import IOrder from 'interfaces/models/order';
import RefreshIcon from 'mdi-react/RefreshIcon';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import listOrderItems from 'services/order';

import { IResumeOrderProps } from '../interfaces/order.interface';
import ListOrderItem from '../List/ListOrderItem';

const useStyle = makeStyles({
  headingContent: {
    marginTop: 15
  },
  heading: {
    marginBottom: 10,
    paddingRight: 10,
    paddingLeft: 10
  },
  paper: {
    marginTop: 25,
    marginBottom: 15,
    padding: 10
  },
  layout: {
    width: '600',
    marginLeft: '25%',
    marginRight: '25%'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 10
  }
});

const ResumeOrderPage = memo((props: IResumeOrderProps) => {
  const classes = useStyle(props);
  const [order, setOrder] = useState<IOrder>(null);
  const { history, location } = props;

  useEffect(() => {
    if (!location.state.order) {
      history.push('/pedidos');
    }

    setOrder(location.state.order);

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

  const handleFinish = useCallback(() => {
    history.push('/pedidos');
  }, [history]);

  return (
    <Fragment>
      <Toolbar title='Novo pedido' />

      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component='h5' variant='h5' align='center' className={classes.heading}>
            Resumo do Pedido
          </Typography>

          <Divider />

          <Grid container className={classes.headingContent} spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom className={classes.heading}>
                Pedido #<b>{order?.id}</b>
              </Typography>
              <Typography gutterBottom className={classes.heading}>
                Descrição: <b>{order?.description}</b>
              </Typography>
            </Grid>
            <Grid item container direction='column' xs={12} sm={6}>
              <Grid container>
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom>
                      Criado em: <b>{order ? dateFormat(order?.createdDate) : ''}</b>
                    </Typography>
                  </Grid>
                </React.Fragment>
              </Grid>
            </Grid>
          </Grid>

          <Card>
            <CardLoader show={loading} />

            <TableWrapper minWidth={500}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Cód.</TableCell>
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
                      isEditable={false}
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
                Voltar
              </Button>
            </div>
          </Fragment>
        </Paper>
      </main>
    </Fragment>
  );
});

export default ResumeOrderPage;
