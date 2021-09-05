import React from 'react';
import style from './Inputs.module.css';

type InputProps = {
    type?: string,
    lable: string,
    placeholder?: string,
	changeEvent: React.ChangeEventHandler<HTMLInputElement>,
    required: boolean
}
export const Input = ( {type, lable, placeholder, required, changeEvent}: InputProps) => {
	return (
		<div className={style.formControl}>
			<label className={style.label}>{lable}</label>
			<input onChange={changeEvent} type={type} placeholder={placeholder} required={required} />
		</div>
	);
};

export const TextArea = ( {lable, placeholder, required}: InputProps) => {
	return (
		<div className={style.formControl}>
			<label className={style.label}>{lable}</label>
			<textarea placeholder={placeholder} required={required} />
		</div>
	);
};