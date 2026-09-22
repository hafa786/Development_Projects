import React from 'react';
import ErrorOutlinedIcon from '@material-ui/icons/ErrorOutlined';
import style from './Notifications.module.css';

export const InfoBar = () => {
	return (
		<div className={style.infoBar}>
			<ErrorOutlinedIcon />
			<div className={style.infoBarMessage}>Use email : <b>hafiz@designstack.com</b> / password : <b>demo1234</b></div>
		</div>
	);
};