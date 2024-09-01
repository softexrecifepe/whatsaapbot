const express = require("express");
const { google } = require("googleapis");

const app = express();
const port = 1234;

app.get("/", (req, res) => {
    res.send("hello world");
});

async function getAuthSheets() {
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

app.get("/get-sheet", async (req, res) => {
    try {
        const { googleSheets, spreadsheetsId } = await getAuthSheets();

        const response = await googleSheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetsId,
            range: "Relatório Geral",
        });

        const { data } = response;
        if (!data.values || data.values.length === 0) {
            return res.json({ message: "No data found." });
        }

        // Extract headers and data rows
        const headers = data.values[0];
        const rows = data.values.slice(1);

        // Define the indices of the required columns
        const columnIndices = {
            Alunos: headers.indexOf("Alunos"),
            Turma: headers.indexOf("Turma"),
            CPF: headers.indexOf("CPF"),
            P: headers.indexOf("P"),
        };

        if (Object.values(columnIndices).includes(-1)) {
            return res.status(400).json({ message: "One or more required columns not found." });
        }

        // Filter rows to include only the specified columns and remove invalid rows
        const filteredData = rows
            .map(row => ({
                Alunos: row[columnIndices.Alunos] || "",
                Turma: row[columnIndices.Turma] || "",
                CPF: row[columnIndices.CPF] || "",
                P: row[columnIndices.P] || "",
            }))
            .filter(row => row.Alunos && row.Turma && row.CPF && row.P); // Remove rows with empty values

        res.json(filteredData);

    } catch (error) {
        console.error("Error retrieving sheet data:", error);
        res.status(500).json({ error: "An error occurred while retrieving the sheet data." });
    }
});

app.listen(port, () => {
    console.log(`online in http://localhost:${port}`);
});
