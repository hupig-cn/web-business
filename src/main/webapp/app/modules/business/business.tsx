import './business.scss';

import React from 'react';
import { connect } from 'react-redux';

import { getSession, getSessionRE } from 'app/shared/reducers/authentication';

import Workbench from '../workbench/workbench';
import Enddiv from '../../shared/menu/enddiv';
import BottomNavigation from 'app/shared/menu/bottomnavigation';

export interface IHomeProp extends StateProps, DispatchProps {}
export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    return (
      <div className="jh-body">
        <Workbench />
        <Enddiv />
        <BottomNavigation bottomNav="work" />
      </div>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated
});

const mapDispatchToProps = { getSession, getSessionRE };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
