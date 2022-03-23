import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IOrder from 'interfaces/models/order';
import React, { forwardRef, Fragment, memo, useCallback } from 'react';
import { tap } from 'rxjs/operators';
import orderService from 'services/order';
import * as yup from 'yup';

interface IProps {
  opened: boolean;
  onComplete: (order: IOrder) => void;
  onCancel: () => void;
}

const validationSchema = yup.object().shape({
    description: yup.string()
      .required()
      .min(3)
      .max(150),
});

const useStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  },
});

const FormDialog = memo((props: IProps) => {
    const classes = useStyle(props);
    const { onComplete } = props;

    const formik = useFormikObservable<IOrder>({
        initialValues: { },
        validationSchema,
        onSubmit(model) {
            return orderService.save(model).pipe(
                tap(order => {
                    Toast.show(`Pedido salvo com sucesso!`);
                        onComplete(order)
                    }),
                    logError(true)
                );
            }
        });

    const handleExit = useCallback(() => {
        formik.resetForm();
    }, [formik]);

    return (
        <Dialog
            open={props.opened}
            disableBackdropClick
            disableEscapeKeyDown
            onExited={handleExit}
            TransitionComponent={Transition}
        >
            {formik.isSubmitting && <LinearProgress color='primary' />}

            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>Novo Pedido</DialogTitle>
                <DialogContent className={classes.content}>
                    <Fragment>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    id="description"
                                    name="description"
                                    label="Descrição"
                                    fullWidth
                                    formik={formik}
                                />
                            </Grid>
                        </Grid>
                    </Fragment>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onCancel}>Cancelar</Button>
                    <Button color='primary' variant='contained' type='submit' disabled={formik.isSubmitting}>
                        Salvar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
});

const Transition = memo(
  forwardRef((props: any, ref: any) => {
    return <Slide direction='up' {...props} ref={ref} />;
  })
);

export default FormDialog;
