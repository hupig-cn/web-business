import React from 'react';
import { BottomNavigation, BottomNavigationAction, createStyles, makeStyles, Theme } from '@material-ui/core';
import { WorkRounded, MessageRounded, DomainRounded } from '@material-ui/icons';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import initStore from 'app/config/store';
import { registerLocale } from 'app/config/translation';
import Enddiv from './enddiv';
// tslint:disable-next-line: no-submodule-imports
import Badge from '@material-ui/core/Badge';
import Workbench from 'app/modules/workbench/workbench';
import Information from 'app/modules/information/information';
import Settings from 'app/modules/settings/settings';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '0 auto',
      width: '100%',
      position: 'fixed',
      bottom: '0px',
      borderTop: '1px solid #f0f0f0',
      height: '47px',
      '& button': {
        minWidth: '50px',
        paddingBottom: '0px',
        paddingTop: '0px',
        height: '46px'
      },
      '& button.Mui-selected': {
        color: '#fe4365',
        fontSize: '0.65rem',
        paddingTop: '0px',
        outline: 'none'
      },
      '& svg': {
        paddingTop: '2px'
      },
      '& span': {
        minFontSize: '0.1rem',
        fontSize: '0.65rem'
      },
      '& span.Mui-selected': {
        minFontSize: '0.1rem',
        fontSize: '0.65rem',
        paddingTop: '0px'
      }
    },
    margin: {}
  })
);

const store = initStore();
registerLocale(store);

export default function LabelBottomNavigation(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.bottomNav ? props.bottomNav : 'work');

  function handleChange(event: React.ChangeEvent<{}>, newValue: string) {
    setValue(newValue);
    document.getElementById('app-shared-menu-bottom-navigation-link-' + newValue).click();
  }

  return (
    <BottomNavigation id="nav-bottoms" className={classes.root} showLabels value={value} onChange={handleChange}>
      <BottomNavigationAction label="工作台" value="work" icon={<WorkRounded />} />
      <Link id="app-shared-menu-bottom-navigation-link-work" to="/" />

      {/*

      <BottomNavigationAction label="消息" value="information" icon={
          <Badge className={classes.margin} color="secondary" variant="dot">
            <MessageRounded />
          </Badge>
        }
      />
      <Link id="app-shared-menu-bottom-navigation-link-information" to="/information"/>

      */}

      <BottomNavigationAction label="店铺管理" value="settings" icon={<DomainRounded />} />
      <Link id="app-shared-menu-bottom-navigation-link-settings" to="/settings" />
    </BottomNavigation>
  );
}
// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import ErrorBoundary from 'app/shared/error/error-boundary';

// export const bodyEl = document.getElementById('root').getElementsByClassName('jh-body');

/*
export const Loadpages = key => {
  let temp: any = null;
  switch (key) {
    case 'work':
      temp = <Workbench />;
      break;
    case 'information':
      temp = <Information />;
      break;
    case 'settings':
      temp = <Settings />;

      break;
    default:
      temp = null;
      break;
  }
  ReactDOM.render(
    <Provider store={store}>
      {temp}
      <Enddiv />
    </Provider>,
    bodyEl.item(0)
  );
};
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: '0 auto',
      width: '100%',
      position: 'fixed',
      bottom: '0px',
      borderTop: '1px solid #f0f0f0',
      height: '47px',
      '& button': {
        minWidth: '50px',
        paddingBottom: '0px',
        paddingTop: '0px',
        height: '46px'
      },
      '& button.Mui-selected': {
        color: '#fe4365',
        fontSize: '0.65rem',
        paddingTop: '0px',
        outline: 'none'
      },
      '& svg': {
        paddingTop: '2px'
      },
      '& span': {
        minFontSize: '0.1rem',
        fontSize: '0.65rem'
      },
      '& span.Mui-selected': {
        minFontSize: '0.1rem',
        fontSize: '0.65rem',
        paddingTop: '0px'
      }
    },
    margin: {}
  })
);

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState('work');
  const classes = useStyles();
  function handleChange(event: React.ChangeEvent<{}>, newValue: string) {
    Loadpages(newValue);
    setValue(newValue);
  }
  return (
    <BottomNavigation id="nav-bottoms" className={classes.root} showLabels value={value} onChange={handleChange}>
      <BottomNavigationAction label="工作台" value="work" icon={<WorkRounded />} />
      <BottomNavigationAction
        label="消息"
        value="information"
        icon={
          <Badge className={classes.margin} color="secondary" variant="dot">
            <MessageRounded />
          </Badge>
        }
      />
      <BottomNavigationAction label="店铺管理" value="settings" icon={<DomainRounded />} />
    </BottomNavigation>
  );

}*/
