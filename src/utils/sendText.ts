import { getClient } from "../services/whatsappClient";

export function sendText(userId: string, text: string) {
  const client = getClient();
  client.sendText(userId, text);
}
