import React from 'react';
import TimeTableListItem from './TimeTableListItem';
import style from './TimeTable.module.css';
import { FormatedData } from '../../utills/types';

type TimeTableListProps = {
	data: FormatedData[]
};

const TimeTableList = ({data} : TimeTableListProps) => {
	return (
		<div className={style.timeTableList}>
			{data.map(d =>
				<TimeTableListItem key={d.day} data={d} />
			)}
		</div>
	);
};

export default TimeTableList;