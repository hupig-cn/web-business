import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      marginTop: '35px',
      flexGrow: 1,
      height: '37px',
      zIndex: 999,
      position: 'fixed',
      top: 0,
      width: '100%'
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: '#00000015',
      '&:hover': {
        backgroundColor: '#00000025'
      },
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: 0,
        width: '100%'
      }
    },
    searchIcon: {
      width: theme.spacing(5),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#00000075'
    },
    inputRoot: {
      color: 'inherit',
      width: '100%'
    },
    inputInput: {
      padding: theme.spacing(0.5, 1, 0.5, 5),
      color: '#00000075',
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: 200
      }
    }
  })
);

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  return (
    <div className={classes.grow}>
      <AppBar
        position="static"
        style={{
          backgroundColor: '#f0f0f0',
          boxShadow: 'none',
          height: '100%'
        }}
      >
        <Toolbar
          style={{
            minHeight: '0px',
            margin: '5px 0px 5px 0px'
          }}
        >
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="查找消息..."
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ 'aria-label': 'Search' }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
