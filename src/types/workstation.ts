export type Workstation = {
  id: number,
  name: string, 
  qrCode: number | null,
}

export type InsertWorkstation = Omit<Workstation, "id">
