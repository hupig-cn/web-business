import React from 'react';
// tslint:disable-next-line: no-submodule-imports
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
// tslint:disable-next-line: no-submodule-imports
import CssBaseline from '@material-ui/core/CssBaseline';
// tslint:disable-next-line: no-submodule-imports
import Typography from '@material-ui/core/Typography';
// tslint:disable-next-line: no-submodule-imports
import Paper from '@material-ui/core/Paper';
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

export default function BottomAppBar(props) {
  const classes = useStyles();
  const itemList = props.itemList || [];

  // 无记录
  if (itemList.length < 1) {
    return (
      <React.Fragment>
        <CssBaseline />
        <Paper square className={classes.paper}>
          <List className={classes.list} ws-key="123">
            <li style={{ lineHeight: '50vh', overflow: 'hidden' }}>暂无消息</li>
          </List>
        </Paper>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Paper square className={classes.paper}>
        <List className={classes.list} ws-key="123">
          {itemList.map(({ id, title, content, time, person }) => (
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
