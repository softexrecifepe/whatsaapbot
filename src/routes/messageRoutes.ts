import { Router, Request, Response } from "express";
import { sendMessage } from "../controllers/messageController";
import venom from "venom-bot";

export default function (client: venom.Whatsapp): Router {
  const router = Router();

  router.post("/send", (req: Request, res: Response) =>
    sendMessage(req, res, client)
  );

  return router;
}
