import React from 'react';
import styles from '../styles/components.module.scss';

type ButtonProps = {
    text: string;
    handler: () => void;
};

export const PrimaryButton: React.FC<ButtonProps> = ({ text, handler }) => {
    return (
        <button onClick={handler} className={styles.primaryButton}>
            {text}
        </button>
    );
};

export const SecondryButton: React.FC<ButtonProps> = ({ text, handler }) => {
    return (
        <button onClick={handler} className={styles.secondryButton}>
            {text}
        </button>
    );
};
