import React from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';
// tslint:disable-next-line: no-submodule-imports
import Button from '@material-ui/core/Button';
import Selects from './selects';
import Informationlistbox from './informationlistbox';

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
  componentDidMount() {
    this.props.getSession();
  }

  render() {
    return (
      <div className="jh-information">
        <Title />
        <Selects />
        <Informationlistbox />
      </div>
    );
  }
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  account: authentication.account,
  isAuthenticated: authentication.isAuthenticated
});

const mapDispatchToProps = { getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Information);
