export type Batch = {
  id: string;
  name: string;
  productId: number;
  assignedMasterId: number;
  size: number;
  progressStatus:
    | "Inactive"
    | "Knitting Workshop"
    | "Sewing Workshop"
    | "Molding Workshop"
    | "Labeling Workshop"
    | "Turning-Out"
    | "Finished";
  plannedFor: string;
  updatedAt: string;
  createdAt: string;
  productName?: string;
};

export type BatchInitialization = {
  name: string,
  productId: number,
  assignedMasterId: number,
  plannedFor?: Date,
  size: number,
  amount: number,
}

  
