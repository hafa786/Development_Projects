import React, { ChangeEvent, useEffect, useState } from 'react';
import Header from '../components/Header';
import PopupContent from '../components/PopupContent';
import axios from 'axios';
import styles from '../styles/home.module.scss';
import TemperatureMap from '../components/TemperatureMap';
import { MapData } from '../types/map';
import ModalPopup from '../components/ModalPopup';
import { messages } from '../types/messages';
import 'mapbox-gl/dist/mapbox-gl.css';
import Footer from '../components/Footer';

const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL || '';
const options = [
    { value: '°C', label: '°C (Degree Celcius)' },
    { value: '°F', label: '°F (Fahrenheit)' },
];

const Home: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [mapData, setMapData] = useState<MapData[] | null>(null);
    const [unit, setUnit] = useState<'°C' | '°F'>('°C');
    const [message, setMessage] = useState<messages | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    // handle the display temprature unit
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    // handle new upload json file
    const handleUploadFile = async () => {
        if (!file) {
            setMessage({
                type: 'ERROR',
                text: '❌ Ops! Please select a file first.',
            });
            return;
        }
        if (file.type !== 'application/json') {
            setMessage({
                type: 'ERROR',
                text: '❌ Ops! Invalid file type. Only JSON file is allowed.',
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
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
            if (response.status === 200) {
                setMessage({
                    type: 'SUCCESS',
                    text: `✅ File uploaded successfully!`,
                });
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                setMessage({
                    type: 'ERROR',
                    text: `❌ Ops! There is no data file to display the map. Please upload the new file!`,
                });
            }
        } catch (error) {
            setMessage({
                type: 'ERROR',
                text: `❌ Upload failed: ${error}`,
            });
        }
    };

    const handleTempratureDisplay = (e: any) => {
        e.preventDefault();
        setUnit(e.target.value);
        switch (e.target.value) {
            case '°C':
                //formula to convert from Fahrenheit to Celsius C = (F − 32) × 5 ⁄ 9
                const convertedToCelsius = mapData?.map((obj: MapData) => ({
                    ...obj,
                    temp: (((obj.temp - 32) * 5) / 9).toFixed(2),
                }));
                convertedToCelsius &&
                    setMapData(convertedToCelsius as MapData[]);
                break;
            case '°F':
                //formula to convert from Celsius to Fahrenheit C(9 ⁄ 5) + 32.
                const convertedToFahrenheit = mapData?.map((obj: MapData) => ({
                    ...obj,
                    temp: (obj.temp * (9 / 5) + 32).toFixed(2),
                }));
                convertedToFahrenheit &&
                    setMapData(convertedToFahrenheit as MapData[]);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const response = await axios.get(`${backendApiUrl}/api/fetch`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.status === 200) {
                    setMessage(null);
                    setMapData(response.data as MapData[]);
                }
            } catch (e) {
                setMapData(null);
                setMessage({
                    type: 'ERROR',
                    text: `❌ Ops! There is an error to fetching the data!`,
                });
            }
        };
        if (mapData === null) {
            fetchMapData();
        }
    }, [mapData]);
    return (
        <div className={styles.home}>
            <Header handler={() => [setOpen(true), setMessage(null)]} />
            <div className={styles.container}>
                {mapData ? (
                    <>
                        <select
                            value={unit}
                            onChange={handleTempratureDisplay}
                            className={styles.select}
                        >
                            {options.map((option) => (
                                <option value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className={styles.mapbox}>
                            {unit === '°C' && mapData && (
                                <TemperatureMap
                                    data={mapData}
                                    displayBy={unit}
                                />
                            )}
                            {unit === '°F' && mapData && (
                                <TemperatureMap
                                    data={mapData}
                                    displayBy={unit}
                                />
                            )}
                        </div>
                    </>
                ) : (
                    <div className={styles.noFileExist}>
                        <p>
                            Sorry! There is no data file, please upload new data
                            file to display the city's temperature map!
                        </p>
                        <button
                            onClick={() => [setOpen(true), setMessage(null)]}
                            className={styles.button}
                        >
                            Import data
                        </button>
                        <ModalPopup
                            isOpen={open}
                            onClose={() => setOpen(false)}
                            children={
                                <PopupContent
                                    handler={handleUploadFile}
                                    file={file}
                                    handleFile={handleFileChange}
                                    cancelHandler={() => setOpen(false)}
                                />
                            }
                            message={message}
                            title={'Upload File'}
                        />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Home;
