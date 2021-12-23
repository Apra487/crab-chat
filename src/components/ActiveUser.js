import React from 'react';
import '../styles/ActiveUser.css';

export default function ActiveUser({name, profilePic, status}) {
    return (<>
      <div className="active_user_wrapper">
        <img src={profilePic} alt={name} />
        <p>{name}<span>{status === 'online' ? '🟢' : '🟡' }</span></p>
        
      </div>
    </>)
}