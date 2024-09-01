import { Request, Response } from "express";
import { getAuthSheets } from "../services/googleAuthService";

export async function getSheetData(req: Request, res: Response) {
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
            F: headers.indexOf("F"),
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
                F: row[columnIndices.F] || "",
            }))
            .filter(row => row.Alunos && row.Turma && row.CPF && row.F); // Remove rows with empty values

        res.json(filteredData);

    } catch (error) {
        console.error("Error retrieving sheet data:", error);
        res.status(500).json({ error: "An error occurred while retrieving the sheet data." });
    }
}

