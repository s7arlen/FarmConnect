/**
 * UPI Payment Helpers
 * NPCI-compliant deep link and QR code generation for free peer-to-peer / merchant UPI payments.
 */

export interface UPIPaymentDetails {
  upiId: string;
  payeeName: string;
  amount: number;
  transactionNote?: string;
  transactionRef?: string;
}

export const DEFAULT_UPI_ID =
  process.env.NEXT_PUBLIC_DEFAULT_UPI_ID || "farmconnect@okaxis";

export const DEFAULT_PAYEE_NAME =
  process.env.NEXT_PUBLIC_PAYEE_NAME || "FarmConnect Market";

/**
 * Builds the standard NPCI UPI URI string:
 * e.g. upi://pay?pa=farmer@okaxis&pn=FarmConnect&am=450.00&cu=INR&tn=Order%20Payment
 */
export function buildUPIPaymentUrl({
  upiId,
  payeeName,
  amount,
  transactionNote = "FarmConnect Order Payment",
  transactionRef,
}: UPIPaymentDetails): string {
  const cleanUpiId = (upiId || DEFAULT_UPI_ID).trim();
  const cleanPayee = (payeeName || DEFAULT_PAYEE_NAME).trim();
  const formattedAmount = Number(amount).toFixed(2);

  const params = new URLSearchParams({
    pa: cleanUpiId,
    pn: cleanPayee,
    am: formattedAmount,
    cu: "INR",
    tn: transactionNote,
  });

  if (transactionRef) {
    params.set("tr", transactionRef);
  }

  return `upi://pay?${params.toString()}`;
}
