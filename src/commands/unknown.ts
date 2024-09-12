import { sendText } from "../utils/sendText";

export function unknowCommand(userId: string) {
  sendText(
    userId,
    "🤖 *Comando não reconhecido.* Digite *!ajuda* para ver os comandos disponíveis."
  );
}
