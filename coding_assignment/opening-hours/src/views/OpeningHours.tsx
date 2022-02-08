
import TimingBoard from '../components/TimeTable/TimeTable';
import style from './OpeningHours.module.css';

const OpeningHours = () => {

    return (
        <div className={style.OpeningHours}>
            <TimingBoard />
        </div>
    );
     
}

export default OpeningHours;