import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input } from '../Inputs/Inputs';
import { getLogin } from '../../hooks/login';
import style from './Forms.module.css';

export const LoginForm = () => {
	const history = useHistory();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const handleChangeEmail =(event: React.ChangeEvent<HTMLInputElement>)=> {
		setEmail(event.target.value);
	};
	const handleChangePassword =(event: React.ChangeEvent<HTMLInputElement>)=> {
		setPassword(event.target.value);
	};
	const handleLogin = () => {
		if (getLogin(email, password)) {
			history.push('Dashboard');
		}
	}; 
	return (
		<div className={style.LoginForm}>
			<Input changeEvent={handleChangeEmail} lable={'Email address'} required={true} type={'email'} />
			<Input changeEvent={handleChangePassword} lable={'Password'} required={true} type={'password'} />
			<div className={style.formControl}>
				<div className={style.savePassword}>
					<input type={'checkbox'} /> Remember me
				</div>
				<div className={style.forgetPassword}>
					<a className={style.successLink} href='/changePassword'>Forget password?</a>
				</div>   
			</div>
			<div className={style.submitForm}>
				<button className={style.successButton} onClick={handleLogin}>Login</button>
			</div>
		</div>
	);
};