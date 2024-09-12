import { sendText } from "../utils/sendText";

export function handleAjuda(userId: string) {
  sendText(
    userId,
    "🤖 *Comandos disponíveis:*\n\n" +
      "1. *!ajuda* - Mostrar esta lista.\n" +
      "2. *!info* - Obter informações.\n" +
      "3. *!faltas* - Verificar suas faltas.\n"
  );
}
