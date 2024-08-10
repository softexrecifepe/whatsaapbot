import { app } from "../index";
import * as Controller from "../controllers/message-controller";
import venom from "venom-bot";

export function initializeRoutes(client: venom.Whatsapp) {
  app.post("/send", (req, res) => Controller.Message(req, res, client));
}
