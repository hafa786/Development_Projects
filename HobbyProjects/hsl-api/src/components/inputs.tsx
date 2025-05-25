import React from 'react';
import '../styles/global.scss'; // Import SCSS file

interface TextInputProps {
  lable: string;
  type: string;
  placeholder: string;
  required: boolean;
  val: string;
  eventHandler: any;
}
export const TextInput: React.FC<TextInputProps> = ({
  lable,
  type,
  placeholder,
  required = false,
  val,
  eventHandler,
}) => {
  return (
    <div className="text-input">
      <div className="input-container">
        <input
          type={type}
          id="styledInput"
          placeholder={placeholder}
          required={required}
          value={val}
          onChange={eventHandler}
        />
        <label htmlFor="styledInput">{lable}</label>
      </div>
    </div>
  );
};
