export default class ConfigHelper {
    apiUrl: string;

    idpUrl: string;

    constructor() {
        if (process.env.NODE_ENV === 'development') {
            this.apiUrl = 'https://localhost:5004';
            this.idpUrl = 'https://localhost:5001';
        } else {
            this.apiUrl = '';
            this.idpUrl = '';
        }
    }
}
