import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import BottomNavigation from '@material-ui/core/BottomNavigation';
// tslint:disable-next-line: no-submodule-imports
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
// tslint:disable-next-line: no-submodule-imports
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
// tslint:disable-next-line: no-submodule-imports
import Avatar from '@material-ui/core/Avatar';
// tslint:disable-next-line: no-submodule-imports
import IconButton from '@material-ui/core/IconButton';
// tslint:disable-next-line: no-submodule-imports
import { ShoppingCartRounded, SettingsRounded } from '@material-ui/icons';

import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100vw',
      backgroundColor: '#fe4365',
      height: '100%',
      '& button': {
        marginTop: 4,
        outline: 'none',
        marginBottom: 4,
        color: '#fffde5',
        fill: '#fffde5',
        height: '100%',
        maxWidth: '100%'
      },
      '& svg': {
        width: 30,
        height: 30
      },
      '& span': {
        marginTop: 3
      }
    },
    bigAvatar: {
      margin: '10px 0px 0px 15px',
      float: 'left',
      fill: '#fffde5',
      width: '50px',
      height: '50px'
    },
    namePlusSetting: {
      width: 'calc(100% - 70px)',
      height: '60px',
      float: 'right',
      padding: '14px 10px 0px 0px'
    },
    nameOne: {
      float: 'left',
      width: '100%',
      '& button': {
        '& span': {
          '& svg': {
            fill: '#fffde5'
          }
        }
      }
    },
    name: {
      color: '#fffde5',
      float: 'left'
    },
    login: {
      color: '#fffde5',
      float: 'left',
      fontSize: '0.7rem'
    }
  })
);

export const Loadpages = key => {
  let temp: any = null;
  switch (key) {
    case 'scan':
      break;
    case 'pay':
      break;
    case 'income':
      break;
    case 'share':
      break;
    default:
      temp = null;
      break;
  }
};

export default function LongMenu(props) {
  const classes = useStyles();
  const [value] = React.useState();

  function handleChange(event: React.ChangeEvent<{}>, newValue: string) {
    Loadpages(newValue);
  }

  return (
    <div>
      <div style={{ backgroundColor: '#fe4365', height: '60px', position: 'fixed', top: '0px', width: '100%', zIndex: 1000 }}>
        <Avatar alt="photo" src={props.shop ? props.shop.logo : './content/images/title.png'} className={classes.bigAvatar} />
        <div className={classes.namePlusSetting}>
          <div className={classes.nameOne}>
            <span className={classes.name}>{props.shop ? props.shop.shop_name : '-'}</span>
            <Link style={{ float: 'right' }} to="/manage">
              <IconButton color="primary" aria-label="setting" style={{ padding: '0px', float: 'right', outline: 'none' }}>
                <SettingsRounded />
              </IconButton>
            </Link>
          </div>
          <div className={classes.login}>{props.shop ? props.shop.hot_line : '-未公开-'}</div>
        </div>
      </div>
      <BottomNavigation
        style={{
          position: 'fixed',
          top: '60px',
          height: 'auto',
          zIndex: 1000
        }}
        showLabels
        className={classes.root}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          sl-dat="234"
          label={props.shop ? '昨日收入：' + props.shop.yestoday_income : '昨日收入：0.00'}
          value="scan"
          icon={
            <Link to="/wallet">
              <span
                style={{
                  fontWeight: 'normal',
                  color: '#fff',
                  fontSize: '1.4rem',
                  marginBottom: '5px'
                }}
              >
                钱包: {props.shop ? props.shop.balance : '0.00'}
              </span>
            </Link>
          }
        />
      </BottomNavigation>
      <div style={{ height: '147px' }} />
    </div>
  );
}
