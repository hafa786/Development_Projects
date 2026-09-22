import React from 'react';
import style from './Login.module.css';
import { LoginForm } from '../Forms/Forms';
import { InfoBar } from '../Notifications/Notifications';
import logo from '../../images/logo.png';

const Login = () => {
	return (
		<div className={style.login}>
			<div className={style.loginHeader}>
				<div className={style.logo}>
					<img src={logo} alt='logo' />
				</div>
				<div className={style.accountQuery}>
                    Don’t have an account? <a className={style.successLink} href={'/sign-up'}> Get started </a>
				</div>
			</div>
			<div className={style.container}>
				<div className={style.loginContent}>
					<h4>Sign in to Minimal</h4>
					<p>Enter your details below.</p>
					<div className={style.socialMedia}>
						<img alt='' src="https://img.icons8.com/color/48/000000/google-logo.png"/>
						<img alt='' src="https://img.icons8.com/ios/50/000000/facebook-circled--v3.png"/>                        <img alt='' src="https://img.icons8.com/ios/50/000000/twitter--v2.png"/>                    </div>
					<div className={style.linerBreaker}>
						<div className={style.line} />
						<div className={style.linerBreakerMsg}>OR</div>
						<div className={style.line} />
					</div>
					<InfoBar />
					<LoginForm />
				</div>
			</div>
		</div>
	);
};
export default Login;