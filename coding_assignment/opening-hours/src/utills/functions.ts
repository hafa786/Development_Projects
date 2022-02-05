import { ParseData, OpeningData } from './types';

export function getKeys(data: ParseData): Array<string> {
    const dataKeys = Object.keys(data);
    console.log(dataKeys);
    return dataKeys;
};

export function formatedTiming (arr: Array<OpeningData>) {
    console.log(arr);
    arr.map((timing) => {
        console.log(timing.value / 3600);
    });
   
}


export function parseData (data:any) {
    const dataKeys = Object.keys(data);
    //const opening
    console.log(dataKeys.map((key:string) => (data[key])
        .map((dailyData:OpeningData) => {
            return [(dailyData.value / 3600), dailyData.type]
        }
    )));
    // formulating the hours
    let hoursArray = dataKeys.map((key:string) => (data[key])
        .map((dailyData:OpeningData) => {
            return [(dailyData.value / 3600), dailyData.type]
        }
    ));
    // find closing hours
    hoursArray.map((element) => {
        //console.log(i);
        console.log(element.slice(-1).type);
        if (element.slice(-1).type !== 'close') {
            console.log('closing next day');
            console.log(element.slice(-1).type);
        }
    });
}