import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IOrder from 'interfaces/models/order';
import IOrderItem from 'interfaces/models/orderItem';
import React, { Fragment, memo } from 'react';
import { tap } from 'rxjs/operators';
import orderService from 'services/order';
import * as yup from 'yup';

import { useStyle } from './styles';

interface IProps {
  order: IOrder;
  onComplete: () => void;
}

const validationSchema = yup.object().shape({
  name: yup.string().required().min(3).max(150),
  quantity: yup.number().required().typeError('Por favor, insira somente números'),
  amount: yup.number().required().typeError('Por favor, insira somente números')
});

const Form = memo((props: IProps) => {
  const { onComplete } = props;
  const classes = useStyle(props);

  const formik = useFormikObservable<IOrderItem>({
    initialValues: {},
    validationSchema,
    onSubmit(model, actions) {
      model.orderId = props.order.id;

      return orderService.saveItem(model).pipe(
        tap(orderItem => {
          Toast.show(`${orderItem.name} foi adicionado`);
          actions.setSubmitting(false);
          formik.resetForm();
          onComplete();
        }),
        logError(true)
      );
    }
  });

  return (
    <Fragment>
      {formik.isSubmitting && <LinearProgress color='primary' />}

      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <Divider />

        <Typography variant='h6' gutterBottom className={classes.formHeading}>
          Adicionar Itens
        </Typography>

        <Fragment>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField id='name' name='name' label='Item' fullWidth formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name='quantity' label='Quantidade' fullWidth formik={formik} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name='amount'
                label='Valor'
                InputProps={{
                  startAdornment: <InputAdornment position='start'>$</InputAdornment>
                }}
                fullWidth
                formik={formik}
              />
            </Grid>
          </Grid>
        </Fragment>

        <Fragment>
          <div className={classes.buttons}>
            <Button color='default' size='small' variant='contained' type='submit' disabled={formik.isSubmitting}>
              Adicionar
            </Button>
          </div>
        </Fragment>
      </form>
    </Fragment>
  );
});

export default Form;
