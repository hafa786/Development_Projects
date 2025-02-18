import React, { useState } from 'react';
import Header from '../components/header';
import Form from '../components/form';
import styles from '../styles/home.module.scss';
// import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from '../components/map';

const Home: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const mapData = [
        { lat: 40.7128, lon: -74.006, temp: 25, city: 'New York' }, // New York
        { lat: 34.0522, lon: -118.2437, temp: 30, city: 'Los Angeles' }, // Los Angeles
        { lat: 51.5074, lon: -0.1278, temp: 18, city: 'London' }, // London
    ];
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <Form handler={() => null} file={file} />
                {/* <div className={styles.map}>
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img src={map} />
                </div> */}
                <Map data={mapData} displayBy="°C" />
            </div>
        </div>
    );
};

export default Home;
