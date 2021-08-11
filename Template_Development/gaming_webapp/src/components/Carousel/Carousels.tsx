import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import style from './Carousel.module.css'
import  firstImage from '../../assets/carousel/image1.jpg';
import  secondImage from '../../assets/carousel/image2.jpg';
import  thirdImage from '../../assets/carousel/image3.jpg';
import  fourthImage from '../../assets/carousel/image4.jpg';
import  fifthImage from '../../assets/carousel/image5.jpg';
import  sixthImage from '../../assets/carousel/image6.jpg';
import  seventhImage from '../../assets/carousel/image7.jpg';
import  eightImage from '../../assets/carousel/image8.jpg';

function Carousels () {
    return (
        <div className={style.carousel}>
            <Carousel>
                <div className={style.carouselItem}>
                    <img src={firstImage} alt='Play with friends' />
                    <p className="legend">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div className={style.carouselItem}>
                    <img src={secondImage} alt='Play single handly' />
                    <p className="legend">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div className={style.carouselItem}>
                    <img src={thirdImage} alt='Play your favorite game' />
                    <p className="legend">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div className={style.carouselItem}>
                    <img src={fourthImage} alt='Play your favorite game' />
                    <p className="legend">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div className={style.carouselItem}>
                    <img src={fifthImage} alt='Play your favorite game' />
                    <p className="legend">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div className={style.carouselItem}>
                    <img src={sixthImage} alt='Play your favorite game' />
                    <p className="legend">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div className={style.carouselItem}>
                    <img src={seventhImage} alt='Play your favorite game' />
                    <p className="legend">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
                <div className={style.carouselItem}>
                    <img src={eightImage} alt='Play your favorite game' />
                    <p className="legend">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
            </Carousel>
        </div>
    );
}

export default Carousels;