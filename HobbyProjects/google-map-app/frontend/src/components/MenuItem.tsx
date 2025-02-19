import React from 'react';
import styles from '../styles/components.module.scss';

type Props = {
    toggle: boolean;
    onClick: () => void;
};

const MenuIcon: React.FC<Props> = ({ onClick }) => {
    return (
        <div className={styles.menuIcon} onClick={onClick}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default MenuIcon;
