import React from 'react';
import styles from '../styles/components.module.scss';
import { PrimaryButton, SecondryButton } from './Buttons';

type Props = {
    file: File | null;
    handler: () => void;
    handleFile: any;
    cancelHandler: () => void;
};

const PopupContent: React.FC<Props> = ({
    handler,
    handleFile,
    cancelHandler,
}) => {
    return (
        <div className={styles.popupContent}>
            <p className={styles.descriptoion}>
                Please upload a data file to display the provided cities
                temperature.
            </p>
            <div className={styles.fileInput}>
                <input type="file" onChange={handleFile} />
            </div>
            <div className={styles.actions}>
                <SecondryButton text={'Cancel'} handler={cancelHandler} />
                <PrimaryButton text={'Import data'} handler={handler} />
            </div>
        </div>
    );
};

export default PopupContent;
