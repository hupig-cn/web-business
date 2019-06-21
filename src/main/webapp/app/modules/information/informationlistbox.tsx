import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

const messages = [
  {
    id: 1,
    title: '【异常登录】',
    content: '您的账号存在异常登录信息，登录地点：澳大利亚-墨尔本，登录时间：2019-6-18 10:06',
    time: '2019-6-18 10:06',
    person: './content/images/sys1.png'
  },
  {
    id: 2,
    title: '【消费提醒】',
    content: '德州汉堡（市桥黄编店），消费270.00元',
    time: '2019-6-18 9:06',
    person: './content/images/sys2.png'
  },
  {
    id: 3,
    title: '【收益提醒】',
    content: '昨日收益：消费分红570.00元，收款分红：1250.00元。',
    time: '2019-6-18 8:00',
    person: './content/images/sys2.png'
  },
  {
    id: 4,
    title: '【精品推荐】',
    content: '进口澳大利亚新鲜活体象拔蚌，今日特价￥：30.00元/斤，点击抢购。',
    time: '2019-6-18 8:00',
    person: './content/images/sys3.png'
  },
  {
    id: 5,
    title: '【消费提醒】',
    content: '广州麦当劳光明北得来速餐厅，消费270.00元',
    time: '2019-6-16 12:56',
    person: './content/images/sys2.png'
  },
  {
    id: 6,
    title: '【推荐提醒】',
    content: '推荐用户：139****5783成功，推荐时间：2019-5-1 12:31',
    time: '2019-6-16 12:56',
    person: './content/images/sys4.png'
  },
  {
    id: 7,
    title: '【系统消息】',
    content: '为庆祝：番禺区，市场覆盖度达到80%，特推出线上积分夺宝活动，详情点击。',
    time: '2019-6-16 10:56',
    person: './content/images/sys1.png'
  },
  {
    id: 8,
    title: '【消费提醒】',
    content: '广州麦当劳光明北得来速餐厅，消费36.00元',
    time: '2019-6-16 10:30',
    person: './content/images/sys2.png'
  },
  {
    id: 9,
    title: '【消费提醒】',
    content: '广州麦当劳光明北得来速餐厅，消费12.00元',
    time: '2019-6-16 10:25',
    person: './content/images/sys2.png'
  },
  {
    id: 10,
    title: '【消费提醒】',
    content: '广州麦当劳光明北得来速餐厅，消费10.00元',
    time: '2019-6-16 10:20',
    person: './content/images/sys2.png'
  },
  {
    id: 11,
    title: '【消费提醒】',
    content: '广州麦当劳光明北得来速餐厅，消费26.00元',
    time: '2019-6-16 10:00',
    person: './content/images/sys2.png'
  },
  {
    id: 12,
    title: '【消费提醒】',
    content: '广州麦当劳光明北得来速餐厅，消费8.00元',
    time: '2019-6-16 9:30',
    person: './content/images/sys2.png'
  },
  {
    id: 13,
    title: '【消费提醒】',
    content: '广州麦当劳光明北得来速餐厅，消费18.00元',
    time: '2019-6-16 9:25',
    person: './content/images/sys2.png'
  },
  {
    id: 14,
    title: '【消费提醒】',
    content: '广州麦当劳光明北得来速餐厅，消费82.00元',
    time: '2019-6-16 9:23',
    person: './content/images/sys2.png'
  },
  {
    id: 15,
    title: '【消费提醒】',
    content: '广州麦当劳光明北得来速餐厅，消费8.00元',
    time: '2019-6-16 9:20',
    person: './content/images/sys2.png'
  },
  {
    id: 16,
    title: '【消费提醒】',
    content: '开心花甲粉（市桥店），消费14.00元',
    time: '2019-6-16 9:06',
    person: './content/images/sys2.png'
  }
];

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
    }
  })
);

export default function BottomAppBar() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <List className={classes.list}>
          {messages.map(({ id, title, content, time, person }) => (
            <React.Fragment key={id}>
              <ListItem button style={{ borderBottom: '1px solid #f0f0f0', position: 'relative' }}>
                <ListItemAvatar>
                  <Avatar
                    alt="Profile Picture"
                    src={person}
                    style={{
                      borderRadius: 0,
                      width: '44px',
                      height: '44px',
                      marginRight: 10
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  style={{
                    margin: '0 auto',
                    height: '100%'
                  }}
                  primary={title}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                        <p
                          style={{
                            width: '100%',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            marginBottom: 0
                          }}
                        >
                          {content}
                        </p>
                      </Typography>
                    </React.Fragment>
                  }
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    fontSize: '0.875rem',
                    right: '16px',
                    width: 'auto',
                    color: '#00000095'
                  }}
                >
                  {time}
                </span>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </React.Fragment>
  );
}
