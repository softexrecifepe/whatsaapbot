import { sendText } from "../utils/sendText";
import { cleanPhoneNumber } from "../utils/cleanPhoneNumber";

export async function handleFaltas(userId: string) {
  const phone = userId;
  let phoneNumber = cleanPhoneNumber(phone);
  console.log("Número de telefone limpo:", phoneNumber);

  sendText(
    userId,
    "🤖 *Verificação de faltas:*\n" +
      "Aguarde um momento enquanto verifico suas faltas..."
    //phoneNumber
  );
}
