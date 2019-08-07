// 钱包模块
import React from 'react';
import { connect } from 'react-redux';

import { getSession, getSessionRE } from 'app/shared/reducers/authentication';
import Title from 'app/modules/public/title';
import Enddiv from '../../shared/menu/enddiv';
import './incomeWater.scss';
// 专用接口请求模块
// @ts-ignore
import RequestLoadingWait, { Axios, Api, ShowBodyPlaceholderHtml, httpBuildQuery, DEBUG as RequestDebug } from 'app/request';

export interface IHomeProp extends StateProps, DispatchProps {}

export class IncomeWater extends React.Component<IHomeProp> {
  constructor(props) {
    super(props);
    // 初始化接口数据结构
    this.state = Api.tsxIncomeWater;

    // this.changeLabel = this.changeLabel.bind(this);
    // this.axiosLoadList = this.axiosLoadList.bind(this);
  }

  componentDidMount() {
    // @ts-ignore
    this.props.getSessionRE().then((auth: any) => {
      auth.payload.then((info: any) => {
        info.config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        Axios.defaults.headers = info.config.headers;
        // Axios.defaults.baseURL = '';

        this.setState({ AUTHORUSER: info, startPage: 0, pageSize: 100 });
        // 动态获取最新数 据
        // 默认加载全部数据 navType:all
        this.axiosLoadList('all');
        // console.log(120, Math.random());
      });
    });
    // this.axiosLoadList('all');
  }
  // 动态获取最新数 据
  axiosLoadList = (navType: string) => {
    // @ts-ignore
    let url = this.state.api_debug + '?type=' + navType;
    // 非调试模式
    // @ts-ignore
    if (RequestDebug !== true) {
      // @ts-ignore
      url = this.state.api_incomeWaterQuery.replace(/\{userid\}/, this.state.AUTHORUSER.data.id);
      // @ts-ignore
      url = url.replace(/\{startPage\}/, this.state.startPage);
      // @ts-ignore
      url = url.replace(/\{pageSize\}/, this.state.pageSize);
    }
    // @ts-ignore
    Axios.get(url)
      .then(response => {
        this.setState({ loading: false, progressive: false, navType: navType, data: response.data.data });
        // console.log(92, this.state);
      })
      .catch(error => {
        window.console.log(error);
      });
  };
  changeLabel = (e: any) => {
    const t = e.target.getAttribute('value');
    switch (t) {
      case 'all':
      case 'collection':
      case 'payment':
      case 'other':
        // RequestLoadingWait： 清空body渲染预定义内容loading text 和loading.gif 并显示；
        // ShowBodyPlaceholderHtml： 保留上一次的dom 并追加预定义loading.gif内容并显示；
        // loading:true 显示RequestLoadingWait内敛载入效果（注意：不同与ShowBodyPlaceholderHtml）
        this.setState({ loading: true });
        this.axiosLoadList(t);
        break;
      default:
        break;
    }
    return null;
  };

  render() {
    // @ts-ignore
    if (this.state.progressive === true) {
      return (
        <div className="jh-body">
          <Title name="收款账单列表" back="/settings" />

          <ShowBodyPlaceholderHtml />

          <Enddiv />
        </div>
      );
    }
    // @ts-ignore
    const data = this.state.data;
    const all = data.count ? (data.count.all ? '(' + data.count.all + ')' : '') : '';
    const collection = data.count ? (data.count.collection ? '(' + data.count.collection + ')' : '') : '';
    const payment = data.count ? (data.count.payment ? '(' + data.count.payment + ')' : '') : '';
    // const other = data.count ? (data.count.other ? '(' + data.count.other + ')' : '') : '';
    const list = data.map((item: object, index: number) => (
      <div key={'obj_' + index}>
        <li className="month-nav">
          <div className="info">
            <div>
              {
                // @ts-ignore
                item.time
              }
            </div>
          </div>
        </li>
        {// @ts-ignore
        item.list.map((subLi: object, idex: number) => (
          <li key={'item_' + idex}>
            <div className="info">
              <div>
                {
                  // @ts-ignore
                  subLi.singleClass.other
                }
              </div>
              <div>
                {
                  // @ts-ignore
                  subLi.singleClass.createdate
                }
              </div>
            </div>
            <div className="price">
              {// @ts-ignore
              '+' + subLi.singleClass.amount}
            </div>
          </li>
        ))}
      </div>
    ));
    return (
      <div className="jh-body">
        <Title name="收款账单列表" back="/settings" infoname="我的钱包" infoto="/wallet" />

        <RequestLoadingWait
          // @ts-ignore
          loading={this.state.loading}
        />
        <div className="ws-body-nav ws-hide">
          <ul>
            {// @ts-ignore
            this.state.navType === 'all' || this.state.navType === undefined ? (
              <li value="all" className="active">
                全部{all}
              </li>
            ) : (
              <li value="all" onClick={this.changeLabel}>
                全部{all}
              </li>
            )}

            {// @ts-ignore
            this.state.navType === 'collection' ? (
              <li value="collection" className="active">
                收款{collection}
              </li>
            ) : (
              <li value="collection" onClick={this.changeLabel}>
                收款{collection}
              </li>
            )}

            {// @ts-ignore
            this.state.navType === 'payment' || this.state.navType === undefined ? (
              <li value="payment" className="active">
                付款{payment}
              </li>
            ) : (
              <li value="payment" onClick={this.changeLabel}>
                付款{payment}
              </li>
            )}

            {/*
                (this.state.navType === 'other') ? (
                  <li value="other" className="active">&nbsp;</li>
                ) : (
                  <li value="other" onClick={this.changeLabel}>&nbsp;</li>
                )*/}
          </ul>
        </div>
        <div className="ws-body-list">
          <ul>{list}</ul>
        </div>
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
)(IncomeWater);
