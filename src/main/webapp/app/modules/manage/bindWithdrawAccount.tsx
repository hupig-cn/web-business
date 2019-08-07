// 管理模块
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getSession, getSessionRE } from 'app/shared/reducers/authentication';
import Title from 'app/modules/public/title';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import JQ from 'jquery';

import Enddiv from '../../shared/menu/enddiv';

// 专用接口请求模块
import { Axios, Api, ShowBodyPlaceholderHtml, DEBUG as RequestDebug } from 'app/request';
import Utils from 'app/utils';
import './withdrawAccountManage.scss';

export interface IManageProp extends StateProps, DispatchProps {}

export class BindManage extends React.Component<IManageProp> {
  constructor(props) {
    super(props);
    // 初始化接口数据结构
    this.state = JQ.extend(
      true,
      {},
      {
        form_alipayAccount: '',
        form_weixinAccount: '',
        form_agreement_checkbox: false,
        AUTHORUSER: { data: { id: 0 } }
      },
      Api.tsxBindWithdrawAccount
    );
  }

  // 查询用户线上收款账号
  api_findUserAlipayWinxinAccount = (userid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_findUserAlipayWinxinAccount + userid);
    return response;
  };

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

        Axios.all([this.api_findUserAlipayWinxinAccount(info.data.id)]).then(
          // @ts-ignore
          // tslint:disable-next-line: only-arrow-functions
          Axios.spread((findUserAlipayWinxinAccount: any) => {
            // 检查并纠正服务端数据格式
            findUserAlipayWinxinAccount.data = Api.responseParse(findUserAlipayWinxinAccount.data, []);

            window.console.debug(findUserAlipayWinxinAccount.data.data);

            that.setState({
              AUTHORUSER: info,
              loading: false,
              progressive: false,
              data: {
                withdrawAccount: findUserAlipayWinxinAccount.data.data
              }
            });
          })
        );
      });
    });
  };

  componentDidMount() {
    // @ts-ignore
    this.buildStablePage();
  }

  // 提交绑卡
  handelSubmit = (e: any) => {
    e.preventDefault();
    const state = this.state;
    const post = {
      // @ts-ignore
      alipay: state.form_alipayAccount.trim(),
      // @ts-ignore
      weixin: state.form_weixinAccount.trim(),
      // @ts-ignore
      userid: state.AUTHORUSER.data.id || 0
    };
    // TODO 账号未发生变化，直接返回成功
    if (
      post.alipay === state.data.withdrawAccount.alipay &&
      post.weixin === state.data.withdrawAccount.weixin &&
      post.form_agreement_checkbox === true
    ) {
      toast.success('绑定成功');
      JQ('button[type="submit"]').remove();
      return false;
    }

    if (post.userid <= 0) {
      toast.error('操作授权失败,请尝试重新登录');
      window.console.log('用户授权失败');
      // @ts-ignore
    } else if (post.weixin === '') {
      toast.error('请填写真实微信账号');
      window.console.log('请填写真实微信账号');
      // @ts-ignore
    } else if (post.alipay === '') {
      toast.error('请填写真实支付宝账号');
      window.console.log('请填写真实支付宝账号');
    } else if (post.form_agreement_checkbox === false) {
      toast.error('请确认协议项');
      window.console.log('请确认协议项');
    } else {
      Axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8';
      // @ts-ignore
      Axios.post(this.state.api_createWithdrawAccount, post)
        .then(response => {
          toast.success('绑定成功');
          JQ('button[type="submit"]').remove();
        })
        .catch(error => {
          toast.error('绑定失败，请稍后尝试');
          window.console.log('绑卡失败');
        });
    }
  };

  changeAlipayAccount = (e: any) => {
    if (/^\w+$/g.test(e.target.value) || e.target.value === '') {
      this.setState({
        form_alipayAccount: e.target.value.replace(/\ /g, '')
      });
    }
  };
  changeWeixinAccount = (e: any) => {
    if (/^\w+$/g.test(e.target.value) || e.target.value === '') {
      this.setState({
        form_weixinAccount: e.target.value.replace(/\ /g, '')
      });
    }
  };
  changeAgreementConfirm = (e: any) => {
    this.setState({
      form_agreement_checkbox: !this.state.form_agreement_checkbox
    });
  };
  render() {
    const state = this.state;
    // @ts-ignore
    if (state.progressive === true) {
      return (
        <div className="jh-personal">
          <Title name="移动支付收款账号" back="/manage/withdrawAccountManage" />
          <ShowBodyPlaceholderHtml />
        </div>
      );
    }

    try {
      // @ts-ignore
      if (state.form_alipayAccount !== '' && state.form_weixinAccount !== '' && state.form_agreement_checkbox === true) {
        JQ('button[type="submit"]')
          .css('background', '#1976d2')
          .removeAttr('disabled');
      } else {
        JQ('button[type="submit"]')
          .css('background', '')
          .attr('disabled', 'disabled');
      }
    } catch (e) {
      window.console.log(e);
    }

    return (
      <div className="jh-personal">
        <Title name="移动支付收款账号" back="/manage/withdrawAccountManage" />
        <div ws-container-id="bindWithdrawAccount">
          <form method="post" onSubmit={this.handelSubmit}>
            <div className="ws-main-weixin">
              <div className="label"> 微信号 </div>
              <div className="input">
                <input
                  type="text"
                  placeholder="请准确填写微信账号"
                  value={this.state.form_weixinAccount}
                  name="alipayAccount"
                  onChange={this.changeWeixinAccount}
                  maxLength="24"
                />
              </div>
              <div className="info">?</div>
            </div>

            <div className="ws-main-alipay">
              <div className="label"> 支付宝号 </div>
              <div className="input">
                <input
                  type="text"
                  placeholder="请准确填写支付宝账号"
                  value={this.state.form_alipayAccount}
                  name="alipayAccount"
                  onChange={this.changeAlipayAccount}
                  maxLength="24"
                />
              </div>
              <div className="info">?</div>
            </div>

            <div className="agreement">
              {this.state.form_agreement_checkbox ? (
                <input
                  type="checkbox"
                  id="form_agreement"
                  value="1"
                  name="agreement"
                  checkbox="checkbox"
                  onChange={this.changeAgreementConfirm}
                />
              ) : (
                <input type="checkbox" id="form_agreement" value="1" name="agreement" onChange={this.changeAgreementConfirm} />
              )}
              <label htmlFor="form_agreement">我已知晓并自行承担因错误填写收款账号导致提现失败的后果</label>
            </div>

            <div>
              <button type="submit" disabled name="sbmit">
                确定
              </button>
            </div>
          </form>
        </div>

        <Enddiv />
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
)(BindManage);
