import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
// tslint:disable-next-line: no-submodule-imports
import List from '@material-ui/core/List';
// tslint:disable-next-line: no-submodule-imports
import ListItem from '@material-ui/core/ListItem';
// tslint:disable-next-line: no-submodule-imports
import ListItemText from '@material-ui/core/ListItemText';
// tslint:disable-next-line: no-submodule-imports
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      // maxWidth: '360px',
      paddingTop: '0px',
      backgroundColor: theme.palette.background.paper,

      '& a': {
        textDecoration: 'none',
        color: '#212529'
      },
      '& span': {
        fontSize: '0.9rem'
      },
      '& hr': {
        backgroundColor: '#f0f0f0'
      }
    }
  })
);

export default function ListDividers(props) {
  const classes = useStyles();

  return (
    <List component="nav" className={classes.root} aria-label="Mailbox folders">
      <ListItem button style={{ padding: '0px 16px 0px 16px' }}>
        <ListItemText primary="累计销售额" secondary={props.entrys ? props.entrys.amount : '0.00'} />
        <span> &gt; </span>
      </ListItem>
      <Divider />

      <Link unto="/wallet">
        <ListItem button>
          <ListItemText primary="提现账单记录" />
          <span> &gt; </span>
        </ListItem>
      </Link>
      <Divider />

      <Link unto="/manage/incomeWater">
        <ListItem button>
          <ListItemText primary="账户流水记录" />
          <span> &gt; </span>
        </ListItem>
      </Link>
      <Divider />
    </List>
  );
}
