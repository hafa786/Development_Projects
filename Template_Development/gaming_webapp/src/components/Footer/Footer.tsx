import React from 'react';
import style from './Footer.module.css';

function Footer() {
    return (
        <div className={style.footer}>
            <div className={style.footerItem}>
                <h3>Important links</h3>
                <ul>Lorem Ipsum is simply dummy</ul>
                <ul>Lorem Ipsum is simply dummy</ul>
                <ul>Lorem Ipsum is simply dummy</ul>
            </div>
        </div>    
    );
}
export default Footer;