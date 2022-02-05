import axios from 'axios';
import { useEffect, useState } from 'react';
import Tooltip from './../Tooltip/Tooltip';
import { getKeys, parseData } from '../../utills/functions';
import './TimingBoard.css';

const TimingBoard = () => {
    const [data, setData] = useState<any>();
    const fetchData = async () => {
        const apiUrl = 'http://localhost:8080/'
        const res = await axios.post(apiUrl + 'fetch-data', {});
        setData(res);
        console.log(res.data);
        console.log(getKeys(res.data));
        parseData(res.data);
    }
    useEffect(() => {
        if (!data ) {
            fetchData();
        }
    });
    return (
        <div className="timingBoard">
            <div className="heading">
                <span className="material-icons">schedule</span>
                <div>Opening hours</div>
            </div>
            <div className="timing-list">
                <div className="day">Monday</div>
                <div className="time">10 AM - 6 PM</div>
            </div>
            <div className="line-break" />
            <div className="timing-list">
                <div className="day">Tuesday</div>
                <div className="time">10 AM - 6 PM</div>
            </div>
            <div className="line-break" />
            <div className="timing-list">
                <div className="day">
                    Wednesday
                    <Tooltip text="Today" />
                </div>
                <div className="time">10 AM - 6 PM</div>
            </div>
            <div className="line-break" />
            <div className="timing-list">
                <div className="day">Thursday</div>
                <div className="time">10 AM - 6 PM</div>
            </div>
            <div className="line-break" />
            <div className="timing-list">
                <div className="day">Friday</div>
                <div className="time">10 AM - 6 PM</div>
            </div>
            <div className="line-break" />
            <div className="timing-list">
                <div className="day">Saturday</div>
                <div className="time">10 AM - 6 PM</div>
            </div>
            <div className="line-break" />
            <div className="timing-list">
                <div className="day">Sunday</div>
                <div className="time">10 AM - 6 PM</div>
            </div>
        </div>
    );
}

export default TimingBoard;