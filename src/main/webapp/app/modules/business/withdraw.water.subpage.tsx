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
        marginTop: '10px'
      }
    }
  })
);

export default function ListDividers(props) {
  const classes = useStyles();

  // ['-', '处理中', '成功', '失败'][props.info.status]
  // ['-', '银行卡', '微信', '支付宝'][props.info.type]}

  // tslint:disable-next-line: one-variable-per-declaration
  let ma, mb;
  if (props.info.type === '1') {
    ma = (
      <div>
        <Divider light />
        <ListItem button>
          <ListItemText primary="到账方式 ：" />
          <ListItemSecondaryAction> {['-', '银行卡', '微信', '支付宝'][props.info.type]}</ListItemSecondaryAction>
        </ListItem>
      </div>
    );
  }

  // （非银行卡提现模式，前端不显示卡相关信息栏目 ）
  if (props.info.type === '1') {
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
              {' '}
              {props.info.bankuser}（**** {props.info.bankaccount.substr(-4)}）
            </ListItemSecondaryAction>
          ) : (
            <ListItemSecondaryAction> - </ListItemSecondaryAction>
          )}
        </ListItem>
      </div>
    );
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
        {ma}
        {mb}
        <Divider light />
        <ListItem button>
          <ListItemText primary="状态 ：" />
          <ListItemSecondaryAction> {['-', '处理中', '成功', '失败'][props.info.status]}</ListItemSecondaryAction>
        </ListItem>

        <Divider light />

        <ListItem button>
          <ListItemText primary="审批时间 ：" />
          <ListItemSecondaryAction>{props.info.etime ? props.info.etime : '-'}</ListItemSecondaryAction>
        </ListItem>

        <Divider light />
      </List>
      {props.info.extro ? (
        <Paper className={classes.card}>
          <Typography variant="h6" component="h6">
            {' '}
            ···· 审批意见 ····{' '}
          </Typography>
          <Typography component="p">{props.info.extro}</Typography>
        </Paper>
      ) : (
        ''
      )}
    </div>
  );
}
