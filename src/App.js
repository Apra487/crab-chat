import React, { useState, useEffect } from 'react';
import usePageVisibility from 'use-page-visibility';
import moment from 'moment';

import firebase, { messaging } from 'firebase';
import { auth, realtimeDb } from './firebase';

import db from './firebase';

import { useAuthState } from 'react-firebase-hooks/auth';

import './App.css';

import Login from './components/Login.js';
import Logout from './components/Logout.js';
import ChatRoom from './components/ChatRoom.js';
import ActiveUser from './components/ActiveUser.js';
import User from './components/User.js';

function App() {
	const [user] = useAuthState(auth);
	const [activeUsers, setActiveUsers] = useState({});
	const [allUsers, setAlUsers] = useState({});
	const [selectedUser, setSelectedUser] = useState(null);
	const [text, setText] = useState('');
	const [msgs, setMsgs] = useState([]);
	const [observerArray, setOberserverarray] = useState([]);
	const [selectedUserStatus, setSelectedUserStatus] = useState(null);

	useEffect(() => {
		auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				const userId = authUser.uid;
				const userStatusDatabaseRef = realtimeDb
					.ref()
					.child('/users/' + userId);

				const isOfflineForDatabase = {
					name: authUser.displayName,
					profilePic: authUser.photoURL,
					email: authUser.email,
					state: 'offline',
					last_changed: firebase.database.ServerValue.TIMESTAMP,
				};
				const isOnlineForDatabase = {
					name: authUser.displayName,
					profilePic: authUser.photoURL,
					email: authUser.email,
					state: 'online',
					last_changed: firebase.database.ServerValue.TIMESTAMP,
				};

				realtimeDb
					.ref('.info/connected')
					.on('value', function (snapshot) {
						// If we're not currently connected, don't do anything.
						if (snapshot.val() === false) {
							return;
						}

						userStatusDatabaseRef
							.onDisconnect()
							.update(isOfflineForDatabase)
							.then(function () {
								userStatusDatabaseRef.update(
									isOnlineForDatabase
								);
							});
					});
			}
		});
	}, []);

	useEffect(() => {
		const dbRef = realtimeDb.ref(`/users/${selectedUser?.uid}`);

		dbRef.on('value', (doc) => setSelectedUserStatus(doc?.val()));
	}, [selectedUser]);

	useEffect(() => {
		if (user) {
			const dbRef = realtimeDb.ref('/users/');

			dbRef.on(
				'value',
				(snapshot) => {
					const allUsersArray = [];
					const activeArray = [];
					snapshot.forEach((e) => {
						if (user.uid !== e.key) {
							const obj = e.val();
							obj.uid = e.key;
							allUsersArray.push(obj);

							if (e.val().state !== 'offline') {
								activeArray.push(obj);
							}
						}
					});
					setAlUsers(allUsersArray);
					setActiveUsers(activeArray);
				},
				(errorObject) => {
					console.log('The read failed: ' + errorObject.name);
				}
			);
		}
	}, [user]);

	// away functionality
	const handleVisibilityChange = (visible) => {
		if (user) {
			if (!visible) {
				const isAwayForDatabase = {
					name: user.displayName,
					profilePic: user.photoURL,
					email: user.email,
					state: 'away',
					last_changed: firebase.database.ServerValue.TIMESTAMP,
				};
				realtimeDb
					.ref()
					.child('/users/' + user.uid)
					.update(isAwayForDatabase);
			} else {
				const isOnlineForDatabase = {
					name: user.displayName,
					profilePic: user.photoURL,
					email: user.email,
					state: 'online',
					last_changed: firebase.database.ServerValue.TIMESTAMP,
				};
				realtimeDb
					.ref()
					.child('/users/' + user.uid)
					.update(isOnlineForDatabase);
			}
		}
	};

	usePageVisibility(handleVisibilityChange);

	const selectUser = async (otherUser) => {
		observerArray.forEach((observer) => observer());
		// setChat(user);
		const user1 = user.uid;
		const user2 = otherUser.uid;

		setSelectedUser(otherUser);

		const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

		const query = db
			.collection('messages')
			.doc(id)
			.collection('chat')
			.orderBy('createdAt');

		// read msg
		const chatRef = db.collection('messages').doc(id).collection('chat');
		const observer = query.onSnapshot(
			(querySnapshot) => {
				let msgs = [];
				querySnapshot.forEach((doc) => {
					const chatId = doc.id;
					const msg = doc.data();
					if (msg.createdAt) {
						msgs.push(msg);
					}
					console.log(msg);
					// update status to read
					if (msg.to === user1 && msg.status !== 'read') {
						console.log('im the reciever');
						// console.log(msg.to === user.uid);
						chatRef.doc(chatId).update({ status: 'read' });
					}
				});
				setMsgs(msgs);
			},
			(err) => {
				console.log(`Encountered error: ${err}`);
			}
		);
		setOberserverarray([...observerArray, observer]);
		const docSnap = await db.collection('lastmsg').doc(id).get();
		if (docSnap.data() && docSnap.data().from !== user1) {
			// update last message doc, set unread to false
			db.collection('lastmsg')
				.doc(id)
				.update({ unread: false })
				.catch((e) => console.log(e));
		}
	};

	useEffect(() => {
		if (user) {
			// get all the chat room id by current user

			const usersRef = db
				.collection('users')
				.doc(user.uid)
				.collection('userChatRooms');
			const observer = usersRef.onSnapshot(
				(querySnapshot) => {
					querySnapshot.forEach((doc) => {
						console.log('here', doc);
						const chatRef = db
							.collection('messages')
							.doc(doc.id)
							.collection('chat');
						const query = db
							.collection('messages')
							.doc(doc.id)
							.collection('chat')
							.orderBy('createdAt');
						const observer = query.onSnapshot(
							(querySnapshot) => {
								querySnapshot.forEach((innerDoc) => {
									const chatId = innerDoc.id;
									const msg = innerDoc.data();
									if (
										msg.to === user.uid &&
										msg.status === 'send'
									) {
										chatRef
											.doc(chatId)
											.update({ status: 'delivered' });
									}
								});
							},
							(err) => {
								console.log(`Encountered erro here: ${err}`);
							}
						);
						setOberserverarray([...observerArray, observer]);
					});
				},
				(err) => {
					console.log(`Encountered error: ${err}`);
				}
			);
			setOberserverarray([...observerArray, observer]);
		}
	}, [user]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const user1 = user.uid;
		const user2 = selectedUser.uid;

		const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

		const checkUserId = (obj) => obj.uid === user2;

		db.collection('messages')
			.doc(id)
			.collection('chat')
			.doc()
			.set({
				text,
				from: user1,
				to: user2,
				createdAt: firebase.firestore.FieldValue.serverTimestamp(),
				status: (firebase.firestore.FieldValue.serverTimestamp()) ? (activeUsers.some(checkUserId) ? 'delivered' : 'send') : '',
			});
		
		db.collection('users')
			.doc(user2)
			.collection('userChatRooms')
			.doc(id)
			.set({
				recieverId: user2,
			});
		db.collection('lastmsg').doc(id).set({
			text,
			from: user1,
			to: user2,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			unread: true,
		});
		setText('');
	};

	return (
		<div className='app'>
			{user && (
				<div className='allUserSection'>
					{allUsers.length ? (
						allUsers.map((user2) => (
							<User
								key={user2.uid}
								name={user2.name}
								profilePic={user2.profilePic}
								selectUser={selectUser}
								selectedUser={selectedUser}
								user2={user2}
								user1={user}
								onclick={() => selectUser(user2)}
							/>
						))
					) : (
						<></>
					)}
				</div>
			)}

			{!user && <Login />}

			{user ? (
				selectedUser ? (
					<div className='chatSection'>
						<header>
							<div className='chatHeaderDiv'>
								<img
									src={selectedUser.profilePic}
									alt='selectedUser.name'
								/>
								<div className='chatHeaderInfo'>
									<h3 className='header-text'>
										{selectedUser.name}
									</h3>
									<p>
										{selectedUserStatus?.state === 'offline'
											? `Active ${moment(
													selectedUserStatus?.last_changed
											  ).fromNow()}`
											: selectedUserStatus?.state}
									</p>
								</div>
							</div>
							<Logout
								user={user}
								setSelectedUser={setSelectedUser}
								observerArray={observerArray}
							/>
						</header>

						<section>
							{user ? (
								<ChatRoom
									msgs={msgs}
									handleSubmit={handleSubmit}
									text={text}
									setText={setText}
								/>
							) : (
								<Login />
							)}
						</section>
					</div>
				) : (
					<div className='welcomeSection'>
						<h1>
							Select a user to start conversation
						</h1>

						<Logout
							user={user}
							setSelectedUser={setSelectedUser}
							observerArray={observerArray}
						/>
					</div>
				)
			) : (
				<></>
			)}

			{user && (
				<div className='active'>
					<header className='active-header'>
						<h1 className='header-text'>Active Users</h1>
					</header>
					<div className="activeUserList">
						{activeUsers.length ? (
							activeUsers.map((user) => (
								<ActiveUser
									key={user.uid}
									name={user.name}
									profilePic={user.profilePic}
									status={user.state}
								/>
							))
						) : (
							<></>
						)}
					</div>
					
				</div>
			)}
		</div>
	);
}

export default App;
