import { create } from "venom-bot";
import { app, port } from "./index";
import { initializeRoutes } from "./routes/Messages";

create({
  session: "zap",
})
  .then((client) => {
    initializeRoutes(client);
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((erro) => {
    console.log(erro);
  });
