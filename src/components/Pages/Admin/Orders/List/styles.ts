import { withStyles } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';

export const PressableTableRow = withStyles(() => ({
  root: {
    cursor: 'pointer'
  }
}))(TableRow);
