import { Request, Response } from "express";
import venom from "venom-bot";

export function Message(
  req: Request,
  res: Response,
  client: venom.Whatsapp
): void {
  const { to, message } = req.body;

  client
    .sendText(to, message)
    .then((result) => res.status(200).json({ success: true, result }))
    .catch((error) => res.status(500).json({ success: false, error }));
}
