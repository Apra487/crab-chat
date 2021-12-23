import React, {useRef, useEffect} from 'react';
import { auth } from '../firebase';

import Moment from "react-moment";

export default function ChatMessage(props) {

    const scrollView = useRef();

    useEffect(() => {
      if(scrollView) scrollView.current.scrollIntoView({ behavior: 'smooth' })
    },[props.message])

      
    const { text, from } = props.message; 
    const messageClass = auth.currentUser ? from === auth.currentUser.uid ? 'sent' : 'received' : '';

    const status = props.message.status;

    let symbol = '';
    if (messageClass ===  'sent') {
      switch (status) {
        case 'send':
          symbol = '✔️'
          break;
        case 'delivered':
          symbol = '✔️✔️'
          break;
        case 'read':
          symbol = '✅'
          break;
        default:
          break;
      }
    }
    
    // console.log(symbol);
    return (<>
      <div className={`message ${messageClass}`} ref={scrollView}>
        <div className="message_bubble">
          <p>{text} {symbol}</p>
          {/* <br /> */}
          <small>
            {props.message.createdAt ? <Moment fromNow>{props.message.createdAt.toDate()}</Moment> : (<></>)}
          </small>
        </div>
        
      </div>
    </>)
  }