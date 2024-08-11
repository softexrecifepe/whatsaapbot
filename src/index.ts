import express from "express";
import { create } from "venom-bot";
import { start } from "./app";

export const app = express();
export const port = 2222;
app.use(express.json());

create({
  session: "zap",
})
  .then((client) => start(client))
  .catch((erro) => {
    console.error(erro);
  });
