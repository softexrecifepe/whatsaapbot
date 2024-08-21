import express, { Request, Response } from "express";
import { create, Whatsapp } from "venom-bot";
import { greetingMessages } from "./src/templates/greetingMessage";

const app = express();
app.use(express.json());

let client: Whatsapp;

create({
  session: "zap",
}).then((clientInstance) => {
  client = clientInstance;

  client.onMessage((message) => {
    //console.log(message.body);
    //console.log(message.from);
    // console.log(message.to);
    if (greetingMessages.includes(message.body.toLowerCase())) {
      client.sendText(
        message.from,
        `🤖 *Olá! Eu sou o bot Softex, estou aqui para ajudar com várias tarefas!*\n\n` +
        `Aqui estão alguns comandos que você pode usar:\n\n` +
        `*!ajuda* - Mostrar esta lista de comandos.\n` +
        `*!informação* - Obter informações gerais.\n` +
        `*!contato* - Obter detalhes de contato.\n\n` +
        `Além disso, você pode verificar:\n\n` +
        `*!faltas* - Verificar suas faltas.\n` +
        `*!notas* - Verificar suas notas.\n` +
        `*!provas* - Verificar datas das próximas provas.\n`
      );
    }
  });
});

app.post("/send-message", async (req: Request, res: Response) => {
  const { to, message } = req.body;

  try {
    await client.sendText(to, message);
    res.status(200).send("Mensagem enviada com sucesso!");
  } catch (error) {
    res.status(500).send("Erro ao enviar a mensagem.");
  }
});

app.listen(2222, () => {
  console.log("Servidor rodando na porta 2222");
});
