import { Request, Response } from "express";
import venom from "venom-bot";

export async function sendMessage(
  req: Request,
  res: Response,
  client: venom.Whatsapp
) {
    
  const { number, message } = req.body;

  if (!number || !message) {
    return res
      .status(400)
      .json({ message: "Número e mensagem são obrigatórios" });
  }

  client
    .sendText(`${number}@c.us`, message)
    .then(() => {
      res.status(200).json({ message: "Mensagem enviada com sucesso" });
    })
    .catch((erro) => {
      res.status(500).json({ message: "Erro ao enviar mensagem", error: erro });
    });
}
