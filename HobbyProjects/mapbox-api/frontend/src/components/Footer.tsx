import React from 'react';
import styles from '../styles/components.module.scss';

const Footer: React.FC = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.container}>
                <center className={styles.copyright}>
                    Copyright © 2025 MIT Licence
                </center>
            </div>
        </div>
    );
};

export default Footer;
