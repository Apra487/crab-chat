import React  from 'react';
import '../styles/ActiveUser.css';

export default function User({name, profilePic, selectUser, user, state}) {
    return (<>
      <div className="activeUser" onClick={() => selectUser(user)}>
        <img src={profilePic} alt={name} />
        <div className="userInfo" >
          <p>{name}</p>
          <small style={{color: 'grey'}}>{user.state}</small>
        </div>
        
      </div>
    </>)
}