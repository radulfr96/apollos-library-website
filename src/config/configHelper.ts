export default class ConfigHelper {
    apiUrl: string;

    idpUrl: string;

    constructor() {
        if (process.env.NODE_ENV === 'development') {
            this.apiUrl = 'https://localhost:5004';
            this.idpUrl = 'https://localhost:5001';
        } else if (process.env.NODE_ENV.toString() === 'production') {
            this.apiUrl = 'https://webapi.apolloslibrary.com';
            this.idpUrl = 'https://idp.apolloslibrary.com';
        } else {
            this.apiUrl = '';
            this.idpUrl = '';
        }
    }
}
