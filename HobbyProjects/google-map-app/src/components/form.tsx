import React from 'react';
import styles from '../styles/components.module.scss';
import Select from 'react-select/dist/declarations/src/Select';

const options = [
    { value: 'Degree Celcius', label: '°C Celcius' },
    { value: 'Fahrenheit', label: '°F Fahrenheit' },
];

type Props = {
    file: File | null;
    handler: () => void;
};

const Form: React.FC<Props> = ({ file, handler }) => {
    return (
        <div className={styles.form}>
            <p>
                Please uploads a data file and a map is shown with locations'
                temperatures according to the data.
            </p>
            <div className={styles.fileInput}>
                <input type="file" onChange={handler} />
                {file && <p>Selected File: {file.name}</p>}
            </div>
            <button className={styles.button}>Import data</button>
            <div className={styles.displayBy}>
                <select
                    value=""
                    onChange={(e) => null}
                    className="custom-select"
                >
                    <option value="" selected>
                        Display temperature
                    </option>
                    {options.map((option) => (
                        <option value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default Form;
