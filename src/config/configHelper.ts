export default class ConfigHelper {
    apiUrl: string;

    constructor() {
        if (process.env.NODE_ENV === 'development') {
            this.apiUrl = 'https://localhost:5004';
        } else {
            this.apiUrl = '';
        }
    }
}
