// 钱包模块 - 发起提现
import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { getSession, getSessionRE } from 'app/shared/reducers/authentication';
import Title from 'app/modules/public/title';
import Enddiv from '../../shared/menu/enddiv';
import { Link } from 'react-router-dom';
// import Detail from './withdraw.checkout.subpage';

import { toast } from 'react-toastify';
import JQ from 'jquery';

// 专用接口请求模块
import { Axios, Api, ShowBodyPlaceholderHtml, DEBUG as RequestDebug } from 'app/request';
import Utils from 'app/utils';

export interface IWithdrwaProp extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export class Withdarw extends React.Component<IWithdrwaProp> {
  constructor(props) {
    super(props);
    // 初始化接口数据结构
    this.state = JQ.extend(true, {}, Api.tsxWithdraw.data, Api.tsxWithdraw);
  }

  // 查询用户余额
  api_findUserBalance = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_findUserBalance + shopid);
    return response;
  };
  // 查询用户银行卡列表
  api_findAllUserBankCard = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_findAllUserBankCard + shopid);
    return response;
  };

  // TODO 上拉加载组件
  buildStablePage = () => {
    // @ts-ignore
    const that = this;
    // @ts-ignore
    this.props.getSessionRE().then((val: any) => {
      val.payload.then((info: any) => {
        info.config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        Axios.defaults.headers = info.config.headers;
        // Axios.defaults.baseURL = '';
        Axios.all([this.api_findUserBalance(info.data.id), this.api_findAllUserBankCard(info.data.id)]).then(
          // tslint:disable-next-line: only-arrow-functions
          // @ts-ignore
          Axios.spread(function(findUserBalance, findAllUserBankCard) {
            // 检查并纠正服务端数据格式
            findAllUserBankCard.data = Api.responseParse(findAllUserBankCard.data, []);
            findUserBalance.data = Api.responseParse(findUserBalance.data, {});

            window.console.debug(findAllUserBankCard.data.data, findUserBalance.data.data);

            that.setState({
              AUTHORUSER: info,
              loading: false,
              progressive: false,
              data: {
                account: findUserBalance.data.data,
                bank: findAllUserBankCard.data.data
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

  handelSubmit = (e: any) => {
    e.preventDefault();
    const state = this.state;
    const ab_balance = parseFloat(state.data.account.availableBalance.replace(/\ |,/g, '')) * 1;

    const post = {
      bankcardid: Utils.numberValidate(state.bankcard),
      gatheringway: 1, // TODO 目前只开银行卡  1:银行卡/ 2:微信/ 3:支付宝
      withdrawalamount: Utils.priceValidate(state.amount),
      userid: state.AUTHORUSER.data.id || 0
    };

    if (post.userid <= 0) {
      toast.error('操作授权失败,请尝试重新登录');
      window.console.log('用户授权失败');
    } else if (post.bankcardid <= 0 || !post.bankcardid) {
      toast.info('请选择收款银行卡');
      window.console.log('请选择收款银行卡');
    } else if (post.withdrawalamount <= 0 || isNaN(post.withdrawalamount)) {
      toast.info('提现金额无效');
      window.console.log('提现金额无效');
    } else if (post.withdrawalamount > ab_balance) {
      toast.info('提现金额超限');
      window.console.log('提现金额超限');
    } else {
      this.lockSbmitBtn(true);
      Axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8';
      post.withdrawalamount = post.withdrawalamount + '';
      // @ts-ignore
      Axios.post(this.state.api_insertWithdraw, post)
        .then(response => {
          toast.success('已申请成功，请等待审核');
          this.forceUpdate();
        })
        .catch(error => {
          toast.error('提现申请失败，请稍后尝试');
          window.console.log('提现申请失败，请稍后尝试');
          this.lockSbmitBtn(false);
        });
    }
  };

  // 锁定提交
  lockSbmitBtn = (lock: boolean) => {
    lock
      ? JQ('button[type="submit"]')
          .css('background', 'auto')
          .attr('disabled', 'disabled')
      : JQ('button[type="submit"]')
          .css('background', '#1976d2')
          .removeAttr('disabled');
  };

  changeBank = (e: any) => {
    this.setState({
      bankcard: e.target.value
    });
  };

  inputAmount = (e: any) => {
    const value = Utils.priceValidate(e.target.value);
    const ab_balance = parseFloat(this.state.data.account.availableBalance.replace(/\ |,/g, '')) * 1;
    console.log(typeof value, value);
    // 提现金额输入错误或超出可提现金额边界
    if (value === false || value > ab_balance) {
      // this.lockSbmitBtn(true);
      return this.state.amount;
    }
    this.lockSbmitBtn(false);

    this.setState({
      amount: value > 0 ? value : 0
    });
    this.lockSbmitBtn(false);
  };

  render() {
    const data = this.state.data;
    const bankList = !data.bank
      ? null
      : data.bank.map((item: object) => (
          <label
            onClick={this.changeBank}
            htmlFor={'bankcard_' + item.id}
            key={item.id}
            style={{
              width: '100vw',
              display: 'inline-block',
              margin: 0,
              padding: 0,
              height: '44px'
            }}
          >
            <ul
              style={{
                width: '100vw',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                height: '50px',
                backgroundColor: '#eee',
                borderBottom: '1px solid #ddd'
              }}
            >
              <li
                style={{
                  listStyle: 'none',
                  float: 'left',
                  margin: 0,
                  padding: 0,
                  heigth: '50px',
                  lineHeight: '50px',
                  textIndent: '20px',
                  textAlign: 'left',
                  width: '85%',
                  fontSize: '0.8rem',
                  overflow: 'hidden'
                }}
              >
                {item.bankname}（尾号 {item.banknum}） {item.bankuser}{' '}
              </li>
              <li
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  heigth: '50px',
                  lineHeight: '50px',
                  textAlign: 'right',
                  width: '15%',
                  paddingRight: '10px',
                  float: 'right'
                }}
              >
                <input id={'bankcard_' + item.id} type="radio" name="bankcard" value={item.id} />
              </li>
            </ul>
          </label>
        ));
    return this.state.progressive === true ? (
      <div className="jh-body">
        <Title name="申请提现" back="/wallet" />
        <ShowBodyPlaceholderHtml />
        <Enddiv />
      </div>
    ) : data.bank.length === 0 ? (
      <div className="jh-body">
        <Title name="申请提现" back="/wallet" />

        <div
          style={{
            height: '100px',
            lineHeight: '100px'
          }}
        >
          您还没有绑定银行卡
        </div>

        <div style={{ width: '100vw', margin: '20px auto', textAlign: 'center', height: '50px' }}>
          <Link to="/manage/bankcard">
            <button
              name="sbmit"
              style={{
                width: '80vw',
                height: '40px',
                margin: '0 auto',
                backgroundColor: '#1976d2',
                color: '#fff',
                textAlign: 'center',
                marginTop: '50px',
                border: 'none',
                borderRadius: '20px'
              }}
            >
              立即绑卡
            </button>
          </Link>
        </div>

        <Enddiv />
      </div>
    ) : (
      <div className="jh-body">
        <Title name="申请提现" back="/wallet" />

        <div ws-container-id="body">
          <form onSubmit={this.handelSubmit}>
            <div className="banklist" style={{ width: '100vw', marginTop: '20px' }}>
              {bankList}
            </div>
            <div
              className="amount"
              style={{
                margin: '20px 0',
                background: '#eee',
                textIndent: '7px',
                padding: '15px 0 20px 0'
              }}
            >
              <span
                style={{
                  width: '100vw',
                  fontSize: '0.8',
                  display: 'block',
                  textAlign: 'left'
                }}
              >
                申请提现
              </span>
              <input
                type="text"
                name="amount"
                value=""
                placeholder="￥"
                autoComplete="off"
                value={this.state.amount}
                onChange={this.inputAmount}
                style={{
                  width: '100vw',
                  fontSize: '1rem',
                  border: 'none',
                  backgroundColor: '#eee',
                  height: '50px',
                  textIndent: '10px',
                  borderBottom: '1px solid #ddd'
                }}
              />
              <span
                style={{
                  width: '100vw',
                  fontSize: 0.8,
                  display: 'block',
                  textAlign: 'left',
                  height: '40px',
                  lineHeight: '40px'
                }}
              >
                可用余额
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    padding: '0 2px'
                  }}
                >
                  {data.account ? data.account.availableBalance : '0.00'}
                </span>
                元
              </span>
            </div>
            <input
              type="submit"
              name="sbmit"
              disabled
              style={{
                width: '80vw',
                height: '40px',
                margin: '0 auto',
                color: '#fff',
                textAlign: 'center',
                marginTop: '50px',
                border: 'none',
                borderRadius: '20px'
              }}
              value="提交申请"
            />
          </form>
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
)(Withdarw);
