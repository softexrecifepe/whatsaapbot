import express from "express";
import routes from "./src/routes/routes";
import { initializeClient } from "./src/services/whatsappClient";
import { handleMessage } from "./src/handlers/messageHandler";
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(routes);

initializeClient()
  .then((client) => {
    client.onMessage(async (message) => {
      handleMessage(message);
    });
  })
  .catch((error) => {
    console.error("Erro ao inicializar o cliente do WhatsApp:", error);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
