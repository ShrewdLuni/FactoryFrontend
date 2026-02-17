export type Batch = {
  id: number;
  name: string;
  size: number;
  productId: number;
  workstationId: number;
  progressStatus: 'Inactive'
  | 'Knitting Workshop'
  | 'Sewing Workshop'
  | 'Molding Workshop'
  | 'Labeling Workshop'
  | 'Packaging Workshop'
  | 'Completed';
  masters: {
    knitting: number,
    sewing: number,
    molding: number,
    labeling: number,
    packaging: number,
  };
  isPlanned: boolean
  plannedFor: string;
  updatedAt: string;
  createdAt: string;
};

export type InsertBatch = Omit<Batch, "id"  | "progressStatus" | "updatedAt" | "createdAt">

export type InsertBatchBulk = InsertBatch & { amount: number };


