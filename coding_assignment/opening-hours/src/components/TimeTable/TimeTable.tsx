import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { parsingOpeningTime } from '../../utills/functions';
import style from './TimeTable.module.css';
import TimeTableList from './TimeTableList';
import { FormatedData } from '../../utills/types';

const TimeTable = () => {
	const [parseData, setParseData] = useState<Array<FormatedData>>();
	const fetchData = async () => {
		const apiUrl = 'http://localhost:8080/'
		const res = await axios.post(apiUrl + 'fetch-data', {});
		const formattedData = parsingOpeningTime(res.data);
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
		</div>
	);
}

export default TimeTable;