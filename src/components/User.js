import React, {useEffect, useState}  from 'react';
import '../styles/ActiveUser.css';
import db from '../firebase';

export default function User({name, profilePic, selectUser, user1, user2}) {
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1.uid > user2.uid  ? `${user1.uid + user2.uid}` : `${user2.uid + user1.uid}`;
    
    const unsub = db.collection('lastmsg').doc(id).onSnapshot((doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

    return (<>
      <div className="activeUser" onClick={() => selectUser(user2)}>
        <img src={profilePic} alt={name} />
        <div className="userInfo" >
          <p>{name}</p>
          <small style={{color: 'grey'}}>{user2.state}</small>
        </div>
        {data?.from !== user1.uid && data?.unread && (
              <small className="unread">New msg</small>
            )}
        
      </div>
    </>)
}