import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
// tslint:disable-next-line: no-submodule-imports
import List from '@material-ui/core/List';
// tslint:disable-next-line: no-submodule-imports
import ListItem from '@material-ui/core/ListItem';
// tslint:disable-next-line: no-submodule-imports
import ListItemText from '@material-ui/core/ListItemText';
// tslint:disable-next-line: no-submodule-imports
import Divider from '@material-ui/core/Divider';
// tslint:disable-next-line: no-submodule-imports
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// tslint:disable-next-line: no-submodule-imports
import Paper from '@material-ui/core/Paper';
// tslint:disable-next-line: no-submodule-imports
import Typography from '@material-ui/core/Typography';

// 专用接口请求模块
// import RequestLoadingWait, { Axios, Api } from 'app/request';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      '& span': {
        fontSize: '0.9rem'
      }
    },
    card: {
      padding: theme.spacing(3, 2),
      '& > p': {
        marginTop: '10px',
        color: '#6d6d6d'
      }
    }
  })
);

export default function ListDividers(props) {
  // @ts-ignore
  const classes = useStyles();
  // 前端预定义的收款方式： 1:银行卡/ 2:微信/ 3:支付宝
  // ['-', '处理中', '成功', '失败'][props.info.status]
  // ['-', '银行卡', '微信', '支付宝'][props.info.type]}

  // tslint:disable-next-line: one-variable-per-declaration
  let mb;
  switch (props.info.type) {
    // （非银行卡提现模式，前端不显示卡相关信息栏目 ）
    case '1':
      mb = (
        <div>
          <Divider light />
          <ListItem button>
            <ListItemText primary="收款银行 ：" />
            <ListItemSecondaryAction> {props.info.bankname ? props.info.bankname : '-'} </ListItemSecondaryAction>
          </ListItem>
          <Divider light />
          <ListItem button>
            <ListItemText primary="收款账户 ：" />
            {props.info.bankuser && props.info.bankaccount ? (
              <ListItemSecondaryAction>
                {props.info.bankuser}（**** {props.info.bankaccount.substr(-4)}）
              </ListItemSecondaryAction>
            ) : (
              <ListItemSecondaryAction> - </ListItemSecondaryAction>
            )}
          </ListItem>
        </div>
      );
      break;
    case '2':
      mb = (
        <div>
          <Divider light />
          <ListItem button>
            <ListItemText primary="微信账号 ：" />
            <ListItemSecondaryAction> {props.info.wechat ? props.info.wechat : '获取失败'} </ListItemSecondaryAction>
          </ListItem>
          <Divider light />
          <ListItem button>
            <ListItemText primary="微信实名 ：" />
            {props.info.wechatName ? (
              <ListItemSecondaryAction>{props.info.wechatName}</ListItemSecondaryAction>
            ) : (
              <ListItemSecondaryAction> 获取失败 </ListItemSecondaryAction>
            )}
          </ListItem>
        </div>
      );
      break;
    case '3':
      mb = (
        <div>
          <Divider light />
          <ListItem button>
            <ListItemText primary="支付宝账号 ：" />
            <ListItemSecondaryAction> {props.info.alipay ? props.info.alipay : '获取失败'} </ListItemSecondaryAction>
          </ListItem>
          <Divider light />
          <ListItem button>
            <ListItemText primary="支付宝实名 ：" />
            {props.info.alipayName ? (
              <ListItemSecondaryAction>{props.info.alipayName}</ListItemSecondaryAction>
            ) : (
              <ListItemSecondaryAction> 获取失败 </ListItemSecondaryAction>
            )}
          </ListItem>
        </div>
      );
      break;
    default:
      mb = '';
      break;
  }

  return (
    <div>
      <List component="nav" className={classes.root} aria-label="Mailbox folders">
        <ListItem button>
          <ListItemText primary="申请时间 ：" style={{ fontSize: '0.9rem' }} />
          <ListItemSecondaryAction> {props.info.stime ? props.info.stime : '-'} </ListItemSecondaryAction>
        </ListItem>

        <Divider light />

        <ListItem button>
          <ListItemText primary="提现金额 ：" />
          {props.info.amount ? (
            <ListItemSecondaryAction> ￥{props.info.amount} </ListItemSecondaryAction>
          ) : (
            <ListItemSecondaryAction> - </ListItemSecondaryAction>
          )}
        </ListItem>
        <Divider light />
        <ListItem button>
          <ListItemText primary="到账方式 ：" />
          <ListItemSecondaryAction> {['-', '银行卡', '微信', '支付宝'][props.info.type]}</ListItemSecondaryAction>
        </ListItem>
        {mb}
        <Divider light />
        <ListItem button>
          <ListItemText primary="状态 ：" />
          <ListItemSecondaryAction> {['-', '处理中', '成功', '失败'][props.info.status ? props.info.status : 0]}</ListItemSecondaryAction>
        </ListItem>

        <Divider light />

        <ListItem button>
          <ListItemText primary="审批时间 ：" />
          <ListItemSecondaryAction>{props.info.etime ? props.info.etime : '-'}</ListItemSecondaryAction>
        </ListItem>

        <Divider light />
      </List>
      {props.info.extro ? (
        <div className={classes.card}>
          <h6>···· 审批意见 ····</h6>
          <p>{props.info.extro}</p>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
