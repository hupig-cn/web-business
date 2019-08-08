// 是否开启网络请求时的页面同步等待效果
import React from 'react';
import axios from 'axios';
import { RepeatOneSharp } from '@material-ui/icons';

// 是否开启网络请求时的页面同步等待效果（保留已渲染的body内容）
const APP_BODY_HOLD_WAIT = true;
// body填充等待(覆盖已渲染的内容，改由预定义wait内容填充body)
const APP_BODY_FILL_WAIT = true;

// const APP_SERVER_API_URL = 'http://139.196.100.121/yjfapi/web-business'; // SERVER_API_URL
const APP_SERVER_API_URL = 'services';
const DEBUG_APP_SERVER_API_URL = 'http://wskj.tpddns.cn:32767/api/web-business'; // SERVER_API_URL
// 接口环境：布尔 true 或 false
// export const DEBUG = true;
export const DEBUG = false;

const instance = axios.create({
  // 当创建实例的时候配置默认配置
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  baseURL: DEBUG ? DEBUG_APP_SERVER_API_URL : APP_SERVER_API_URL,
  timeout: 5000,
  headers: { 'X-Requested-With': 'foobar' }
});

// 初始化
// instance.defaults.timeout = 2500;
// @ts-ignore
instance.all = axios.all;
// @ts-ignore
instance.spread = axios.spread;

// 各接口配置
export const Api = {
  tsxBusiness: {
    loading: APP_BODY_HOLD_WAIT,

    api_debug: '/business.php',
    api: '/basic/api/userorder/somethingData/',
    api_shopinfo: '/merchant/api/findShopInfo/',
    api_shopgood: '/merchant/api/dishes/getInfoForGoods/',
    api3: '',
    data: {
      income: { today_income: 0, day_order: 0 },
      order: { unpaid: 0, paid: 0, refund: 0, day_order: 0 },
      commodity: { onsale: 0, takedown: 0, draft: 0 }
    },
    error: null
  },
  tsxSettings: {
    api_debug: '/settings.php',
    // 店铺信息
    api_shopinfo: '/merchant/api/findShopInfo/',
    // 查询用户余额
    api_shopbalance: '/basic/api/userassets/findUserBalance/',
    // 查询商家各项详细收益
    api_profitinfo: '/basic/api/receiptpay/getProfitInfo/',

    data: { user: null, bankcard: null, profit: null, entrys: null },
    loading: APP_BODY_HOLD_WAIT,
    error: null
  },
  tsxNotice: {
    api: '/notice.php',
    data: [],
    loading: APP_BODY_HOLD_WAIT,
    error: null,
    progressive: APP_BODY_FILL_WAIT
  },

  // 提现详情
  tsxWithdrawDetail: {
    api_debug: '/withdrawDetail.php',
    // 获取一条提现数据详细信息
    api_findWithdrawInfo: '/basic/api/withdrawal/getWithdrawalInfo/',
    // data: { stime: '-', etime: '-', amount: 0, type: '0', bankname: '-', bankaccount: '*', bankbankuser: '*', status: '0' , extro: '' },
    data: {},
    loading: APP_BODY_HOLD_WAIT,
    error: null,
    progressive: APP_BODY_FILL_WAIT
  },
  // 钱包
  tsxWallet: {
    api_debug: '/wallet.php',
    // 查询用户余额
    api_findUserBalance: '/basic/api/userassets/findUserBalance/',
    // 查询用户的提现明细列表
    api_withdrawWaterList: '/basic/api/withdrawaldetails/findUserWithdrawaldetails/',

    data: {},
    loading: APP_BODY_HOLD_WAIT,
    error: null,
    progressive: APP_BODY_FILL_WAIT
  },
  // 提现
  tsxWithdraw: {
    api_debug: '/withdraw.php',
    // 查询用户余额
    api_findUserBalance: '/basic/api/userassets/findUserBalance/',
    // 查询用户银行卡列表
    api_findAllUserBankCard: '/basic/api/userbankcard/findAllUserBankCard/',

    api_insertWithdraw: '/basic/api/withdrawal/insert-withdrawal',

    data: { bank: false, account: null, amount: '', name: '' },
    loading: APP_BODY_HOLD_WAIT,
    error: null,
    progressive: APP_BODY_FILL_WAIT
  },
  // 银行卡管理
  tsxBankcard: {
    api_debug: '/bankcard.php',
    // 创建银行卡信息
    api_createBankcard: '/basic/api/userbankcard/createBankCard',
    // 查询所有银行卡信息
    api_cardlist: '/basic/api/usercard/findCardInfo',
    // 用户删除银行卡
    api_deleteBankcard: '/basic/api/userbankcard/deleteBackCard/',
    // 查询用户银行卡列表
    api_findUserBankcardList: '/basic/api/userbankcard/findAllUserBankCard/',
    data: {},
    loading: APP_BODY_HOLD_WAIT,
    error: null,
    progressive: APP_BODY_FILL_WAIT
  },
  tsxIncomeWater: {
    api_debug: '/incomeWater.php',

    // 商家查询收付款流水
    api_incomeWaterQuery: '/basic/api/receiptpay/findMerchantProfitInfo/{userid}&{startPage}&{pageSize}',
    data: {},
    loading: APP_BODY_HOLD_WAIT,
    error: null,
    progressive: APP_BODY_FILL_WAIT
  },
  // 绑定支付宝、微信账号
  tsxBindWithdrawAccount: {
    api_debug: '',
    // 查询用户微信、支付宝账号
    api_findUserAlipayWinxinAccount: '/basic/api/userbankcard/findAllUserBankCard/',
    // 创建微信、支付宝账号
    api_createWithdrawAccount: '/basic/api/bindALiPayOrWeChat',
    data: {},
    loading: APP_BODY_HOLD_WAIT,
    error: null,
    progressive: APP_BODY_FILL_WAIT
  },
  responseParse: (response: object, dataType: object) => {
    const objv = obj => Object.prototype.toString.call(obj) === '[object Object]';
    const arrv = arr => Object.prototype.toString.call(arr) === '[object Array]';

    // @ts-ignore
    if (response.data === undefined || response.data === null || response.data === '') {
      response['data'] = dataType;
    }
    // @ts-ignore
    if (arrv(response.data) && response.data['0'] !== undefined && objv(dataType)) {
      // @ts-ignore
      response['data'] = response.data['0'];
    }
    return response;
  },
  getFileBase64: (fileId: any) => Axios.get('/basic/api/public/myfiles/' + fileId),
  buildFileBase64Path: (response: any) => {
    const path = 'data:' + response.fileContentType + ';base64,';
    return path + response.file;
  }
};

