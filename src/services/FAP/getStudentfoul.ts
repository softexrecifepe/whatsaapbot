import dotnenvt from "dotenv";
dotnenvt.config();
import { getAuthSheets } from "../googleAuthService";

export async function getStudentFouls(
  cpf: string
): Promise<
  { CPFs: string[]; faltas: string[] } | { message: string } | { error: string }
> {
  try {
    const { googleSheets, spreadsheetsId } = await getAuthSheets();

    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetsId,
      range: "Relatório Geral",
    });

    const { data } = response;

    if (!data.values || data.values.length === 0) {
      return { message: "No data found." };
    }

    const headers = data.values[0];
    const rows = data.values.slice(1);

    const columnIndices = {
      CPF: headers.indexOf("CPF"),
      F: headers.indexOf("F"),
    };

    if (Object.values(columnIndices).includes(-1)) {
      return { message: "One or more required columns not found." };
    }

    const filteredData = rows
      .map((row: { [x: string]: any }) => ({
        CPF: row[columnIndices.CPF] || "",
        F: row[columnIndices.F] || "",
      }))
      .filter((student: { F: string }) => student.F !== "");

    return {
      CPFs: filteredData.map((student: { CPF: string }) => student.CPF),
      faltas: filteredData.map((student: { F: string }) => student.F),
    };
  } catch (error) {
    console.error("Error retrieving sheet data:", error);
    return { error: "An error occurred while retrieving the sheet data." };
  }
}
