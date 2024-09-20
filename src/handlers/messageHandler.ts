import { sendText } from "../utils/sendText";
import { getClient } from "../services/whatsappClient";
import { handleCommand } from "./commandHandler";
import { greetingMessages } from "../templates/greetingMessage";
import { startTimeout } from "../utils/timeout";
import { getUserInformationByNumber } from "../services/fapApiService";
import { cleanPhoneNumber } from "../utils/cleanPhoneNumber";

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
  }
}

async function startConversation(userId: string) {
  let testNumber = "5581999679376@c.us";
  try {
    conversationState[userId] = { state: "awaiting_command" };
    const client = getClient();
    const contact = await client.getContact(userId);
    const contactNumber = contact.id.user; // Sem o "@c.us"
    const phoneNumber = cleanPhoneNumber(testNumber);
    const userInformation = await getUserInformationByNumber(phoneNumber);

    if (userInformation.length > 0) {
      const user = userInformation[0];

      // Verifique os dados do usuário obtidos
      //console.log("Informações do usuário:", user);

      sendText(
        userId,
        `🤖 *Olá Estudante, ${user.name}! Aqui estão os comandos que você pode usar:*\n\n` +
          `*!ajuda* - Mostrar lista de comandos.\n` +
          `*!info* - Obter informações.\n` +
          `*!faltas* - Verificar suas faltas.\n`
      );
    } else {
      sendText(
        userId,
        "🤖 *Você não está cadastrado em nossa base de dados, por favor entrar em contato com o suporte.*"
      );
      console.log("Usuário não cadastrado na base de dados.");
    }

    startTimeout(userId, conversationState);
  } catch (error) {
    console.error("Erro ao obter o contato:", error);
    sendText(
      userId,
      "🤖 *Não consegui recuperar seu nome. Por favor, use um comando válido.*"
    );
  }
}
