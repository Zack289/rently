export const formatNPR = (amount: number) =>
  `NPR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(amount))}`;

export const nightsBetween = (checkIn: Date | string, checkOut: Date | string) => {
  const a = new Date(checkIn).getTime();
  const b = new Date(checkOut).getTime();
  return Math.max(1, Math.round((b - a) / (1000 * 60 * 60 * 24)));
};

export const computePricing = (roomRate: number, nights: number) => {
  const subtotal = roomRate * nights;
  const taxes = subtotal * 0.13;        // 13% VAT
  const platformFee = subtotal * 0.02;  // 2% platform fee
  const total = subtotal + taxes + platformFee;
  return { subtotal, taxes, platformFee, total };
};
