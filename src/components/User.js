import React, {useEffect, useState}  from 'react';
import '../styles/ActiveUser.css';
import db from '../firebase';

import moment from 'moment'

export default function User({name, profilePic, selectUser, selectedUser, user1, user2}) {
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1.uid > user2.uid  ? `${user1.uid + user2.uid}` : `${user2.uid + user1.uid}`;
    
    const unsub = db.collection('lastmsg').doc(id).onSnapshot((doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

    return (<>
      <div className={`user_wrapper ${selectedUser?.uid === user2.uid && "selectedUser"}`} onClick={() => selectUser(user2)}>
        <img src={profilePic} alt={name} />
        <div className="userInfo" >
          <h4>{name}</h4>
          <small className="subUserInfo" >{ (((data?.from === user1.uid) ? `Me: ${data?.text}` : data?.text)) || `${(user2?.state === 'offline') ? `Active ${moment(user2?.last_changed).fromNow()}` : user2.state}` }</small>
        </div>
        {data?.from !== user1.uid && data?.unread && (
              <small className="unread">New msg</small>
            )}
        
      </div>
    </>)
}