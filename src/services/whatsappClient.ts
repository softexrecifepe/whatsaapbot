import { Whatsapp, create } from "venom-bot";

let client: Whatsapp;

export async function initializeClient() {
  client = await create({ session: "zap" });
  return client;
}

export function getClient() {
  return client;
}
