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

export class Manage extends React.Component<IManageProp> {
  constructor(props) {
    super(props);
    // 初始化接口数据结构
    this.state = JQ.extend(
      true,
      {},
      {
        form_bank: '',
        form_banknum: '',
        form_bankuser: '',
        form_bankmobile: '',
        form_bankicon: '',
        AUTHORUSER: {}
      },
      Api.tsxBankcard
    );
  }

  // 查询用户银行卡列表
  api_findUserBankcardList = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_findUserBankcardList + shopid);
    return response;
  };

  // 查询所有银行卡信息
  api_cardlist = () => {
    // @ts-ignore
    const response = Axios.get(this.state.api_cardlist);
    return response;
  };

  // 创建银行卡信息
  api_createBankcard = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_createBankcard + shopid);
    return response;
  };
  // 用户删除银行卡
  api_deleteBankcard = (shopid: number) => {
    // @ts-ignore
    const response = Axios.get(this.state.api_deleteBankcard + shopid);
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
        Axios.all([this.api_cardlist(), this.api_findUserBankcardList(info.data.id)]).then(
          // @ts-ignore
          // tslint:disable-next-line: only-arrow-functions
          Axios.spread((cardlist, findUserBankcardList) => {
            // 检查并纠正服务端数据格式
            cardlist.data = Api.responseParse(cardlist.data, []);
            findUserBankcardList.data = Api.responseParse(findUserBankcardList.data, []);

            window.console.debug(findUserBankcardList.data.data, cardlist.data.data);

            that.setState({
              AUTHORUSER: info,
              loading: false,
              progressive: false,
              data: {
                userCardList: findUserBankcardList.data.data,
                list_of_bank_support: cardlist.data.data
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
          // TODO 平台支持的提现银行
          response.data.data['list_of_bank_support'] = [{ logo: 'icbc', name: '中国工商银行', status: 1 }];
          response.data.data['userCardList'] = response.data.data['cardlist'];
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

  // 提交绑卡
  handelSubmit = (e: any) => {
    e.preventDefault();
    const state = this.state;
    const post = {
      // @ts-ignore
      bankphone: Utils.mobileValidate(state.form_bankmobile),
      // @ts-ignore
      bankcard: Utils.numberValidate(state.form_banknum),
      // @ts-ignore
      banktype: state.form_bank.trim(),
      // @ts-ignore
      bankicon: state.form_bankicon.trim(),
      // @ts-ignore
      realname: state.form_bankuser.trim(),
      // @ts-ignore
      userid: state.AUTHORUSER.data.id || 0
    };

    if (post.userid <= 0) {
      toast.error('操作授权失败,请尝试重新登录');
      window.console.log('用户授权失败');
      // @ts-ignore
    } else if (post.bankcode === '') {
      toast.error('开户姓名错误');
      window.console.log('开户姓名错误');
      // @ts-ignore
    } else if (post.bankphone === false && state.form_bankmobile.length > 0) {
      toast.error('手机号码错误');
      window.console.log('手机号码错误');
    } else if (post.bankcard === false || (post.bankcard.length > 20 || post.bankcard.length < 12)) {
      toast.error('卡号错误');
      window.console.log('卡号错误');
    } else {
      if (post.bankphone === false) {
        post.bankphone = '';
      }
      Axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8';
      // @ts-ignore
      Axios.post(this.state.api_createBankcard, post)
        .then(response => {
          toast.success('绑定成功');
          JQ('button[type="submit"]').remove();
        })
        .catch(error => {
          toast.error('绑卡失败，请稍后尝试');
          window.console.log('绑卡失败');
        });
    }
  };

  changeBank = (e: any) => {
    const banklogoElem = document.getElementById('banklog-viewer');
    if (e.target.value === '') {
      banklogoElem.setAttribute('style', 'display: none');
    } else {
      const logo = '/content/images/banklogo/' + e.target.value + '.png';
      banklogoElem.setAttribute('src', logo);
      banklogoElem.setAttribute('style', 'dislpay: block');
    }

    this.setState({
      form_bankicon: e.target.value,
      form_bank: e.target.selectedOptions[0].innerText
    });
    JQ('button[name="sbmit"]').removeAttr('disabled');
  };
  changeBanknum = (e: any) => {
    if (/^\d+$/g.test(e.target.value) || e.target.value === '') {
      this.setState({
        form_banknum: e.target.value
      });
    }
  };
  changeBankMobile = (e: any) => {
    if (/^\d+$/g.test(e.target.value) || e.target.value === '') {
      this.setState({
        form_bankmobile: e.target.value
      });
    }
  };
  changeBankUser = (e: any) => {
    this.setState({
      form_bankuser: e.target.value
    });
  };

  render() {
    const state = this.state;
    // @ts-ignore
    if (state.progressive === true) {
      return (
        <div className="jh-personal">
          <Title name="提现账号管理" back="/manage" />
          <ShowBodyPlaceholderHtml />
        </div>
      );
    }

    try {
      // @ts-ignore
      if (state.form_banknum !== '' && state.form_bank !== '' && state.form_bankuser !== '') {
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

    {
      /* 卡片开始 */
    }
    // @ts-ignore
    const userCardList = state.data.userCardList.map((item: object, index: number) => (
      <div key={index + 1} className="ws-bankcard-item card">
        <div className="bklogo">
          <img
            // @ts-ignore
            src={'./content/images/banklogo/' + item.logo + '.png'}
            style={{ width: '50%' }}
          />
        </div>

        <div className="bkinfo">
          {
            // @ts-ignore
            item.bankname
          }
          <br />
          {
            // @ts-ignore
            item.bankuser
          }
        </div>

        <div className="bkaccount">
          {'**** '}
          {// @ts-ignore
          item.banknum.substr(-4)}
        </div>
      </div>
    ));
    {
      /* 卡片结束 */
    }

    return (
      <div className="jh-personal">
        <Title name="提现账号管理" back="/manage" />

        {/* <RequestLoadingWait loading={this.state.loading} /> */}

        <div ws-container-id="withdrawAccountManage">
          <div className="ws-main-weixin">
            <div className="logo">
              <img src="./content/images/banklogo/weixin.svg" />
            </div>
            <Link className="link" to="/manage/bindWithdrawAccount">
              <div className="unactive">您还没有绑定微信号</div>
            </Link>
          </div>
          <div className="ws-main-alipay">
            <div className="logo">
              <img src="./content/images/banklogo/alipay.svg" />
            </div>

            <Link className="link" to="/manage/bindWithdrawAccount">
              <div className="unactive">您还没有绑定支付宝号</div>
            </Link>
          </div>
          <div className="ws-bank-tool">
            <div>
              <Link to="">绑定</Link>
              <Link
                // @ts-ignore
                to=""
              >
                解绑
              </Link>
            </div>
          </div>
          {// @ts-ignore
          state.data.userCardList.length > 0 ? (
            <div className="ws-mybank-totals">
              {'我的银行卡 '}
              {
                // @ts-ignore
                state.data.userCardList.length
              }
              {' / 4'}
            </div>
          ) : (
            ''
          )}
          {userCardList}
          {// @ts-ignore
          state.data.userCardList.length > 0 && state.data.userCardList.length < 4 ? (
            <div className="ws-add-bankcard-title">添加卡片</div>
          ) : // @ts-ignore
          state.data.userCardList.length === 0 ? (
            <div className="ws-no-bankcard-notice">您还没有绑定银行卡 ?</div>
          ) : (
            ' '
          )}{' '}
          {// @ts-ignore
          state.data.userCardList.length < 4 ? (
            <div className="ws-add-bankcard-form">
              <form method="post" onSubmit={this.handelSubmit}>
                <div>
                  <div className="ws-add-bankcard-form-titles">开户银行 *</div>
                  <div className="ws-add-bankcard-form-input">
                    <select
                      name="uname"
                      defaultValue="SB000001"
                      // @ts-ignore
                      value={state.form_bankicon}
                      onChange={this.changeBank}
                    >
                      <option
                        key="SB000001"
                        value=""
                        // @ts-ignore
                      >
                        请选择
                      </option>
                      {// @ts-ignore
                      state.data.list_of_bank_support.map((bank, index) => (
                        <option key={index} value={bank.logo}>
                          {bank.bankname}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div />

                <div>
                  <div className="ws-add-bankcard-form-titles">银行账号 *</div>
                  <div className="ws-add-bankcard-form-input">
                    <input
                      style={{
                        textIndent: '40px'
                      }}
                      type="text"
                      autoComplete="off"
                      name="banknum"
                      // @ts-ignore
                      minLength="12"
                      // @ts-ignore
                      maxLength="22"
                      // @ts-ignore
                      value={state.form_banknum}
                      onChange={this.changeBanknum}
                    />
                    <img id="banklog-viewer" src="" />
                  </div>
                </div>
                <div />

                <div>
                  <div className="ws-add-bankcard-form-titles">开户姓名 *</div>
                  <div className="ws-add-bankcard-form-input">
                    <input
                      type="text"
                      autoComplete="off"
                      name="bankuser"
                      // @ts-ignore
                      value={state.form_bankuser}
                      onChange={this.changeBankUser}
                    />
                  </div>
                </div>
                <div />

                <div>
                  <div className="ws-add-bankcard-form-titles">预留电话 &nbsp;</div>
                  <div className="ws-add-bankcard-form-input">
                    <input
                      type="text"
                      autoComplete="off"
                      name="bankmobile"
                      // @ts-ignore
                      value={state.form_bankmobile}
                      onChange={this.changeBankMobile}
                    />
                  </div>
                </div>
                <div />

                <div>
                  <button type="submit" name="sbmit">
                    立即绑卡
                  </button>
                </div>
              </form>
            </div>
          ) : (
            ''
          )}
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
)(Manage);
