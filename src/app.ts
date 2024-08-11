import { Request, Response } from "express";
import venom from "venom-bot";
import { app } from "./index";
import { port } from "./index";

export async function start(client: venom.Whatsapp) {
  app.post("/send", (req: Request, res: Response) => {
    const { number, message } = req.body;

    if (!number || !message) {
      return res
        .status(400)
        .json({ message: "Número e mensagem são obrigatórios" });
    }

    client
      .sendText(`${number}@c.us`, message)
      .then((result) => {
        res.status(200).json({ message: "Mensagem enviada com sucesso" });
      })
      .catch((erro) => {
        res
          .status(500)
          .json({ message: "Erro ao enviar mensagem", error: erro });
      });
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
