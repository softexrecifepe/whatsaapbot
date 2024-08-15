import { app } from "./index";
import venom from "venom-bot";
import messageRoutes from "./routes/messageRoutes";

export function start(client: venom.Whatsapp) {
  app.use("/api/messages", messageRoutes(client));
  
}
