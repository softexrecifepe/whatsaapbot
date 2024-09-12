import { handleAjuda } from "../commands/ajuda";
import { handleFaltas } from "../commands/faltas";
import { handleInfo } from "../commands/info";
import { unknowCommand } from "../commands/unknown";

export function handleCommand(userId: string, userMessage: string) {
  switch (userMessage) {
    case "!ajuda":
      handleAjuda(userId);
      break;
    case "!info":
      handleInfo(userId);
      break;
    case "!faltas":
      handleFaltas(userId);
      break;
    default:
      unknowCommand(userId);
      break;
  }
}
