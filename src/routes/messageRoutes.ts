import { Router, Request, Response } from "express";
import * as Controller from "../controllers/messageController";
import venom from "venom-bot";

export default function (client: venom.Whatsapp): Router {
  const router = Router();

  router.post("/send", (req: Request, res: Response) =>
    Controller.sendMessage(req, res, client)
  );

  router.post("/webhook", (req: Request, res: Response) =>
    Controller.reciveMessage(req, res, client)
  );

  return router;
}
