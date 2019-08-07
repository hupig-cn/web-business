// 管理模块
import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getSession, getSessionRE } from 'app/shared/reducers/authentication';
import Title from 'app/modules/public/title';
import { Link } from 'react-router-dom';

import Enddiv from '../../shared/menu/enddiv';

// 专用接口请求模块
import RequestLoadingWait, { Api } from 'app/request';

export interface IManageProp extends StateProps, DispatchProps {}

export class Manage extends React.Component<IManageProp> {
  constructor(props) {
    super(props);
    // 初始化接口数据结构
    this.state = Api.tsxSettings;
  }
  componentDidMount() {
    this.props.getSession();
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className="jh-personal">
        {/* 同步请求 等待视图 */}
        // @ts-ignore
        <RequestLoadingWait loading={this.state.loading} />
        <Title name="设置中心" back="/settings" />
        <div ws-container-id="main">
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            <li style={{ margin: 0, padding: 0, listStyle: 'none', height: '50px', lineHeight: '50px', borderBottom: '1px solid #eee' }}>
              <div
                style={{
                  width: '22vw',
                  float: 'left',
                  lineHeight: '50px',
                  textAlign: 'right'
                }}
              >
                店铺管理
              </div>

              <div style={{ width: '75vw', float: 'right' }}>
                <div
                  style={{
                    // width: '40%',
                    float: 'left',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    color: '#ddd'
                  }}
                >
                  店铺资料调整
                </div>

                <div
                  style={{
                    float: 'right',
                    textAlign: 'right',
                    paddingRight: '15px',
                    color: '#ccc'
                  }}
                >
                  暂不开放
                </div>
              </div>
            </li>

            <li style={{ margin: 0, padding: 0, listStyle: 'none', height: '50px', lineHeight: '50px', borderBottom: '1px solid #eee' }}>
              <div
                style={{
                  width: '22vw',
                  float: 'left',
                  lineHeight: '50px',
                  textAlign: 'right'
                }}
              >
                提现账号
              </div>

              <div style={{ width: '75vw', float: 'right' }}>
                <div
                  style={{
                    // width: '40%',
                    float: 'left',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    color: '#ddd'
                  }}
                >
                  绑定 解绑移动收款、银行账户
                </div>
                <Link to="/manage/withdrawAccountManage">
                  <div
                    style={{
                      width: '25vw',
                      float: 'right',
                      textAlign: 'right',
                      paddingRight: '15px',
                      color: '#ccc'
                    }}
                  >
                    {' '}
                    &gt;
                  </div>
                </Link>
              </div>
            </li>
          </ul>
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
