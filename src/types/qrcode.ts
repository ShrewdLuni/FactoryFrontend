export type QRCode = {
  id: number,
  isTaken: boolean,
  name?: string | null,
  resource?: string | null,
}

export type QRCodeInitialization = {
  isTaken?: boolean,
  name?: string | null,
  resource?: string | null,
  amount: number,
}
