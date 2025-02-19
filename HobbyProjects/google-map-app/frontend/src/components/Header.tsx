import React from 'react';
import { useState } from 'react';
import styles from '../styles/components.module.scss';
import MenuIcon from './MenuItem';
const Header: React.FC = () => {
    const [toggle, setToggle] = useState<boolean>(false);
    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>Logo</div>
                <div className={styles.menu}>
                    <MenuIcon
                        toggle={toggle}
                        onClick={() => setToggle(!toggle)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;
