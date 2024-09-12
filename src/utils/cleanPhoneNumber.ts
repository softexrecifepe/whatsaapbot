export function cleanPhoneNumber(phone: string) {
  if (phone.startsWith("55")) {
    phone = phone.substring(2);
    return phone.replace(/[^\d]/g, ""); // Remove tudo que não for dígito
  }
}
