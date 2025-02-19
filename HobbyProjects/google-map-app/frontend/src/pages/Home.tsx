import React, { ChangeEvent, useEffect, useState } from 'react';
import Header from '../components/Header';
import Form from '../components/Form';
import axios from 'axios';
import styles from '../styles/home.module.scss';
// import ReactMapboxGl, { Layer, Feature } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from '../components/Map';
import map from '../images/map.png';
import { MapData } from '../types/map';

console.log('Backend API URL:', process.env.REACT_APP_BACKEND_API_URL);

const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL || '';

const Home: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [mapData, setMapData] = useState<Array<MapData> | null>();
    const [message, setMessage] = useState<any>(
        process.env.NODE_JS_BACKEND_API_URL,
    );

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadFile = async () => {
        if (!file) {
            setMessage('⚠️ Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        try {
            const response = await axios.post(
                `${backendApiUrl}/api/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );
            setMessage(
                `✅ File uploaded successfully: ${JSON.stringify(response.data)}`,
            );
        } catch (error) {
            setMessage(`❌ Upload failed: ${error}`);
        }
    };
    useEffect(() => {}, []);
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <Form
                    handler={handleUploadFile}
                    file={file}
                    handleFile={handleFileChange}
                />
                {JSON.stringify(message)}
                {mapData && (
                    <div className={styles.map}>
                        <img src={map} alt="location map" />
                    </div>
                )}
                {/* <Map data={mapData} displayBy="°C" /> */}
            </div>
        </div>
    );
};

export default Home;
