const { google } = require("googleapis");
import dontenv from "dotenv";
dontenv.config();

export async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_FAP_CREDENTIALS_KEY_FILE,
        scopes: process.env.GOOGLE_FAP_SCOPES_SHEETS_API,
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetsId = process.env.GOOGLE_SPREADSHEET_ID;

    return {
        auth,
        client,
        googleSheets,
        spreadsheetsId,
    };
}