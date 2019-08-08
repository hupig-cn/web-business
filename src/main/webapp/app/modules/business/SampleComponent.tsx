import React from 'react';
import SockJsClient from 'react-stomp';
import { toast } from 'react-toastify';

class SampleComponent extends React.Component {
  private clientRef: any;
  constructor(props) {
    super(props);
  }
  sendMessage = msg => {
    // this.clientRef.sendMessage('/topics/all', msg);
  };

  render() {
    return (
      <div>
        <SockJsClient
          url="http://app.yuanscore.com:9090/marco"
          // @ts-ignore
          topics={['/users/' + `${this.props.userid}` + '/message']}
          /* tslint:disable-next-line:jsx-no-lambda */
          onMessage={msg => {
            if (msg.type === '2') {
              const str = msg.message.split(',');
              const xx = new SpeechSynthesisUtterance('圆积分' + str[1]);
              xx.volume = 100;
              xx.rate = 1;
              xx.pitch = 1.5;
              window.speechSynthesis.speak(xx);
              toast.success(msg.message);
            } else {
              toast.success(msg.message);
            }
          }}
          ref={client => {
            this.clientRef = client;
          }}
        />
      </div>
    );
  }
}
export default SampleComponent;
