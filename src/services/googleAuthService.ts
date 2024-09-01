const { google } = require("googleapis");

export async function getAuthSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "fapCredentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetsId = "1mf_urI5uGBkbCfMONjVofvhdkEFU4A-nn2JFNdWe58Q";

    return {
        auth,
        client,
        googleSheets,
        spreadsheetsId,
    };
}