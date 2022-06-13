import { Guid } from 'guid-typescript';

interface EntryReportListItem {
    reportId: number;
    entryId: number;
    entryTypeId: number;
    entryType: string;
    entryStatusId: number;
    entryStatus: string;
    reportedBy: Guid;
    reportedDate: Date;
    createdBy: Guid;
    createdDate: Date;
}

export default EntryReportListItem;
