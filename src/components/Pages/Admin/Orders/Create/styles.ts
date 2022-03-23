import { makeStyles } from '@material-ui/core';

export const useStyle = makeStyles({
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
  },
  formHeading: {
    marginTop: 20
  },
  form: {
    paddingRight: 10,
    paddingLeft: 10
  },
  formButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 10
  }
});
