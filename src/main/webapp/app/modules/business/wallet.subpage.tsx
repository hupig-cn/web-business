import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
/*
// tslint:disable-next-line: no-submodule-imports
import CssBaseline from '@material-ui/core/CssBaseline';
// tslint:disable-next-line: no-submodule-imports
import Typography from '@material-ui/core/Typography';

// tslint:disable-next-line: no-submodule-imports
import List from '@material-ui/core/List';
// tslint:disable-next-line: no-submodule-imports
import ListItem from '@material-ui/core/ListItem';
// tslint:disable-next-line: no-submodule-imports
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// tslint:disable-next-line: no-submodule-imports
import ListItemText from '@material-ui/core/ListItemText';
// tslint:disable-next-line: no-submodule-imports
import Avatar from '@material-ui/core/Avatar';
*/
// tslint:disable-next-line: no-submodule-imports
// import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      padding: theme.spacing(2, 2, 0)
    },
    paper: {
      paddingBottom: 0,
      boxShadow: 'none',
      marginTop: 37 + 35
    },
    list: {
      fontFamily: '黑体',
      padding: 0
    },
    subheader: {
      backgroundColor: theme.palette.background.paper
    },
    appBar: {
      top: 'auto',
      bottom: 0
    },
    grow: {
      flexGrow: 1
    },
    fabButton: {
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: '0 auto'
    },
    inline: {
      width: '100%'
    },
    moneyinfo: {
      width: '100vw',
      height: '80px',
      lineHeight: '80px',
      textAlign: 'center',
      fontSize: '2rem',
      marginTop: '10px'
    },
    moneyInfoAmount: {
      width: '50vw',
      textAlign: 'center',
      height: '60px',
      float: 'left',
      // @ts-ignore
      textAlign: 'center',
      lineHeight: '25px',
      fontSize: '0.9rem'
    },
    moneyInfoAction: {
      width: '50vw',
      textAlign: 'center',
      height: '50px',
      lineHeight: '50px',
      float: 'left',
      color: 'rgb(22, 155, 213)',
      // background: 'green',
      fontSize: '0.5rem'
    },
    waterTitle: {
      height: '50px',
      lineHeight: '60px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      marginTop: '170px',
      position: 'fixed',
      width: '100%'
    },
    waterList: {
      // height: '40vh',
      // lineHeight: '50vh',
      bottom: '0px',
      overflow: 'hidden',
      overflowY: 'auto',
      position: 'fixed',
      top: '275px',
      width: '100%',

      '& > ul': {
        margin: 0,
        padding: 0,

        '& > li': {
          listStyle: 'none',
          display: 'block',
          float: 'left',
          height: '70px',
          borderBottom: '1px solid #dddeee',
          lineHeight: '45px',

          '&.nothing': {
            textAlign: 'center',
            width: '100%',
            border: 'none',
            height: '100px',
            lineHeight: '100px',
            color: '#ccc',
            fontSize: '0.6rem'
          },

          '& div': {
            float: 'left',
            height: '30px',
            fontSize: 'small'
          }
        }
      }
    },

    waterListTitle: {
      width: '59vw',
      textAlign: 'left',
      textIndent: '15px',
      overflow: 'hidden'
    },
    // @ts-ignore
    waterListAmount: {
      width: '39vw',
      textAlign: 'right',
      paddingRight: '10px',
      color: '#999',
      fontWeight: '500',
      overflow: 'hidden',

      '&[refuned="t1"]': {
        color: '#ff0000'
      }
    },
    waterListBalance: {
      width: '39vw',
      textAlign: 'right',
      paddingRight: '10px',
      color: '#999',
      overflow: 'hidden'
    },
    primaryALink: {
      fontWeight: 'normal',
      color: '#212529'
    },
    hotALink: {
      fontWeight: 'normal',
      color: 'rgb(22, 155, 213)'
    }
  })
);
// import Withdraw from './withdraw';

// ['-', '处理中', '成功', '失败'][props.info.state]
// ['-', '银行卡', '微信', '支付宝'][props.info.type]}

const $config = {
  waterState: ['-', '处理中', '成功', '失败'],
  withdrawType: ['-', '银行卡', '微信', '支付宝']
};

export default function BottomAppBar(props) {
  const classes = useStyles();

  // const [value, setValue] = React.useState('consumer');

  const waterlist = props.waterlist || [];
  return (
    <React.Fragment>
      <div ws-container-id="tbody" style={{ position: 'fixed' }}>
        <div
          // @ts-ignore
          className={classes.moneyinfo}
        >
          ￥{props.account ? props.account.balance : '0.000'}
        </div>
        <div
          // @ts-ignore
          className={classes.moneyInfoAmount}
        >
          冻结资金
          <br />￥{props.account ? props.account.frozenBalance : '0.000'}
        </div>
        <div
          // @ts-ignore
          className={classes.moneyInfoAmount}
        >
          可提现资金
          <br />￥{props.account ? props.account.availableBalance : '0.000'}
        </div>
        {/* <div className={classes.moneyInfoAction}> <a className={classes.hotALink}>查看流水</a> </div> */}
        {/* <div className={classes.moneyInfoAction}> */}
        {/* <Link className={classes.hotALink} to="/withdrawCheckout">申请提现</Link> */}
        {/* </div> */}
        <div style={{ clear: 'both', height: '0', width: '0' }} />
      </div>
      <div style={{ clear: 'both', height: '0', width: '0' }} />

      <div
        // @ts-ignore
        className={classes.waterTitle}
      >
        提现账单记录
      </div>

      <div
        // @ts-ignore
        className={classes.waterList}
      >
        <ul>
          {/* item.type : 2入账  1出账 */
          waterlist.map(item => (
            <li key={item.id}>
              <Link
                // @ts-ignore
                className={classes.primaryALink}
                to={'/withdrawDetail/' + item.id}
              >
                <div
                  // @ts-ignore
                  className={classes.waterListTitle}
                >
                  {item.type === '2'
                    ? '提现失败，资金退回'
                    : item.title
                    ? item.title
                    : '申请（' + $config.withdrawType[Number(item.type)] + '）提现'}
                </div>
              </Link>
              {
                // @ts-ignore
                <div className={classes.waterListAmount} refuned={'t' + item.type}>
                  {item.type === '1' ? '-' + item.amount : '+' + item.amount}
                </div>
              }
              <Link
                // @ts-ignore
                className={classes.primaryALink}
                to={'/withdrawDetail/' + item.id}
              >
                <div
                  // @ts-ignore
                  className={classes.waterListTitle}
                >
                  {item.createdate ? item.createdate.substring(0, 16) : '-'}
                </div>
              </Link>
              <div
                // @ts-ignore
                className={classes.waterListBalance}
              >
                {item.afteramount ? item.afteramount : '0.00'}
              </div>
            </li>
          ))}
          <li className="nothing">~没有更多了~</li>
        </ul>
      </div>
    </React.Fragment>
  );
}
