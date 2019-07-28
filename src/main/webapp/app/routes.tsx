import React from 'react';
import Business from 'app/modules/business/business';
// const Routes = () => <Business />;
// export default Routes;

import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import PageNotFound from 'app/shared/error/page-not-found';

// import Workbench from 'app/modules/workbench/workbench';
import Information from 'app/modules/information/information';
// 个人设置
import Settings from 'app/modules/settings/settings';
// 商户全局信息设置
import Manage from 'app/modules/manage/manage';
// 钱包
import Wallet from 'app/modules/business/wallet';
// 提现进度查看
import WithdrawWater from 'app/modules/business/withdraw.water';
// 申请提现
import withdrawCheckout from 'app/modules/business/withdraw.checkout';
// 银行卡管理
import Manage_bankcard from 'app/modules/manage/bankcard';
// 商家收入流水
import IncomeWaterList from 'app/modules/manage/incomeWater';

const Routes = () => (
  <div className="view-routes">
    <Switch>
      <ErrorBoundaryRoute path="/information" component={Information} />
      <ErrorBoundaryRoute path="/settings" component={Settings} />
      <ErrorBoundaryRoute path="/wallet" component={Wallet} />
      <ErrorBoundaryRoute path="/withdrawDetail" component={WithdrawWater} />
      <ErrorBoundaryRoute path="/withdrawCheckout" component={withdrawCheckout} />
      <ErrorBoundaryRoute path="/manage/bankcard" component={Manage_bankcard} />
      <ErrorBoundaryRoute path="/manage/incomeWater" component={IncomeWaterList} />
      <ErrorBoundaryRoute path="/manage" exact component={Manage} />
      {/* <ErrorBoundaryRoute path="/bankcard" component={Bankcard} /> */}
      <ErrorBoundaryRoute path="/" exact component={Business} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </div>
);
export default Routes;
