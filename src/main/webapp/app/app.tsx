import 'react-toastify/dist/ReactToastify.css';
import './app.scss';

import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
// import { Card } from 'reactstrap';
import { RouteComponentProps } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import { hot } from 'react-hot-loader';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import { setLocale } from 'app/shared/reducers/locale';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import ErrorBoundary from 'app/shared/error/error-boundary';
import { AUTHORITIES } from 'app/config/constants';
import AppRoutes from 'app/routes';
// import BottomNavigation from 'app/shared/menu/bottomnavigation';
import Enddiv from 'app/shared/menu/enddiv';

const baseHref = document
  .querySelector('base')
  .getAttribute('href')
  .replace(/\/$/, '');

export interface IAppProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export class App extends React.Component<IAppProps> {
  componentDidMount() {
    this.props.getSession();
    this.props.getProfile();
  }

  render() {
    return (
      <Router basename={baseHref}>
        <div className="app-container">
          <ToastContainer position={toast.POSITION.TOP_LEFT} className="toastify-container" toastClassName="toastify-toast" />
          {/* <Card className="jh-card"> */}
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
          {/* </Card> */}
          <Enddiv />
          {/* <ErrorBoundary> */}
          {/* <BottomNavigation /> */}
          {/* </ErrorBoundary> */}
        </div>
      </Router>
    );
  }
}

const mapStateToProps = ({ authentication, applicationProfile, locale }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isAuthenticated: authentication.isAuthenticated,
  isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  ribbonEnv: applicationProfile.ribbonEnv,
  isInProduction: applicationProfile.inProduction,
  isSwaggerEnabled: applicationProfile.isSwaggerEnabled
});

const mapDispatchToProps = { setLocale, getSession, getProfile };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(hot(module)(App));
