import { getClient } from "../services/whatsappClient";

export function sendText(userId: string, text: string, phoneNumber?: string) {
  const client = getClient();
  let message = text;

  if (phoneNumber) {
    console.log((message += `\n\nSeu número de telefone é: ${phoneNumber}`));
  }
  client.sendText(userId, message);
}
