import React from 'react';
import { useState } from 'react';
import Menu from './Menu';
import styles from '../styles/components.module.scss';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FileUploadSharpIcon from '@mui/icons-material/FileUploadSharp';

type HeaderProps = {
    handler: any;
};
const Header: React.FC<HeaderProps> = ({ handler }) => {
    const [toggle, setToggle] = useState<boolean>(false);
    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>Logo</div>
                <div className={styles.menu}>
                    <Menu toggle={toggle} onClick={() => setToggle(!toggle)} />
                </div>
                <div className={toggle ? styles.menuItems : styles.disabled}>
                    <div className={styles.item} onClick={handler}>
                        <FileUploadSharpIcon /> Upload file
                    </div>
                    <div className={styles.item}>
                        <AccountCircleIcon />
                        Profile
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
