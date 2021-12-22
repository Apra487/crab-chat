import React from 'react';

import firebase from 'firebase';
import { auth, realtimeDb } from '../firebase';

import '../styles/Logout.css';


export default function Logout({user, setSelectedUser, observerArray}) {

  const isOfflineForDatabase = {
    name: user.displayName,
		profilePic: user.photoURL,
		email: user.email,
    state: 'offline',
    last_changed: firebase.database.ServerValue.TIMESTAMP,
  };
  
  const signOut = () => {
    console.log(user.uid);
    setSelectedUser(null);
    observerArray.forEach(observer => observer());
    const userStatusDatabaseRef = realtimeDb.ref().child('/users/' + user.uid);
    userStatusDatabaseRef.update(isOfflineForDatabase)
    auth.signOut().then(console.log('logged out')).catch(e=> console.log(e)) ;
  }
    return auth.currentUser && (
      <button className="log-out" onClick={signOut}>Sign Out</button>
    )
  }
  