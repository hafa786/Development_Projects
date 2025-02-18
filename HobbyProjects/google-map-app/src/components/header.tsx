import { useState } from 'react';
import styles from '../styles/components.module.scss';
import MenuIcon from './menu-icon';
const Header: React.FC = () => {
    const [toggle, setToggle] = useState<boolean>(false);
    return (
        <div className={styles.header}>
            <div className={styles.container}>
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
