import axios from 'axios';
import react, { useEffect, useState } from 'react';

import style from './ImportSection.module.css';

const ImportSection = () => {
    const [data, setData] = useState<any>();
    const fetchData = async () => {
        const apiUrl = 'http://localhost:8080/'
        const res = await axios.post(apiUrl + 'fetch-data', {});
        setData(res);
        console.log(res.data);
    }
    useEffect(() => {
        if (!data ) {
            fetchData();
        }
    });
    return (
        <div className={style.importSection}>
            <input type="text" placeholder="Enter the data" />
            <button>Import</button>
        </div>
    );
}

export default ImportSection;