const aiaxLoadTemplate = (n: boolean, props) => (
  <div style={{ width: '100vw', height: '100vh', textAlign: 'center' }}>
    {n ? (
      <div ws-container-id="nobody" style={{ height: '52vh', lineHeight: '96vh' }}>
        <div>{props.msgtext ? props.msgtext : '页面加载中'}</div>
      </div>
    ) : (
      ''
    )}
    <img
      style={{
        position: 'relative',
        top: '80%',
        backgroundColor: '#e0dddd',
        width: '100px',
        height: '50px',
        padding: '20px 30px',
        borderRadius: '30px'
      }}
      src="./content/images/loading2.gif"
    />
  </div>
);

const style = {
  opacity: 0.4,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: '50px',
  width: '100vw',
  height: '100vh',
  // lineHeight: '100vh',
  backgroundColor: '#FFF',
  textAlign: 'center',
  verticalAlign: 'middle',
  zIndex: 999 // 层级需低于顶部导航栏，否则导航栏 将被遮盖致使无法点击 返回上一页 功能
};

export const Axios = instance;
export function PathInfoParse(path) {
  return (path || window.location.pathname).substring(1).split('/');
}
export function ShowBodyPlaceholderHtml(props) {
  // @ts-ignore
  return <div style={style}>{aiaxLoadTemplate(true, props)}</div>;
}
export default function requestLoadingWait(props: any) {
  if (props.loading) {
    // @ts-ignore
    return <div style={style}>{aiaxLoadTemplate(false)}</div>;
  }
  return null;
}
