export type Workstation = {
  id: number,
  name: string, 
  qrCodeId: number | null,
  isActive: boolean
}

export type InsertWorkstation = Omit<Workstation, "id">
