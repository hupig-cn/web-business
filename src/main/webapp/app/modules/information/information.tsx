import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getSession, getSessionRE } from 'app/shared/reducers/authentication';
// tslint:disable-next-line: no-submodule-imports
import Button from '@material-ui/core/Button';
import Selects from './selects';
import Informationlistbox from './informationlistbox';
import Enddiv from '../../shared/menu/enddiv';
import BottomNavigation from 'app/shared/menu/bottomnavigation';

// 专用接口请求模块
import RequestLoadingWait, { Axios, Api } from 'app/request';

export interface IInformationProp extends StateProps, DispatchProps {}

// tslint:disable-next-line: ter-arrow-body-style
export const Title = () => {
  return (
    <div
      style={{
        height: 35,
        width: '100vw',
        color: '#fffde5',
        backgroundColor: '#fe4365',
        padding: '5px 10px 0px 10px',
        position: 'fixed',
        top: 0,
        zIndex: 1000
      }}
    >
      <span
        style={{
          float: 'left',
          fontSize: '1rem',
          marginTop: '3px',
          marginLeft: '2px',
          color: '#fffde5'
        }}
      >
        消息
      </span>
      <Button
        type="button"
        variant="contained"
        color="secondary"
        style={{
          color: '#fffde5',
          float: 'right',
          padding: 0,
          fontSize: '1rem',
          minWidth: 0,
          boxShadow: 'none',
          backgroundColor: '#fe4365',
          outline: 'none'
        }}
      >
        管理
      </Button>
    </div>
  );
};

export class Information extends React.Component<IInformationProp> {
  constructor(props) {
    super(props);
    // 初始化接口数据结构
    this.state = Api.tsxNotice;
  }

  componentDidMount() {
    this.props.getSession();

    // @ts-ignore
    this.props.getSessionRE().then((val: any) => {
      val.payload.then((info: any) => {
        info.config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        Axios.defaults.headers = info.config.headers;
        // Axios.defaults.baseURL = '';

        // 动态获取最新数据
        // @ts-ignore
        Axios.post(this.state.api, { loginName: info.data.login, id: info.data.id })
          // Axios.get("http://localhost:8082/services/login/api/account", { loginName: info.data.login, id: info.data.id })
          .then(response => {
            this.setState({ loading: false, data: response.data.data });
          })
          .catch(error => {
            // TODO toast error
            window.console.log(error);
          });
      });
    });

    // 动态获取最新数据
    // @ts-ignore
    Axios.post(this.state.api, {})
      // Axios.get("http://localhost:8082/services/login/api/account", { loginName: info.data.login, id: info.data.id })
      .then(response => {
        this.setState({ loading: false, data: response.data.data });
      })
      .catch(error => {
        // TODO toast error
        window.console.log(error);
      });
  }

  render() {
    return (
      <div className="jh-information">
        {/* 同步请求 等待视图 */}
        <RequestLoadingWait
          // @ts-ignore
          loading={this.state.loading}
        />

        <Title />
        <Selects />
        <Informationlistbox
          // @ts-ignore
          itemList={this.state.data}
        />
        <Enddiv />
        <BottomNavigation bottomNav="information" />
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
)(Information);
