import express from "express";
import { create } from "venom-bot";
import { start } from "./app";

export const app = express();
export const port = 2222;
app.use(express.json());

create({
  session: "mySession",
}).then((client) => start(client));

app.listen(2222, () => {
  console.log("Servidor rodando na porta 2222");
});
