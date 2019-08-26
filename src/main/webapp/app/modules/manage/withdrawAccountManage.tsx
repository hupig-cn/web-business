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
        cityViewerShow: false,
        form_bank: '',
        form_banknum: '',
        form_bankuser: '',
        form_bankmobile: '',
        form_bankicon: '',
        form_banksubbranch: '',
        form_bankaddress: '',
        AUTHORUSER: {},

        cpker_province_selected: '',
        cpker_city_selected: '',
        cpker_area_selected: '',
        // 允许绑卡数量
        allow_bindcard_totals: 4
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
          Axios.spread((cardlist: any, findUserBankcardList: any) => {
            // 检查并纠正服务端数据格式
            cardlist.data = Api.responseParse(cardlist.data, []);
            findUserBankcardList.data = Api.responseParse(findUserBankcardList.data, []);

            // window.console.debug(findUserBankcardList.data.data, cardlist.data.data);

            const response_data = findUserBankcardList.data.data[0];
            that.setState({
              AUTHORUSER: info,
              loading: false,
              progressive: false,
              data: {
                userCardList: response_data['listbank'],
                list_of_bank_support: cardlist.data.data,
                alipay: response_data['alipay'],
                weixin: response_data['wechat'],
                weixin_name: response_data['wechatName'] ? response_data['wechatName'] : '未署名',
                alipay_name: response_data['alipayName'] ? response_data['alipayName'] : '未署名'
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
    let post: object;
    post = {
      // @ts-ignore 中国xxx银行
      banktype: state.form_bank.trim(),
      // @ts-ignore 卡号
      bankcard: Utils.numberValidate(state.form_banknum),
      // @ts-ignore 银行类型icbc
      bankicon: state.form_bankicon.trim(),
      // @ts-ignore 开户姓名
      realname: state.form_bankuser.trim(),
      // @ts-ignore 开户 省 市 区县
      bankcity: [state.cpker_province_selected.trim(), state.cpker_city_selected.trim(), state.cpker_area_selected.trim()],
      // @ts-ignore 开户行地址
      banksubbranch: state.form_banksubbranch.trim(),
      // @ts-ignore 预留电话
      bankphone: Utils.mobileValidate(state.form_bankmobile),
      // @ts-ignore
      userid: state.AUTHORUSER.data.id || 0
    };

    // @ts-ignore
    if (post.userid <= 0) {
      toast.error('操作授权失败,请尝试重新登录');
      window.console.log('用户授权失败');
      // @ts-ignore
    } else if (post.bankcard === false || (post.bankcard.length > 20 || post.bankcard.length < 12)) {
      toast.error('卡号错误');
      window.console.log('卡号错误');
      document.getElementById('banknum').setAttribute('class', 'form-error');
      // @ts-ignore
    } else if (post.realname === '') {
      toast.error('开户姓名错误');
      window.console.log('开户姓名错误');
      document.getElementById('bankuser').setAttribute('class', 'form-error');
      // @ts-ignore
    } else if (post.bankcity[0] === '' || post.bankcity[1] === '' || post.bankcity[2] === '') {
      toast.error('请选择开户市县');
      window.console.log('请选择开户市县');
      document.getElementById('bankaddress').setAttribute('class', 'form-error');
      // @ts-ignore
    } else if (post.banksubbranch === '') {
      toast.error('请填写开户行地址');
      window.console.log('请填写开户行地址');
      document.getElementById('banksubbranch').setAttribute('class', 'form-error');
      // @ts-ignore
    } else if (post.bankphone === false && state.form_bankmobile.replace(/\ /g, '').length > 0) {
      toast.error('手机号码错误');
      window.console.log('手机号码错误');
      document.getElementById('bankmobile').setAttribute('class', 'form-error');
      // @ts-ignore
    } else {
      // @ts-ignore
      if (post.bankphone === false) {
        // @ts-ignore
        post.bankphone = '';
      }
      // @ts-ignore
      post.bankcity = post.bankcity.join(' ');
      // window.console.log(this.state, post);

      Axios.defaults.headers['Content-Type'] = 'application/json; charset=utf-8';
      // @ts-ignore
      Axios.post(this.state.api_createBankcard, post)
        .then(response => {
          toast.success('绑定成功');
          JQ('button[type="submit"]').remove();
          // window.location.href = '/manage/withdrawAccountManage';
          window.location.reload();
        })
        .catch(error => {
          toast.error('绑卡失败，请稍后尝试');
          window.console.log('绑卡失败');
        });
    }
  };
  // 更换开户银行
  changeBank = (e: any) => {
    const banklogoElem = document.getElementById('banklog-viewer');
    if (e.target.value === '') {
      banklogoElem.setAttribute('style', 'display: none');
      e.target.setAttribute('style', 'padding-left: 0px');
    } else {
      const logo = '/content/images/banklogo/' + e.target.value + '.png';
      banklogoElem.setAttribute('src', logo);
      banklogoElem.setAttribute('style', '');
      e.target.setAttribute('style', 'padding-left: 28px');
    }

    this.setState({
      form_bankicon: e.target.value,
      form_bank: e.target.selectedOptions[0].innerText
    });
    JQ('button[name="sbmit"]').removeAttr('disabled');
  };
  // 卡号输入
  changeBanknum = (e: any) => {
    if (/^\d+$/g.test(e.target.value) || e.target.value === '') {
      e.target.removeAttribute('class');
      this.setState({
        form_banknum: e.target.value
      });
    }
  };
  // 手机号码输入
  changeBankMobile = (e: any) => {
    if (/^\d+$/g.test(e.target.value) || e.target.value === '') {
      e.target.removeAttribute('class');
      this.setState({
        form_bankmobile: e.target.value
      });
    }
  };
  // 开户姓名
  changeBankUser = (e: any) => {
    e.target.value = e.target.value
      .replace(/\（/, '(')
      .replace(/\）/, ')')
      .replace(/\―/g, '-')
      .replace(/(\ )+/g, ' ')
      .trim();
    if (/^([\u4e00-\u9fa5]+|\(|\)|[a-zA-Z]|\-|\/)+$/g.test(e.target.value) || e.target.value === '') {
      e.target.removeAttribute('class');
      this.setState({
        form_bankuser: e.target.value
      });
    }
  };
  // 开户行名称( xxxx路支行 )
  changeBankSubbranch = (e: any) => {
    e.target.value = e.target.value
      .replace(/\（/, '(')
      .replace(/\）/, ')')
      .replace(/\―/g, '-');
    if (/^([\u4e00-\u9fa5]+|\(|\)|[a-zA-Z0-9]|\-)+$/g.test(e.target.value) || e.target.value === '') {
      e.target.removeAttribute('class');
      this.setState({
        form_banksubbranch: e.target.value
      });
    }
  };
  // 打开城市选择器
  openCityPickerHtml = (e: any) => {
    // 加载一次省份列表
    // @ts-ignore
    if (Object.prototype.toString.call(this.state.cpker_province) !== '[object Array]') {
      this.getApi('中国', (response: any, selected: any) => {
        window.console.log('== API载入省份列表 ==');
        this.setState({
          cpker_province: response,
          cpker_province_selected: '',
          cpker_city_selected: '',
          cpker_area_selected: '',
          cpker_nav_show: 'province',
          cityViewerShow: true
        });
      });
    } else {
      window.console.log('== Cache载入省份列表 ==');
      this.setState({
        // cpker_province_selected: '',
        // cpker_city_selected: '',
        // cpker_area_selected: '',
        cpker_nav_show: 'province',
        cityViewerShow: true
      });
    }
    return null;
    // this.api_getCityList(0);
  };
  // 关闭城市选择器
  closeCityPickerHtml = (e: any) => {
    this.setState({
      cityViewerShow: false
    });
  };
  getApi = (name: any, func: any) => {
    // tslint:disable-next-line: only-arrow-functions
    // @ts-ignore
    // const that = this;
    const __getList__ = (cityName: any) => {
      // @ts-ignore
      return Axios.get(this.state.api_cityList + (cityName ? cityName : '中国') + '?cacheBuster=' + Math.random());
    };
    // @ts-ignore
    Axios.all([__getList__(name)]).then(
      // @ts-ignore
      // tslint:disable-next-line: only-arrow-functions
      Axios.spread((List: any) => {
        // 检查并纠正服务端数据格式
        List.data = Api.responseParse(List.data, []);
        // window.console.debug('=======110========');
        // window.console.debug(List);

        // 省份排序
        List.data.sort((a: any, b: any) => {
          return a.id * 1 - b.id * 1;
        });

        return func(List.data, name);

        /*this.setState({
          cpker_province: List.data,
          cityViewerShow: true
        });*/
      })
    );
    return null;
  };
  // 设置省份 加载城市列表
  setProvinceAndFetchCityList = (e: any) => {
    this.getApi(e.target.dataset.name, (response: any, selected: any) => {
      window.console.log('== api.city ==');
      this.setState({
        cpker_area: '',
        cpker_city: response,
        cpker_province_selected: selected,
        cpker_city_selected: '',
        cpker_area_selected: '',
        cpker_nav_show: 'city',
        cityViewerShow: true
      });
    });
  };
  // 设置城市 加载区县列表
  setCityAndFetchAreaList = (e: any) => {
    this.getApi(e.target.dataset.name, (response: any, selected: any) => {
      window.console.log('== api.area ==');
      this.setState({
        cpker_area: response,
        cpker_city_selected: selected,
        cpker_area_selected: '',
        cpker_nav_show: 'area',
        cityViewerShow: true
      });
    });
  };
  // 设置区县 关闭城市选择器
  setAreaAndHidePicker = (e: any) => {
    window.console.log('== api address complete ==');
    document.getElementById('bankaddress').removeAttribute('class');
    this.setState({
      cpker_area_selected: e.target.dataset.name,
      cityViewerShow: false
    });
  };
  // 切换选择器的 省市县导航
  switchCityOptions = (e: any) => {
    // @ts-ignore
    if (this.state.cpker_nav_show !== e.target.dataset.nav) {
      this.setState({
        cpker_nav_show: e.target.dataset.nav
      });
    }
  };
  // 绑卡
  bindNewCard = (e: any) => {
    this.setState({
      bind_newcard_view: 1
    });
  };
  // 解绑
  siwtchUnbindCardView = (e: any) => {
    // @ts-ignore
    const bindActive = !(this.state.unBindcard || 0);
    this.setState({
      unBindcard: bindActive
    });
  };
  // 用户删除银行卡
  unbindBankcard = (e: any) => {
    // @ts-ignore
    const removeId = e.target.dataset.id;
    const state = this.state;
    // @ts-ignore
    Axios.post(state.api_deleteBankcard + removeId, { bankcardId: removeId, userid: state.AUTHORUSER.data.id || 0 })
      .then(response => {
        toast.success('解绑成功');
        window.location.reload();
      })
      .catch(error => {
        toast.error('服务异常，请稍后尝试');
        window.console.log('接口异常，请稍后尝试');
      });
  };
  closeBindNewCard = (e: any) => {
    this.setState({
      bind_newcard_view: 0,
      cityViewerShow: false
    });
  };
  render() {
    const state = this.state;
    // @ts-ignore
    const response_userCardList = state.data.userCardList;
    // @ts-ignore
    const state_unBindcard = state.unBindcard;
    // @ts-ignore
    if (state.progressive === true) {
      return (
        <div className="jh-personal">
          <Title name="提现账号管理" back="/manage" />
          <ShowBodyPlaceholderHtml />
        </div>
      );
    }

    const submitBtn = (sstate: any) => {
      // @ts-ignore
      const cpker_selected =
        sstate.cpker_province_selected !== '' && sstate.cpker_city_selected !== '' && sstate.cpker_area_selected !== '';
      // @ts-ignore
      if (
        sstate.form_banknum !== '' &&
        sstate.form_bank !== '' &&
        sstate.form_bankuser !== '' &&
        cpker_selected &&
        sstate.form_banksubbranch !== ''
      ) {
        return (
          <button type="submit" name="sbmit" style={{ backgroundColor: '#1976d2', outline: 'none' }}>
            {' 立即绑卡 '}
          </button>
        );
      } else {
        return (
          <button type="submit" name="sbmit" style={{ outline: 'none' }} disabled>
            {' 立即绑卡 '}
          </button>
        );
      }
    };

    // 卡片开始
    // @ts-ignore
    const userCardList = response_userCardList.map((item: object, index: number) => (
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

        <div
          className={
            // @ts-ignore
            'bkaccount' + (state_unBindcard ? ' unbind-active' : '')
          }
        >
          {'**** '}
          {// @ts-ignore
          item.banknum ? item.banknum.substr(-4) : item.banknum}
        </div>

        <div
          onClick={this.unbindBankcard}
          data-id={
            // @ts-ignore
            item.id
          }
          className={'bkunbind' + (state_unBindcard ? ' unbind-active' : '')}
        >
          删除
        </div>
      </div>
    ));
    // 卡片结束

    // ===============为添加银行卡时的城市选择器准备数据===============
    // @ts-ignore
    // if (response_userCardList.length < state.allow_bindcard_totals) {
    // }
    // @ts-ignore
    const cpker_province = this.state.cpker_province || [];
    // @ts-ignore
    const cpker_province_selected = this.state.cpker_province_selected || '省辖市';
    // @ts-ignore
    const cpker_city = this.state.cpker_city || [];
    // @ts-ignore
    const cpker_city_selected = this.state.cpker_city_selected || '城市';
    // @ts-ignore
    const cpker_area = this.state.cpker_area || [];
    // @ts-ignore
    const cpker_area_selected = this.state.cpker_area_selected || '区县';
    // @ts-ignore 默认显示省份列表
    const cpker_nav_show = this.state.cpker_nav_show || 'province';
    // 开户城市选择器
    const cityPickerHtml = (e: any) => (
      <div ws-container-id="cityPicker" id="cityPicker">
        <div className="cityPicker-mask" />
        <div className="cityPicker-body">
          <div className="_citys">
            <span title="关闭" id="cColse" onClick={this.closeCityPickerHtml}>
              x
            </span>
            <ul id="_citysheng" className="_citys0">
              <li
                onClick={this.switchCityOptions}
                className={cpker_nav_show === 'province' ? 'citySel' : ''}
                id="sheng"
                data-nav="province"
              >
                {cpker_province_selected}
              </li>
              <li onClick={this.switchCityOptions} className={cpker_nav_show === 'city' ? 'citySel' : ''} id="shi" data-nav="city">
                {cpker_city_selected}
              </li>
              <li onClick={this.switchCityOptions} className={cpker_nav_show === 'area' ? 'citySel' : ''} id="xian" data-nav="area">
                {cpker_area_selected}
              </li>
            </ul>
            <div style={cpker_nav_show !== 'province' ? { display: 'none' } : {}} id="_citys0" className="_citys1">
              {// 省份
              cpker_province.map((province: any, index: any) => (
                <a
                  key={index + 1}
                  data-id={province.id}
                  data-name={province.name}
                  className={cpker_province_selected === province.name ? 'selected' : ''}
                  onClick={this.setProvinceAndFetchCityList}
                >
                  {province.name}
                </a>
              ))}
            </div>
            <div style={cpker_city.length === 0 || cpker_nav_show !== 'city' ? { display: 'none' } : {}} id="_citys1" className="_citys1">
              {// 城市
              cpker_city.map((city: any, index: any) => (
                <a
                  key={index + 1}
                  data-id={city.id}
                  data-name={city.name}
                  className={cpker_city_selected === city.name ? 'selected' : ''}
                  onClick={this.setCityAndFetchAreaList}
                >
                  {city.name}
                </a>
              ))}
            </div>
            <div style={cpker_area.length === 0 || cpker_nav_show !== 'area' ? { display: 'none' } : {}} id="_citys2" className="_citys1">
              {// 区县
              cpker_area.map((area: any, index: any) => (
                <a
                  key={index + 1}
                  data-id={area.id}
                  data-name={area.name}
                  className={cpker_area_selected === area.name ? 'selected' : ''}
                  onClick={this.setAreaAndHidePicker}
                >
                  {area.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
    // ===============添加银行卡时的城市选择器数据 准备完成===============

    return (
      <div className="jh-personal">
        <Title name="提现账号管理" back="/manage" />
        <div ws-container-id="withdrawAccountManage">
          <div className="ws-main-weixin hide">
            <div className="logo">
              <img src="./content/images/banklogo/weixin.svg" />
            </div>
            <Link className="link" to="/manage/bindWithdrawAccount">
              {// @ts-ignore
              this.state.data.weixin ? (
                // @ts-ignore
                <div>{this.state.data.weixin + '（' + this.state.data.weixin_name + '）'}</div>
              ) : (
                <div className="unactive">您还没有绑定微信号</div>
              )}
            </Link>
          </div>
          <div className="ws-main-alipay">
            <div className="logo">
              <img src="./content/images/banklogo/alipay.svg" />
            </div>

            <Link className="link" to="/manage/bindWithdrawAccount">
              {// @ts-ignore
              this.state.data.alipay ? (
                // @ts-ignore
                <div>{this.state.data.alipay + '（' + this.state.data.alipay_name + '）'}</div>
              ) : (
                <div className="unactive">您还没有绑定支付宝号</div>
              )}
            </Link>
          </div>

          {// @ts-ignore
          response_userCardList.length > 0 ? (
            <div className="ws-mybank-totals">
              <div>
                {'我的银行卡 ' +
                  // @ts-ignore
                  response_userCardList.length +
                  ' / ' +
                  state.allow_bindcard_totals}
              </div>
              <div className="">
                {// @ts-ignore
                response_userCardList.length < state.allow_bindcard_totals ? <a onClick={this.bindNewCard}>添加</a> : null}
                {response_userCardList.length > 1 && !state_unBindcard ? (
                  <a onClick={this.siwtchUnbindCardView}>解绑</a>
                ) : response_userCardList.length > 1 && state_unBindcard ? (
                  <a onClick={this.siwtchUnbindCardView}>退出</a>
                ) : null}
              </div>
            </div>
          ) : (
            ''
          )}
          {userCardList}
          {// @ts-ignore
          state.bind_newcard_view ? (
            <div>
              <div className="ws-add-bankcard-mask" />
              <div className="ws-add-bankcard-title">
                添加银行卡
                <span title="关闭" onClick={this.closeBindNewCard}>
                  {' '}
                  ×{' '}
                </span>
              </div>
            </div>
          ) : // @ts-ignore
          response_userCardList.length === 0 ? (
            <div className="ws-main-nobankcard-notice">
              <div className="logo">
                <img src="./content/images/banklogo/bankcard.svg" />
              </div>
              <div className="link" onClick={this.bindNewCard}>
                <div className="unactive">您还没有绑定银行卡?</div>
              </div>
            </div>
          ) : (
            ' '
          )}
          {// @ts-ignore
          state.bind_newcard_view ? (
            <div className="ws-add-bankcard-form">
              <form method="post" onSubmit={this.handelSubmit}>
                <div>
                  <div className="ws-add-bankcard-form-titles">开户银行 *</div>
                  <div className="ws-add-bankcard-form-input">
                    <select
                      name="uname"
                      id="uname"
                      // @ts-ignore
                      value={state.form_bankicon}
                      onChange={this.changeBank}
                    >
                      <option key="SB000001" disabled value="">
                        {' 请选择开户银行 '}
                      </option>
                      {// @ts-ignore
                      state.data.list_of_bank_support.map((bank: any, index: any) => (
                        <option key={index} value={bank.logo}>
                          {bank.bankname}
                        </option>
                      ))}
                    </select>
                    <img id="banklog-viewer" src="" />
                  </div>
                </div>
                <div />

                <div>
                  <div className="ws-add-bankcard-form-titles">银行账号 *</div>
                  <div className="ws-add-bankcard-form-input">
                    <input
                      type="text"
                      autoComplete="off"
                      name="banknum"
                      id="banknum"
                      // @ts-ignore
                      minLength="12"
                      // @ts-ignore
                      maxLength="22"
                      placeholder="请输入银行卡号"
                      // @ts-ignore
                      value={state.form_banknum}
                      onChange={this.changeBanknum}
                    />
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
                      id="bankuser"
                      placeholder="如: 张小筱"
                      // @ts-ignore
                      value={state.form_bankuser}
                      onChange={this.changeBankUser}
                    />
                  </div>
                </div>
                <div />

                <div>
                  <div className="ws-add-bankcard-form-titles">开户市县 *</div>
                  <div className="ws-add-bankcard-form-input">
                    <input
                      type="text"
                      autoComplete="off"
                      name="bankaddress"
                      id="bankaddress"
                      placeholder="如: 北京市 海淀区"
                      readOnly={!false}
                      // @ts-ignore
                      value={[state.cpker_province_selected, state.cpker_city_selected, state.cpker_area_selected].join(' ').trim()}
                      onClick={this.openCityPickerHtml}
                    />
                  </div>
                </div>
                <div />

                <div>
                  <div className="ws-add-bankcard-form-titles">开户行 *</div>
                  <div className="ws-add-bankcard-form-input">
                    <input
                      type="text"
                      autoComplete="off"
                      name="banksubbranch"
                      id="banksubbranch"
                      placeholder="如: 北京农商银行上地支行"
                      maxLength={42}
                      // @ts-ignore
                      value={state.form_banksubbranch}
                      onChange={this.changeBankSubbranch}
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
                      id="bankmobile"
                      placeholder="银行预留电话号码，非必填项"
                      // @ts-ignore
                      value={state.form_bankmobile}
                      onChange={this.changeBankMobile}
                    />
                  </div>
                </div>
                <div />

                <div>{submitBtn(state)}</div>
              </form>
            </div>
          ) : (
            ''
          )}
        </div>
        {// @ts-ignore
        this.state.cityViewerShow ? cityPickerHtml(event) : ''}
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
