import { Guid } from 'guid-typescript';
import SeriesBookItem from './seriesBookItem';

export interface Series {
    seriesId: number;
    seriesRecordId: number;
    name: string;
    items: Array<SeriesBookItem>;
    createdBy: Guid;
}

export default Series;
