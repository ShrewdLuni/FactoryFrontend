export type QRCode = {
	id: number;
  name?: string | null;
  resource?: string | null;
	isTaken: boolean;
	isActive: boolean;
};

export type InsertQRCode = Omit<QRCode, "id" | "isTaken">;

export type InsertQRCodeBulk = InsertQRCode & { amount: number };
