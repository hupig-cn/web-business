import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: '360px',
      paddingTop: '0px',
      backgroundColor: theme.palette.background.paper,
      '& span': {
        fontSize: '0.9rem'
      },
      '& hr': {
        backgroundColor: '#f0f0f0'
      }
    }
  })
);

export default function ListDividers() {
  const classes = useStyles();

  return (
    <List component="nav" className={classes.root} aria-label="Mailbox folders">
      <ListItem button style={{ padding: '0px 16px 0px 16px' }}>
        <ListItemText primary="累计总收益" secondary="215881.00" />
        <span>></span>
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemText primary="提现账单记录" />
        <span>></span>
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemText primary="账户流水记录" />
        <span>></span>
      </ListItem>
      <Divider />
    </List>
  );
}
