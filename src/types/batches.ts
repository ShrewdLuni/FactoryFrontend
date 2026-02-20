export type Masters = {
  knitting: number | undefined;
  sewing: number | undefined;
  molding: number | undefined;
  labeling: number | undefined;
  packaging: number | undefined;
};

export type WorkshopStatus =
  | "Inactive"
  | "Knitting Workshop (In-Progress)"
  | "Knitting Workshop (Finished)"
  | "Sewing Workshop (In-Progress)"
  | "Sewing Workshop (Finished)"
  | "Molding Workshop (In-Progress)"
  | "Molding Workshop (Finished)"
  | "Labeling Workshop (In-Progress)"
  | "Labeling Workshop (Finished)"
  | "Packaging Workshop (In-Progress)"
  | "Packaging Workshop (Finished)"
  | "Completed";

export type Batch = {
  id: number;
  name: string;
  size: number;
  productId: number;
  workstationId: number;
  progressStatus: WorkshopStatus;
  masters: Masters;
  isPlanned: boolean;
  plannedFor: string;
  updatedAt: string;
  createdAt: string;
};

export type InsertBatch = Omit<Batch, "id" | "progressStatus" | "updatedAt" | "createdAt" | "isPlanne2">;

export type InsertBatchBulk = InsertBatch & { amount: number };
