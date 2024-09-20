import { sendText } from "./sendText";

export function startTimeout(userId: string, conversationState: any) {
  conversationState[userId].timeout = setTimeout(() => {
    sendText(
      userId,
      "🤖 *Você ficou inativo por muito tempo. A conversa foi encerrada.*"
    );
    delete conversationState[userId];
  }, 35000); // Timeout de 35 segundos
}
