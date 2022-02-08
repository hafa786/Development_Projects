import { ParseData, FormatedData, DaysOfWeek } from './types';

export function getKeys(data: ParseData): Array<string> {
    const dataKeys = Object.keys(data);
    console.log(dataKeys);
    return dataKeys;
};

// export function formatedTiming (arr: Array<OpeningData>) {
//     console.log(arr);
//     arr.map((timing) => {
//         console.log(timing.value / 3600);
//     });
   
// }

export function formulatedData(data: any ) {
    const dataKeys = Object.keys(data);
    let roughTimeByDay = dataKeys.map((key:string) => (data[key]));
    const forulmatedTimeByDays = roughTimeByDay.map(currentDay => {
        if (currentDay.length % 2 != 0 ) {
            const nextIndex = roughTimeByDay.indexOf(currentDay) + 1;
            if (roughTimeByDay[nextIndex] && roughTimeByDay[nextIndex][0]) {
                currentDay.push(roughTimeByDay[nextIndex][0]);
                roughTimeByDay[nextIndex].splice(0, 1);
            }
        }
        return currentDay;
    });
    return forulmatedTimeByDays;
}
export function attachedDayWithTime(days:DaysOfWeek, data:ParseData[]) {
    const responseTiming:FormatedData[] = [];
    data.map(d => responseTiming.push({ day: days[data.indexOf(d)], data : d }));
    if (responseTiming) {
        return responseTiming;
    }
    return responseTiming;
}
export function parsingOpeningTime (data: any) {
    const dataKeys:DaysOfWeek = Object.keys(data);
    const regularData = formulatedData(data);
    // console.log(regularData); 
    return attachedDayWithTime(dataKeys, regularData);
    //const dataKeys = Object.keys(data);
    //const opening
    // console.log(dataKeys.map((key:string) => (data[key])
    //     .map((dailyData:OpeningData) => {
    //         return [(dailyData.value / 3600), dailyData.type]
    //     }
    // )));
    // formulating the hours
    // let hoursArray = dataKeys.map((key:string) => (data[key])
    //     .map((dailyData:OpeningData) => {
    //         return [(dailyData.value / 3600), dailyData.type]
    //     }
    // ));
    
    // console.log(hoursArray);
    // find closing hours
    // hoursArray.map((element) => {
    //     //console.log(i);
    //     console.log(element.slice(-1).type);
    //     if (element.slice(-1).type !== 'close') {
    //         console.log('closing next day');
    //         console.log(element.slice(-1).type);
    //     }
    // });

    // let hoursArray = dataKeys.map((key:string) => (data[key]));
    // const formulatedData = hoursArray.map(hours => {
    //     if (hours.length % 2 != 0 ) {
    //         const nextIndex = hoursArray.indexOf(hours) + 1;
    //         if (hoursArray[nextIndex] && hoursArray[nextIndex][0]) {
    //             hours.push(hoursArray[nextIndex][0]);
    //             hoursArray[nextIndex].splice(0, 1);
    //         }
    //     }
    //     return hours;
    // });
    // console.log(formulatedData);
}