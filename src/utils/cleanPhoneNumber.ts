export function cleanPhoneNumber(phone: string | any): string {
  if (phone.startsWith("55") || phone.startsWith("81")) {
    phone = phone.substring(2);
  }
  return phone.replace(/[^\d]/g, "");
}
