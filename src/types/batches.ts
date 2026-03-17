export type Batch = {
  id: number;
  name?: string | null | undefined;
  size: number;
  actualSize?: number | null | undefined;
  product: {
    id: number;
    name?: string | null | undefined;
    measureUnitId?: number | null | undefined;
  };
  workstation: {
    id: number;
    name?: string | null | undefined;
  };
  status: {
    id: number;
    label?: string | null | undefined;
    sortOrder?: number | null | undefined;
    isTerminal?: boolean | null | undefined;
    allowsDefectReporting?: boolean | null | undefined;
    isActive?: boolean | null | undefined;
  };
  workers?: {
    department: {
      id: number;
      label?: string | null | undefined;
    };
    worker: {
      id: number,
      fullName: string | null | undefined;
    };
  }[] | null | undefined;
  plannedFor: Date;
  isActive: boolean;
}

export type InsertBatch = Omit<Batch, "id" | "progressStatus" | "updatedAt" | "createdAt" | "isPlanned">;

export type InsertBatchBulk = InsertBatch & { amount: number };
