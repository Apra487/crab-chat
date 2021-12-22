import React from 'react';
import { auth, provider } from '../firebase';
import '../styles/Login.css';

import Crab from '../assets/svg/crab.svg';
import Google from '../assets/svg/google.svg';

function Login() {
	const signIn = () => {
		auth.signInWithPopup(provider).then(() => console.log()).catch((error) => alert(error.message));
	};

	return (
		<div className='login'>
			<h1 className='header-text'>Crab Chat 🔥</h1>
			<div className='login__logo'>
				<img src={Crab} className='avatar' alt='avatar' />
			</div>
			<div onClick={signIn} id='customBtn' className='customGPlusSignIn'>
				<img src={Google} className='icon' alt='google' />
				{/* <span class="icon"></span> */}
				<span className='buttonText'>Sign in with Google</span>
			</div>
		</div>
	);
}

export default Login;

