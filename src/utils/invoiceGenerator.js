let serial = 0; // module-scoped variable

export function generateInvoiceNumber() {
  const today = new Date();
  const datePart = today.toLocaleDateString("en-GB").split("/").join(""); // DDMMYYYY

  serial += 1; // প্রতি call-এ 1 বাড়বে

  const serialPart = String(serial).padStart(4, "0");
  const invoiceNumber = `${datePart}${serialPart}`;

  return invoiceNumber;
}
