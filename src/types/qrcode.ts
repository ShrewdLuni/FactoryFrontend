export type QRCode = {
	id: number;
	isTaken: boolean;
	name?: string | null;
	resource?: string | null;
};

export type InsertQRCode = Omit<QRCode, "id" | "isTaken">;

export type InsertQRCodeBulk = InsertQRCode & { amount: number };
