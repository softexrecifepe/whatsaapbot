import express, { Request, Response } from "express";
import { create, Whatsapp } from "venom-bot";
import { greetingMessages } from "./src/templates/greetingMessage";
const { google } = require("googleapis");
import fs from 'fs';
import path from 'path';

export const app = express();
app.use(express.json());

let client: Whatsapp;

create({
  session: "zap",
}).then((clientInstance) => {
  client = clientInstance;

  const conversationState: { [key: string]: { state: string; timeout?: NodeJS.Timeout } } = {};

  client.onMessage(async (message) => {
    const userId = message.from;
    const userMessage = message.body.toLowerCase();
    //console.log(message);

    if (conversationState[userId]) {
      clearTimeout(conversationState[userId].timeout);
      handleConversation(userId, userMessage);
    } else if (greetingMessages.includes(userMessage)) {
      await startConversation(userId);
    } else {
      client.sendText(
        userId,
        "🤖 *Olá! Eu sou o bot Softex. Para iniciar, por favor digite uma saudação ou um comando válido.*"
      );
    }
  });

  async function startConversation(userId: string) {
    try {
      const contact = await client.getContact(userId);
      const userName = contact.name || 'usuário';

      conversationState[userId] = { state: "awaiting_command" };

      await client.sendText(
        userId,
        `🤖 *Olá, ${userName}! Eu sou o bot Softex, estou aqui para ajudar com várias tarefas!*\n\n` +
        `Aqui estão alguns comandos que você pode usar:\n\n` +
        `*!ajuda* - Mostrar esta lista de comandos.\n` +
        `*!info* - Obter informações gerais.\n` +
        `*!contato* - Obter detalhes de contato.\n\n` +
        `Além disso, você pode verificar:\n\n` +
        `*!faltas* - Verificar suas faltas.\n`
      );

      startTimeout(userId);
    } catch (error) {
      console.error("Erro ao obter o contato:", error);
      await client.sendText(
        userId,
        "🤖 *Olá! Eu sou o bot Softex. Não consegui recuperar seu nome. Por favor, informe um comando ou digite uma saudação para começar.*"
      );
    }
  }

  function handleConversation(userId: string, userMessage: string) {
    switch (conversationState[userId].state) {
      case "awaiting_command":
        if (userMessage === "!ajuda") {
          client.sendText(
            userId,
            "🤖 *Aqui está a lista de comandos:*\n\n" +
            "1. *Secretaria* - Informações e assistência relacionadas à Secretaria.\n" +
            "2. *Coordenação* - Informações e assistência relacionadas à Coordenação.\n" +
            "3. *Outros* - Outras informações e assistências gerais.\n\n" +
            "*Comandos adicionais:*\n" +
            "4. *!faltas* - Verificar suas faltas.\n"
          );
          conversationState[userId].state = "awaiting_help_choice";
        } else if (userMessage === "!info") {
          client.sendText(
            userId,
            "🤖 *Comandos disponíveis no bot Softex:*\n\n" +
            "*!ajuda* - Mostrar a lista de comandos disponíveis.\n" +
            "*!info* - Obter informações gerais sobre o bot e seus comandos.\n" +
            "*!contato* - Obter detalhes de contato.\n" +
            "*!faltas* - Verificar suas faltas.\n\n" +
            "Você pode usar esses comandos a qualquer momento para interagir com o bot."
          );
        } else if (userMessage === "!contato") {
          client.sendText(
            userId,
            "🤖 *Detalhes de contato:*\n" +
            "Você pode entrar em contato conosco através do e-mail: contato@softex.com ou pelo telefone: (11) 1234-5678."
          );
        } else if (userMessage === "!faltas") {
          client.sendText(
            userId,
            "🤖 *Verificação de faltas:*\n" +
            "Para verificar suas faltas, por favor, forneça seu número de matrícula ou ID."
          );
        } else {
          client.sendText(
            userId,
            "🤖 *Comando não reconhecido.*\n" +
            "Por favor, use um comando válido ou digite *!ajuda* para mais informações."
          );
        }
        break;

      case "awaiting_help_choice":
        switch (userMessage.trim()) {
          case "1":
            client.sendText(
              userId,
              "🤖 *Assistência para Secretaria:*\n" +
              "Para assuntos relacionados à Secretaria, por favor entre em contato com o e-mail secretaria@softex.com ou ligue para (11) 1234-5678."
            );
            break;
          case "2":
            client.sendText(
              userId,
              "🤖 *Assistência para Coordenação:*\n" +
              "Para assuntos relacionados à Coordenação, por favor entre em contato com o e-mail coordenacao@softex.com ou ligue para (11) 2345-6789."
            );
            break;
          case "3":
            client.sendText(
              userId,
              "🤖 *Outras Assistências:*\n" +
              "Para outros tipos de assistência, por favor, forneça detalhes sobre sua necessidade para que possamos direcioná-lo corretamente."
            );
            break;
          case "4":
            client.sendText(
              userId,
              "🤖 *Verificação de faltas:*\n" +
              "Para verificar suas faltas, por favor, forneça seu número de matrícula ou ID."
            );
            break;
          default:
            client.sendText(
              userId,
              "🤖 *Opção não reconhecida.*\n" +
              "Por favor, escolha uma das opções válidas (1, 2, 3 ou 4) ou digite *!ajuda* para ver a lista novamente."
            );
            break;
        }
        conversationState[userId].state = "awaiting_command";
        break;

      default:
        client.sendText(
          userId,
          "🤖 *Ocorreu um erro.*\n" +
          "Parece que há um problema com o estado atual da conversa. Por favor, reinicie a conversa digitando uma saudação."
        );
        break;
    }

    startTimeout(userId);
  }

  function startTimeout(userId: string) {
    conversationState[userId].timeout = setTimeout(() => {
      client.sendText(
        userId,
        "🤖 *Você ficou inativo por muito tempo, então a conversa foi encerrada.*\n" +
        "Por favor, inicie novamente se precisar de mais assistência."
      );
      delete conversationState[userId];
    }, 45000);
  }
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

//Get inscriptions students fap api
app.get('/get-inscriptions', (req, res) => {
  const filePath = path.join(__dirname, 'db', 'thunder-file_1de921ab.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read file' });
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      // Verificar se jsonData é um array
      if (!Array.isArray(jsonData)) {
        throw new Error('Invalid JSON format');
      }

      // Função para limpar e formatar o número de telefone
      const cleanPhoneNumber = (phone: string) => {
        return phone.replace(/[^\d]/g, ''); // Remove tudo que não for dígito
      };

      // Mapear dados para criar um array de objetos de estudantes
      const students = jsonData.map(item => ({
        name: item.name || 'N/A',
        phone: cleanPhoneNumber(item.phone_number || 'N/A')
      }));

      res.json(students);
    } catch (parseError) {
      res.status(500).json({ error: 'Failed to parse JSON' });
    }
  });
});

//Get sheet data
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
});

app.listen(2222, () => {
  console.log("Servidor rodando na porta 2222");
});
