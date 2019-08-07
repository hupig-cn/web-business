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
import './business.scss';

export interface IWithdrwaProp extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export class Withdarw extends React.Component<IWithdrwaProp> {
  constructor(props) {
    super(props);
    // 初始化接口数据结构
    this.state = JQ.extend(true, { bankcard: '' }, Api.tsxWithdraw.data, Api.tsxWithdraw);

    // 监听点击项，执行高亮样式
    let __backcard_ClickListen__;
    // 屏蔽烦人的提示： Identifier '__backcard_ClickListen__' is never reassigned; use 'const' instead of 'let'.
    __backcard_ClickListen__ = 0;
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

  api_getLocalConfig = () => {
    // TODO 注意此处路径层级
    // Axios 默认配置了根路径为：www.xxx.com/services
    // 故此处使用相对路径来拼接真实路径，最终为：www.xxx.com/content/doc/config.json
    // @ts-ignore
    const response = Axios.get('../content/doc/config.json');
    return response;
  };

  // TODO 上拉加载组件
  buildStablePage = () => {
    // tslint:disable-next-line: no-this-assignment
    const that = this;
    // @ts-ignore
    this.props.getSessionRE().then((val: any) => {
      val.payload.then((info: any) => {
        info.config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        Axios.defaults.headers = info.config.headers;
        // Axios.defaults.baseURL = '';
        // @ts-ignore
        Axios.all([this.api_findUserBalance(info.data.id), this.api_findAllUserBankCard(info.data.id), this.api_getLocalConfig()]).then(
          // @ts-ignore
          // tslint:disable-next-line: only-arrow-functions
          Axios.spread((findUserBalance, findAllUserBankCard, localConfig) => {
            // 检查并纠正服务端数据格式
            findAllUserBankCard.data = Api.responseParse(findAllUserBankCard.data, []);
            findUserBalance.data = Api.responseParse(findUserBalance.data, {});

            window.console.debug(findAllUserBankCard.data.data, findUserBalance.data.data, localConfig);

            that.setState({
              AUTHORUSER: info,
              loading: false,
              progressive: false,
              data: {
                account: findUserBalance.data.data,
                bank: findAllUserBankCard.data.data,
                __local_config__: localConfig.data
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
      Axios.all([Axios.get(this.state.api_debug), this.api_getLocalConfig()]).then(
        // @ts-ignore
        // tslint:disable-next-line: only-arrow-functions
        Axios.spread((debug_response, localConfig) => {
          debug_response['data']['data']['__local_config__'] = localConfig.data.data;
          this.setState({ loading: false, progressive: false, data: debug_response.data.data });
        })
      );
    } else {
      // @ts-ignore
      this.buildStablePage();
    }
  }

  handelSubmit = (e: any) => {
    e.preventDefault();
    const state = this.state;
    // 验证可提现金额
    // @ts-ignore
    const ab_balance = parseFloat(state.data.account.availableBalance.replace(/\ |,/g, '')) * 1;

    let post;
    post = {
      // @ts-ignore
      bankcardid: Utils.numberValidate(state.bankcard),
      // 1:银行卡/ 2:微信/ 3:支付宝
      gatheringway: 1,
      __doc_gatheringway__: '前端预定义的收款方式： 1:银行卡/ 2:微信/ 3:支付宝',
      // @ts-ignore
      withdrawalamount: Utils.priceValidate(state.amount),
      // @ts-ignore
      userid: state.AUTHORUSER.data.id || 0, // 当前登录用户ID
      alipay: '',
      weixin: ''
    };

    // 处理微信、支付宝收款选择器
    if (state.bankcard.indexOf('weixin_') === 0) {
      post['gatheringway'] = 2;
      post['weixin'] = state.bankcard.replace(/weixin_|\ /g, '');
    }
    if (state.bankcard.indexOf('alipay_') === 0) {
      post['gatheringway'] = 3;
      post['alipay'] = state.bankcard.replace(/alipay_|\ /g, '');
    }

    if (post.userid <= 0) {
      toast.error('操作授权失败,请尝试重新登录');
      window.console.log('用户授权失败');
    } else if ((post.bankcardid <= 0 || !post.bankcardid) && post.alipay === '' && post.weixin === '') {
      toast.info('请选择收款账户');
      window.console.log('请选择收款账户');
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
          JQ('input[type="submit"]').attr('disabled', 'disabled');
          toast.success('已申请成功，请等待审核');
          JQ('input[type="submit"]').remove();
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
      ? JQ('input[type="submit"]')
          .css('background', 'auto')
          .attr('disabled', 'disabled')
      : JQ('input[type="submit"]')
          .css('background', '#1976d2')
          .removeAttr('disabled');
  };

  changeBank = (e: any) => {
    this.__backcard_ClickListen__ = e.target.value;
    this.setState({
      bankcard: e.target.value,
      lockSbmitBtn: false
    });
  };

  inputAmount = (e: any) => {
    // @ts-ignore
    const value = Utils.priceValidate(e.target.value);
    // @ts-ignore
    const ab_balance = parseFloat(this.state.data.account.availableBalance.replace(/\ |,/g, '')) * 1;
    // tslint:disable-next-line: no-console
    // console.log(typeof value, value);

    this.setState({
      amount: value > 0 ? value : 0,
      lockSbmitBtn: false
    });
  };

  render() {
    // @ts-ignore
    const data = this.state.data;
    // @ts-ignore
    let _bankList_ = [];
    // @ts-ignore
    let bankList = [];

    // 默认当做系统关闭提现通道（即支付宝，微信，银行卡提现都关闭了）
    let withdrawType;
    withdrawType = false;

    if (this.state.progressive === false) {
      // 系统开启支付宝提现
      if (data.__local_config__.withdraw_type.alipay) {
        // 系统已开启提现通道
        withdrawType = true;

        // 构建微信,支付宝队列
        if (data.alipay !== undefined && data.alipay) {
          _bankList_.push({
            id: 'alipay_' + data.alipay,
            logo: 'alipay',
            bankname: data.alipay,
            bankuser: '',
            banknum: false
          });
        }
      }

      // 系统开启微信提现
      if (data.__local_config__.withdraw_type.weixin) {
        // 系统已开启提现通道
        withdrawType = true;
        if (data.weixin !== undefined && data.weixin) {
          _bankList_.push({
            id: 'weixin_' + data.weixin,
            logo: 'weixin',
            bankname: data.weixin,
            bankuser: '',
            banknum: false
          });
        }
      }
      // 系统开启银行卡提现
      if (data.__local_config__.withdraw_type.bankcard) {
        // 前端逻辑合并支付宝、微信、银行卡
        _bankList_ = _bankList_.concat(data.bank);
        // 系统已开启提现通道
        withdrawType = true;
      }
      bankList =
        _bankList_.length === 0
          ? []
          : _bankList_.map((item: object) => (
              <label
                onClick={this.changeBank}
                // @ts-ignore
                htmlFor={'bankcard_' + item.id}
                // @ts-ignore
                key={item.id}
              >
                <ul
                  style={{
                    backgroundColor: this.__backcard_ClickListen__ === item.id + '' ? '#eee' : '#FFF'
                  }}
                >
                  <li>
                    <img src={'./content/images/banklogo/' + item.logo + '.png'} />
                    {// @ts-ignore
                    item.bankname + (item.banknum ? '（尾号 ' + item.banknum + '）' : '') + item.bankuser}
                  </li>
                  <li>
                    <input
                      // @ts-ignore
                      id={'bankcard_' + item.id}
                      type="radio"
                      name="bankcard"
                      // @ts-ignore
                      value={item.id}
                    />
                  </li>
                </ul>
              </label>
            ));
    }
    // @ts-ignore
    return this.state.progressive === true ? (
      <div className="jh-body">
        <Title name="申请提现" back="/wallet" />
        <ShowBodyPlaceholderHtml />
        <Enddiv />
      </div>
    ) : !withdrawType ? (
      <div className="jh-body">
        <Title name="申请提现" back="/wallet" />
        <div ws-container-id="ws-withdraw-checkout">
          <div className="nobankcard-info"> 提现通道维护中 </div>
        </div>
        <Enddiv />
      </div>
    ) : bankList.length === 0 ? (
      <div className="jh-body">
        <Title name="申请提现" back="/wallet" />
        <div ws-container-id="ws-withdraw-checkout">
          <div className="nobankcard-info"> 您还没有绑定提现账号 </div>

          <div className="goto-bind">
            <Link to="/manage/withdrawAccountManage">
              <button name="sbmit"> 立即绑卡 </button>
            </Link>
          </div>
        </div>
        <Enddiv />
      </div>
    ) : (
      <div className="jh-body">
        <Title name="申请提现" back="/wallet" />

        <div ws-container-id="ws-withdraw-checkout">
          <form onSubmit={this.handelSubmit}>
            <div className="banklist">{bankList}</div>
            <div className="amount">
              <span> 申请提现 </span>
              <input
                type="text"
                name="amount"
                value=""
                placeholder="￥"
                autoComplete="off"
                // @ts-ignore
                value={this.state.amount}
                onChange={this.inputAmount}
              />
              <span>
                可用余额<i>{data.account ? data.account.availableBalance : '0.00'}</i>元
              </span>
            </div>

            {// @ts-ignore
            this.state.lockSbmitBtn ? (
              <input type="submit" name="sbmit" disabled value="提交申请" />
            ) : (
              <input
                type="submit"
                name="sbmit"
                style={{
                  backgroundColor: '#1976d2'
                }}
                value="提交申请"
              />
            )}
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
