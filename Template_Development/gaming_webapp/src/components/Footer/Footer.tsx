import React from 'react';
import style from './Footer.module.css';
import { Button } from '@material-ui/core';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

function Footer() {
    return (
        <>
        <div className={style.footer}>
            <div className={style.footerItem}>
                <h3 className={style.footerHeadring}>Important links</h3>
                <ul className={style.links}>About us</ul>
                <ul className={style.links}>Ongoing events</ul>
                <ul className={style.links}>Incoming events</ul>
                <ul className={style.links}>Login</ul>
                <ul className={style.links}>Sign up</ul>
            </div>
            <div className={style.footerItem}>
                <h3 className={style.footerHeadring}>Company</h3>
                <ul className={style.links}>Career</ul>
                <ul className={style.links}>Sales noted</ul>
                <ul className={style.links}>Feedback</ul>
                <ul className={style.links}>Complain center</ul>
            </div>
            <div className={style.footerItem}>
                <h3 className={style.footerHeadring}>Social media</h3>
                <ul className={style.links}>
                    <LinkedInIcon />LinkedIn</ul>
                <ul className={style.links}>Facebook</ul>
                <ul className={style.links}>Instagram</ul>
                <ul className={style.links}>Youtube</ul>
            </div>
        </div>
        <div className={style.copyRight}>
            MIT© 2021 Hafiz Sikandar, Inc. All rights reserved.
        </div>
        </>
    );
}
export default Footer;