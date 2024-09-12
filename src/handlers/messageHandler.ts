import { sendText } from "../utils/sendText";
import { getClient } from "../services/whatsappClient";
import { handleCommand } from "./commandHandler";
import { greetingMessages } from "../templates/greetingMessage";

const conversationState: {
  [key: string]: { state: string; timeout?: NodeJS.Timeout };
} = {};

export function handleMessage(message: any) {
  const userId = message.from;
  const userMessage = message.body.toLowerCase();

  if (conversationState[userId]) {
    clearTimeout(conversationState[userId].timeout);
    handleCommand(userId, userMessage);
  } else if (greetingMessages.includes(userMessage)) {
    startConversation(userId);
  } else {
    sendText(
      userId,
      "🤖 *Olá! Eu sou o bot Softex. Digite *!ajuda* para ver os comandos disponíveis.*"
    );
  }
}

async function startConversation(userId: string) {
  try {
    const client = getClient();
    const contact = await client.getContact(userId);
    const userName = contact.name || "usuário";

    conversationState[userId] = { state: "awaiting_command" };

    sendText(
      userId,
      `🤖 *Olá, ${userName}! Aqui estão os comandos que você pode usar:*\n\n` +
        `*!ajuda* - Mostrar lista de comandos.\n` +
        `*!info* - Obter informações.\n` +
        `*!faltas* - Verificar suas faltas.\n`
    );

    startTimeout(userId);
  } catch (error) {
    console.error("Erro ao obter o contato:", error);
    sendText(
      userId,
      "🤖 *Não consegui recuperar seu nome. Por favor, use um comando válido.*"
    );
  }
}

function startTimeout(userId: string) {
  conversationState[userId].timeout = setTimeout(() => {
    sendText(
      userId,
      "🤖 *Você ficou inativo por muito tempo. A conversa foi encerrada.*"
    );
    delete conversationState[userId];
  }, 35000); // Timeout de 35 segundos
}
