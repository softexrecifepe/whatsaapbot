import fs from "fs";
import path from "path";
import dotnenvt from "dotenv";
import { cleanPhoneNumber } from "../utils/cleanPhoneNumber";
dotnenvt.config();

export async function getUserInformationByNumber(
  phoneNumber: string
): Promise<{ name: string; phone: string; CPF: string }[]> {
  const filePath = path.resolve(__dirname, process.env.FAPJSONPATH as string);

  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Failed to read file");
        reject(new Error("Failed to read file"));
        return;
      }

      try {
        const jsonData = JSON.parse(data);

        if (!Array.isArray(jsonData)) {
          throw new Error("Invalid JSON format");
        }

        const students = jsonData
          .map((item) => ({
            name: item.name || "N/A",
            phone: cleanPhoneNumber(item.phone_number || "N/A"),
            CPF: item.cpf || "N/A",
          }))
          .filter((student) => student.phone === phoneNumber);

        resolve(students);
      } catch (parseError) {
        console.error("Failed to parse JSON");
        reject(new Error("Failed to parse JSON"));
      }
    });
  });
}
