import express, { Request, Response } from "express";
import { create, Whatsapp } from "venom-bot";
import { greetingMessages } from "./src/templates/greetingMessage";

const app = express();
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

app.post("/send-message", async (req: Request, res: Response) => {
  const { to, message } = req.body;

  try {
    await client.sendText(to, message);
    res.status(200).send("Mensagem enviada com sucesso!");
  } catch (error) {
    res.status(500).send("Erro ao enviar a mensagem.");
  }
});

app.listen(2222, () => {
  console.log("Servidor rodando na porta 2222");
});
