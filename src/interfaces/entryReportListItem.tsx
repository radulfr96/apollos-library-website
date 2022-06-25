import { Guid } from 'guid-typescript';
import EntryTypeEnum from '../enums/entryTypeEnum';

interface EntryReportListItem {
    reportId: number;
    entryRecordId: number;
    entryTypeId: EntryTypeEnum;
    entryType: string;
    entryStatusId: number;
    entryStatus: string;
    reportedBy: Guid;
    reportedDate: Date;
    createdBy: Guid;
    createdDate: Date;
}

export default EntryReportListItem;
