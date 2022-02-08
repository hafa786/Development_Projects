export type TooltipProps = {
    text: string,
};

export type ParseData = {
    type: string;
    value: number
};

export enum STATUS {
    closed = 'close',
    open = 'open',
}
// export type OpeningData = {
//     type: string;
//     value: number
// }
export type DaysOfWeek = string[];

export type FormatedData = {
    day: string,
    data: ParseData
}