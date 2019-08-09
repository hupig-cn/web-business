import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getSession, getSessionRE } from 'app/shared/reducers/authentication';

import Shop from './shop';
import Bankcard from './bankcard';
import Profit from './profit';
import Entrys from './entrys';
import BottomNavigation from 'app/shared/menu/bottomnavigation';

// 专用接口请求模块
import RequestLoadingWait, { Axios, Api, DEBUG as RequestDebug } from 'app/request';

export interface IPersonalProp extends StateProps, DispatchProps {}

export class Personal extends React.Component<IPersonalProp> {
  constructor(props) {
    super(props);

    // 初始化接口数据结构
    this.state = Api.tsxSettings;
  }
  // 查询用户余额
  getShopBalance = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_shopbalance + shopid);
    return response;
  };

  // 店铺信息
  getShopInfo = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_shopinfo + shopid);
    return response;
  };

  // 查询商家各项详细收益
  getProfitInfo = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_profitinfo + shopid);
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
        Axios.all([this.getShopBalance(info.data.id), this.getShopInfo(info.data.id), this.getProfitInfo(info.data.id)]).then(
          // @ts-ignore
          // tslint:disable-next-line: only-arrow-functions
          Axios.spread(function(ShopBalance, ShopInfo, ProfitInfo) {
            // 检查并纠正服务端数据格式
            ShopBalance.data = Api.responseParse(ShopBalance.data, {});
            ShopInfo.data = Api.responseParse(ShopInfo.data, {});
            ProfitInfo.data = Api.responseParse(ProfitInfo.data, {});

            // window.console.debug(ShopBalance.data.data, ShopInfo.data.data, ProfitInfo.data.data);

            const _ShopBalance_ = ShopBalance.data.data;
            const _ShopInfo_ = ShopInfo.data.data;
            const _ProfitInfo_ = ProfitInfo.data.data;

            that.setState({
              loading: false,
              progressive: false,
              data: {
                shop: {
                  logo: './content/images/title.png',
                  shop_name: _ShopInfo_.name,
                  hot_line: '', // 店铺电话
                  balance: _ProfitInfo_.balance,
                  yestoday_income: _ProfitInfo_.yestoday_income
                },
                bankcard: {
                  bind_totals: 0
                },
                profit: {
                  this_month: _ProfitInfo_.this_month,
                  last_month: _ProfitInfo_.last_month
                },
                entrys: {
                  amount: _ProfitInfo_.amount
                }
              }
            });

            // todo 尝试加载商户头像，如果错误错误则不左视图改变（即填充显示系统预设图标）
            // @ts-ignore
            Api.getFileBase64(_ShopInfo_.merchantphoto)
              .then((response: any) => {
                let data = { shop: { logo: '' } };
                // @ts-ignore
                data = that.state.data;
                // @ts-ignore
                data.shop.logo = Api.buildFileBase64Path(response.data);
                // tslint:disable-next-line: object-literal-shorthand
                that.setState({ data: data });
                // window.console.log(response);
              })
              .catch(error => {
                window.console.log(error);
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
    const repos = this.state.data;
    return (
      <div className="jh-personal">
        {/* 同步请求 等待视图 */}
        <RequestLoadingWait
          // @ts-ignore
          loading={this.state.loading}
        />

        <Shop shop={repos.shop} />
        {/* <Bankcard bankcard={repos.bankcard} /> */}
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
        <BottomNavigation bottomNav="settings" />
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
