import { sendText } from "../utils/sendText";

export function handleFaltas(userId: string) {
  sendText(
    userId,
    "🤖 *Verificação de faltas:*\n" +
      "Para verificar suas faltas, forneça seu número de matrícula ou ID."
  );
}
