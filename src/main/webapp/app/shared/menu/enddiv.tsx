import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '46px',
      float: 'left',
      width: '100vw'
    }
  })
);

export default function TitlebarGridList() {
  const classes = useStyles();
  return <div className={classes.root} />;
}
