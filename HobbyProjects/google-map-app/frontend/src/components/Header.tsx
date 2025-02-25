import React from 'react';
import { useState } from 'react';
import Menu from './Menu';
import styles from '../styles/components.module.scss';

const Header: React.FC = () => {
    const [toggle, setToggle] = useState<boolean>(false);
    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>Logo</div>
                <div className={styles.menu}>
                    <Menu toggle={toggle} onClick={() => setToggle(!toggle)} />
                    <div className=""></div>
                </div>
            </div>
        </div>
    );
};

export default Header;
