import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';

import Shop from './shop';
import Bankcard from './bankcard';
import Profit from './profit';
import Entrys from './entrys';

export interface IPersonalProp extends StateProps, DispatchProps {}

export class Personal extends React.Component<IPersonalProp> {
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    return (
      <div className="jh-personal">
        <Shop />
        <Bankcard />
        <img
          style={{
            width: '100%',
            height: '55px',
            padding: '5px',
            borderRadius: '10px',
            marginTop: '10px'
          }}
          src="./content/images/profit.png"
        />
        <Profit />
        <Entrys />
      </div>
    );
  }
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
  isAuthenticated: authentication.isAuthenticated
});

const mapDispatchToProps = { getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Personal);
