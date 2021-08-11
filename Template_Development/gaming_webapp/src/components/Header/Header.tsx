import React from 'react';
import style from './Header.module.css';
import logo from '../../assets/logo-1.png'
import Navigation from '../Navigation/Navigation';

function Header() {
    return (
        <div className={style.header}>
            <div className={style.headerTopBar} >
                <div className={style.email}>
                    info@gamingzone.com
                </div>
                <div className={style.contact}>
                    +358410000000
                </div>
                <div className={style.socialMedia}>
                    <img src='' alt='' />
                </div>
            </div>
            <div className={style.logo}>
                <img src={logo} alt='Gaming zone' />
            </div>
            <Navigation />
        </div>
    );
}
export default Header;