// 钱包模块
import React from 'react';
import { connect } from 'react-redux';

import { getSession, getSessionRE } from 'app/shared/reducers/authentication';
import Title from 'app/modules/public/title';
import Enddiv from '../../shared/menu/enddiv';

import WithDraWater from './wallet.subpage';

// 专用接口请求模块
import { Axios, Api, ShowBodyPlaceholderHtml, DEBUG as RequestDebug } from 'app/request';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Wallet extends React.Component<IHomeProp> {
  constructor(props) {
    super(props);
    // 初始化接口数据结构
    this.state = Api.tsxWallet;
  }

  // 查询用户余额
  api_findUserBalance = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_findUserBalance + shopid);
    return response;
  };
  // 查询用户的提现明细列表
  api_withdrawWaterList = (shopid: number, startNum: number, pageSize: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_withdrawWaterList + [shopid, startNum, pageSize].join('&'));
    return response;
  };

  // TODO 上拉加载组件
  buildStablePage = () => {
    // @ts-ignore
    this.props.getSessionRE().then((val: any) => {
      val.payload.then((info: any) => {
        info.config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        Axios.defaults.headers = info.config.headers;
        // Axios.defaults.baseURL = '';
        // tslint:disable-next-line: no-this-assignment
        const that = this;
        // @ts-ignore
        Axios.all([this.api_findUserBalance(info.data.id), this.api_withdrawWaterList(info.data.id, 0, 50)]).then(
          // tslint:disable-next-line: only-arrow-functions
          // @ts-ignore
          // tslint:disable-next-line: only-arrow-functions
          Axios.spread(function(findUserBalance, withdrawWaterList) {
            // 检查并纠正服务端数据格式
            findUserBalance.data = Api.responseParse(findUserBalance.data, {});
            withdrawWaterList.data = Api.responseParse(withdrawWaterList.data, []);

            window.console.debug(findUserBalance.data.data, withdrawWaterList.data.data);

            that.setState({
              AUTHORUSER: info,
              loading: false,
              progressive: false,
              data: {
                account: findUserBalance.data.data,
                list: withdrawWaterList.data.data
              }
            });
          })
        );
      });
    });
  };

  componentDidMount() {
    // @ts-ignore
    if (RequestDebug === true) {
      // 动态获取最新数据
      // @ts-ignore
      Axios.get(this.state.api_debug)
        .then(response => {
          this.setState({ loading: false, progressive: false, data: response.data.data });
        })
        .catch(error => {
          window.console.log(error);
        });
    } else {
      // @ts-ignore
      this.buildStablePage();
    }
  }

  render() {
    // @ts-ignore
    return this.state.progressive === true ? (
      <div className="jh-body">
        <Title name="我的钱包" back="/settings" />

        <ShowBodyPlaceholderHtml />

        <Enddiv />
      </div>
    ) : (
      <div className="jh-body">
        <Title name="我的钱包" back="/settings" infoname="提现" infoto="/withdrawCheckout" />

        {/* <RequestLoadingWait loading={ this.state.loading } /> */}

        <WithDraWater
          // @ts-ignore
          waterlist={this.state.data.list}
          // @ts-ignore
          account={this.state.data.account}
        />

        <Enddiv />
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
)(Wallet);
