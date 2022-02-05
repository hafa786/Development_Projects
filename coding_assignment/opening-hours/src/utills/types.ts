export type TooltipProps = {
    text: string,
};

export type ParseData = Object;

export enum STATUS {
    closed = 'close',
    open = 'open',
}
export type OpeningData = {
    type: string;
    value: number
}