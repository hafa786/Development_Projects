import React from 'react';
import style from './Inputs.module.css';

type InputProps = {
	text: string,
	value: string,
	disable: boolean,
	error: boolean,
	errorMessage?: string,
	action: React.ChangeEventHandler<HTMLInputElement>
}

export const Input = ({text, value, disable, error, errorMessage, action}: InputProps) => {
	return (
		<> 
			<input
				onChange={action}
				value={value}
				disabled={disable}
				className={[style.input, error ? style.error : ''].join(' ')}
				type='text'
				placeholder={text}
			/>
			{error ? <div className={style.error}>{errorMessage}</div> : ''}
		</>
	);
};

type OptionValue = string | string;

type Option<T extends OptionValue> = {
	value: T;
	label: string;
};
type Props<T extends OptionValue> = {
	options: Option<T>[];
	value: T;
	onChange: React.ChangeEventHandler<HTMLSelectElement>;
};
export function Select<T extends OptionValue>(props: Props<T>) {
	return (
		<div className={style.dropDownMenu}>
			<select className={style.select} value={props.value} onChange={props.onChange}>
				{props.options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
