import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getSession, getSessionRE } from 'app/shared/reducers/authentication';

import Income from './income';
import Workicon from './workicon';
import Order from './order';
import Commodity from './commodity';

// 专用接口请求模块
import RequestLoadingWait, { Axios, Api, DEBUG as RequestDebug } from 'app/request';

export interface IPersonalProp extends StateProps, DispatchProps {}

export class Personal extends React.Component<IPersonalProp> {
  constructor(props) {
    super(props);
    // 初始化接口数据结构
    this.state = Api.tsxBusiness;
  }
  // 收入订单等信息
  getSomeOrderInfo = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api + shopid);
    return response;
  };

  // 店铺信息
  getShopInfo = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_shopinfo + shopid);
    return response;
  };

  // 获取商品统计
  getGoodStatistical = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_shopgood + shopid);
    return response;
  };

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
        Axios.all([this.getSomeOrderInfo(info.data.id), this.getShopInfo(info.data.id)]).then(
          // @ts-ignore
          // tslint:disable-next-line: only-arrow-functions
          Axios.spread((orderInfo, shopInfo) => {
            // 检查并纠正服务端数据格式
            orderInfo.data = Api.responseParse(orderInfo.data, {});
            shopInfo.data = Api.responseParse(shopInfo.data, {});

            const _orderInfo_ = orderInfo.data.data;
            const _shopInfo_ = shopInfo.data.data;

            that.setState({
              loading: false,
              data: {
                shop: {
                  name: _shopInfo_.name
                },
                income: {
                  today_income: _orderInfo_.today_income,
                  day_order: _orderInfo_.day_order
                },
                order: {
                  unpaid: _orderInfo_.unpaid,
                  paid: _orderInfo_.paid,
                  refund: _orderInfo_.refund,
                  day_order: _orderInfo_.day_order
                },
                commodity: {
                  onsale: 0,
                  takedown: 0,
                  draft: 0
                }
              }
            });
            // 商户不存在
            // console.log(_goodStatistical_);
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
          this.setState({ loading: false, data: response.data.data });
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
    const repos = this.state.data;
    return (
      <div className="jh-personal">
        {/* 同步请求 等待视图 */}
        // @ts-ignore
        <RequestLoadingWait loading={this.state.loading} />
        <Income income={repos.income} shop={repos.shop} />
        <Workicon />
        <Order order={repos.order} />
        <Commodity commodity={repos.commodity} />
      </div>
    );
  }
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
  isAuthenticated: authentication.isAuthenticated
});

const mapDispatchToProps = { getSession, getSessionRE };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Personal);
