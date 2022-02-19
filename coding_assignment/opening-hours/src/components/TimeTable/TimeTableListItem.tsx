import React from 'react';
import { FormatedData } from '../../utills/types';
import { WeekDays } from '../../utills/constants';
import style from './TimeTable.module.css';

type TimeTableListItemProps = {
	data: FormatedData,
};

const TimeTableListItem = ({data}: TimeTableListItemProps) => {
	const durationToString = (duration: number) => {
		const hours = duration / 3600;
		if (hours > 12) {
			return (hours - 12).toString() + 'PM';
		}
		return hours.toString() + 'AM';
	};
	const formating = (() => {
		let time = '';
		(data.data as any).map((times:any) => {
			if (times.type === 'open') {
				time = time + (durationToString(times.value));
			} else {
				time = time + (' - ' + (durationToString(times.value)) + ' ');
			}
		});
		if (time === '') {
			return <>Closed</>
		}
		return <>{time}</>
	})();
	const tooltip = (() => {
		const date = new Date();
		if (WeekDays[date.getDay() - 1] === data.day) {
			return 'Today';
		}
		return '';
	})();
	return (
		<div className={style.timeTableList} key={data.day}>
			<div className={style.day}>
				{data.day}
				<div className={style.tooltip}>
					{tooltip}
				</div>
			</div>
			<div className={style.time}>{formating}</div>
		</div>
	);
};

export default TimeTableListItem;