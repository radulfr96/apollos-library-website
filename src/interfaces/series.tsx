import SeriesBookItem from './seriesBookItem';

export interface Series {
    seriesId: number;
    name: string;
    items: Array<SeriesBookItem>;
}

export default Series;
