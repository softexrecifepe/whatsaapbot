import { sendText } from "../utils/sendText";
import { cleanPhoneNumber } from "../utils/cleanPhoneNumber";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { getStudentFouls } from "../services/FAP/getStudentfoul"; // Importe a função getStudentFouls
dotenv.config();

export async function handleFaltas(userId: string) {
  const phone = userId;
  let phoneNumber = cleanPhoneNumber(phone);
  const filePath = path.resolve(__dirname, process.env.FAPJSONPATH as string);

  // Use o número de teste para desenvolvimento
  const numeroTest = "81999679376"; 
  
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo:", err);
      sendText(
        userId,
        "🤖 *Verificação de faltas:*\n" +
          "Ocorreu um erro ao tentar verificar suas faltas. Por favor, tente novamente mais tarde."
      );
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      // Verificar se jsonData é um array
      if (!Array.isArray(jsonData)) {
        throw new Error("Formato JSON inválido");
      }

      // Mapear dados para criar um array de objetos de estudantes
      const students = jsonData.map((item) => ({
        name: item.name || "N/A",
        phone: cleanPhoneNumber(item.phone_number || "N/A"),
        cpf: item.cpf || "N/A",
      }));

      const student = students.find((student) => student.phone === numeroTest);

      if (!student) {
        sendText(
          userId,
          "🤖 *Verificação de faltas:*\n" +
            "Não foi possível encontrar um estudante com o número de telefone fornecido."
        );
        return;
      }

      sendText(
        userId,
        "🤖 *Verificação de faltas:*\n" +
          `Olá, ${student.name}! Estou verificando suas faltas...`
      );

      // Buscar faltas do estudante usando o CPF
      const foulsResponse = await getStudentFouls(student.cpf);

      if ("error" in foulsResponse) {
        sendText(
          userId,
          "🤖 *Verificação de faltas:*\n" +
            "Ocorreu um erro ao verificar suas faltas. Por favor, tente novamente mais tarde."
        );
      } else if ("message" in foulsResponse) {
        sendText(
          userId,
          `🤖 *Verificação de faltas:*\n${foulsResponse.message}`
        );
      } else {
        const index = foulsResponse.CPFs.indexOf(student.cpf);
        const faltas = foulsResponse.faltas[index];

        sendText(
          userId,
          `🤖 *Verificação de faltas:*\nVocê possui ${
            faltas || 0
          } faltas registradas.`
        );
      }
    } catch (parseError) {
      console.error("Erro ao analisar JSON:", parseError);
      sendText(
        userId,
        "🤖 *Verificação de faltas:*\n" +
          "Ocorreu um erro ao tentar verificar suas faltas. Por favor, tente novamente mais tarde."
      );
    }
  });
}
