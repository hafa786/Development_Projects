import axios from 'axios';
import { useEffect, useState } from 'react';
import Tooltip from '../Tooltip/Tooltip';
import { getKeys, parsingOpeningTime } from '../../utills/functions';
import style from './TimeTable.module.css';
import TimeTableList from './TimeTableList';
import { FormatedData } from '../../utills/types';

const TimeTable = () => {
    const [parseData, setParseData] = useState<Array<FormatedData>>();
    const fetchData = async () => {
        const apiUrl = 'http://localhost:8080/'
        const res = await axios.post(apiUrl + 'fetch-data', {});
        //setData(res);
        //console.log(res.data);
        // console.log(getKeys(res.data));
        const formattedData = parsingOpeningTime(res.data);
        console.log(formattedData);
        setParseData(formattedData);
    }
    useEffect(() => {
        if (!parseData ) {
            fetchData();
        }
    });
    const getTimeTable = (() => {
        if (parseData ) {
            return <TimeTableList data={parseData} />;
        }
        return <></>;
    })();
    return (
        <div className={style.timetable}>
            <div className={style.heading}>
                <span className="material-icons">schedule</span>
                <div>Opening hours</div>
            </div>
            {getTimeTable}
            {/* <div className={style.timingList}>
                <div className={style.day}>Monday</div>
                <div className={style.time}>10 AM - 6 PM</div>
            </div>
            <div className={style.lineBreak} />
            <div className={style.timingList}>
                <div className={style.day}>Tuesday</div>
                <div className={style.time}>10 AM - 6 PM</div>
            </div>
            <div className={style.lineBreak} />
            <div className={style.timingList}>
                <div className={style.day}>
                    Wednesday
                    <Tooltip text="Today" />
                </div>
                <div className={style.time}>10 AM - 6 PM</div>
            </div>
            <div className={style.lineBreak} />
            <div className={style.timingList}>
                <div className={style.day}>Thursday</div>
                <div className={style.time}>10 AM - 6 PM</div>
            </div>
            <div className={style.lineBreak} />
            <div className={style.timingList}>
                <div className={style.day}>Friday</div>
                <div className={style.time}>10 AM - 6 PM</div>
            </div>
            <div className={style.lineBreak} />
            <div className={style.timingList}>
                <div className={style.day}>Saturday</div>
                <div className={style.time}>10 AM - 6 PM</div>
            </div>
            <div className={style.lineBreak} />
            <div className={style.timingList}>
                <div className={style.day}>Sunday</div>
                <div className={style.time}>10 AM - 6 PM</div>
            </div> */}
        </div>
    );
}

export default TimeTable;