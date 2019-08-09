// 钱包模块 - 查看提现详情
import React from 'react';
import { connect } from 'react-redux';

import { getSession, getSessionRE } from 'app/shared/reducers/authentication';
import Title from 'app/modules/public/title';
import Enddiv from '../../shared/menu/enddiv';
import Detail from './withdraw.water.subpage';

// 专用接口请求模块
import { PathInfoParse, Axios, Api, ShowBodyPlaceholderHtml, DEBUG as RequestDebug } from 'app/request';

export interface IHomeProp extends StateProps, DispatchProps {}

export class Wallet extends React.Component<IHomeProp> {
  constructor(props) {
    super(props);
    // 初始化接口数据结构
    this.state = Api.tsxWithdrawDetail;
  }

  // 获取一条提现数据详细信息
  api_findWithdrawInfo = (withdrawalId: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_findWithdrawInfo + withdrawalId);

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
        const args = PathInfoParse();
        // @ts-ignore
        Axios.all([this.api_findWithdrawInfo(args[1])]).then(
          // @ts-ignore
          // tslint:disable-next-line: only-arrow-functions
          Axios.spread((findWithdrawInfo: any) => {
            // 检查并纠正服务端数据格式
            findWithdrawInfo.data = Api.responseParse(findWithdrawInfo.data, {});
            // window.console.debug(findWithdrawInfo.data.data);

            that.setState({ AUTHORUSER: info, loading: false, progressive: false, data: findWithdrawInfo.data.data });
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
    const { data } = this.state;
    // @ts-ignore
    return this.state.progressive === true ? (
      <div className="jh-body">
        <Title name="提现详情" back="/wallet" />
        <ShowBodyPlaceholderHtml />
        <Enddiv />
      </div>
    ) : (
      <div className="jh-body">
        <Title name="提现详情" back="/wallet" />
        <Detail info={data} />
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
