import React, { ChangeEvent, useState } from 'react';
import styles from '../styles/components.module.scss';

const options = [
    { value: '°C', label: '°C (Degree Celcius)' },
    { value: '°F', label: '°F (Fahrenheit)' },
];

type Props = {
    file: File | null;
    handler: () => void;
    handleFile: any;
};

const Form: React.FC<Props> = ({ file, handler, handleFile }) => {
    const [scale, setScale] = useState<string>('');
    return (
        <div className={styles.form}>
            <p>{scale}</p>
            <p>
                Please uploads a data file and a map is shown with locations'
                temperatures according to the data.
            </p>
            <div className={styles.fileInput}>
                <input type="file" onChange={handleFile} />
                {file && <p>Selected File: {file.name}</p>}
            </div>
            <button onClick={handler} className={styles.button}>
                Import data
            </button>
            <div className={styles.displayBy}>
                <select
                    value={scale}
                    onChange={(e) => setScale(e.target.value)}
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
