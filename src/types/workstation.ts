export type Workstation = {
  id: number,
  name: string, 
  qrCode: number,
}

export type InsertWorkstation = Omit<Workstation, "id">
