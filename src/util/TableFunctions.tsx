export type Order = 'asc' | 'desc';

export default class TableHelper {
     public desc<T>(a: T, b: T, orderBy: keyof T): number {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    public stableSort<T>(array: T[], cmp: (a: T, b: T) => number): T[] {
        const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    public getSorting<K extends keyof any>(
      order: Order,
      orderBy: K,
    ): (a: { [key in K]: number | string }, b: { [key in K]: number | string }) => number {
      return order === 'desc' ? (a, b) => this.desc(a, b, orderBy) : (a, b) => -this.desc(a, b, orderBy);
    }
}
