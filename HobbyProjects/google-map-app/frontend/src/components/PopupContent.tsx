import React from 'react';
import styles from '../styles/components.module.scss';
import { PrimaryButton, SecondryButton } from './Buttons';

type Props = {
    file: File | null;
    handler: () => void;
    handleFile: any;
};

const PopupContent: React.FC<Props> = ({ file, handler, handleFile }) => {
    return (
        <div className={styles.popupContent}>
            <p className={styles.descriptoion}>
                Please upload a data file and a map is shown with locations
                temperatures according to the data.
            </p>
            <div className={styles.fileInput}>
                <input type="file" onChange={handleFile} />
            </div>
            <div className={styles.actions}>
                <SecondryButton text={'Cancel'} handler={handler} />
                <PrimaryButton text={'Import data'} handler={handler} />
            </div>
        </div>
    );
};

export default PopupContent;
