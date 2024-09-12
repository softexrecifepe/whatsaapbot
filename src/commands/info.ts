import { sendText } from "../utils/sendText";

export function handleInfo(userId: string) {
  sendText(
    userId,
    "🤖 *Informações gerais:*\n" +
      "Este bot foi criado para ajudá-lo com várias tarefas. Use os comandos disponíveis para interagir."
  );
}
