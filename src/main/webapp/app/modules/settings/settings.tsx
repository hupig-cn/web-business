import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';

import Shop from './shop';
import Bankcard from './bankcard';
import Profit from './profit';
import Entrys from './entrys';

// 专用接口请求模块
import RequestLoadingWait, { Axios, Api } from 'app/request';

export interface IPersonalProp extends StateProps, DispatchProps {}

export class Personal extends React.Component<IPersonalProp> {
  constructor(props) {
    super(props);

    // 初始化接口数据结构
    this.state = Api.tsxSettings;
  }
  componentDidMount() {
    this.props.getSession();

    // 动态获取最新数据
    Axios.post(this.state.api, { username: 'sumwang', age: 18 })
      .then(response => {
        this.setState({ loading: false, data: response.data.data });
      })
      .catch(error => {
        // TODO toast error
        window.console.log(error);
      });
  }

  render() {
    const repos = this.state.data;
    return (
      <div className="jh-personal">
        {/* 同步请求 等待视图 */}
        <RequestLoadingWait loading={this.state.loading} />

        <Shop shop={repos.shop} />
        <Bankcard bankcard={repos.bankcard} />
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
        <Profit profit={repos.profit} />
        <Entrys entrys={repos.entrys} />
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
