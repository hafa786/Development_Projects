import { FormatedData, ParseData } from '../../utills/types';
import style from './TimeTable.module.css';

type TimeTableListItemProps = {
    data: FormatedData,
}
const TimeTableListItem = ({data}: TimeTableListItemProps) => {
    const formating = (() => {
        console.log(data);
        return <></>
    })();
    return (
        <div className={style.timeTableList} key={data.day}>
            <div className={style.day}>{data.day}</div>
            {/* <div className={style.time}>{JSON.stringify(data.data)}</div> */}
            {formating}
        </div>
    );
}

export default TimeTableListItem;