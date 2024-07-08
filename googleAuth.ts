// googleAuth.js
import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function getClient() {
    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN } = process.env;

    const oAuth2Client = new google.auth.OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI
    );

    oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
    return oAuth2Client;
}

export default getClient;
