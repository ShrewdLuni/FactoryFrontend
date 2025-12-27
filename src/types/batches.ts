export type Batch = {
  id: string;
  name: string;
  productId: number;
  assignedMasterId: number;
  size: number;
  progressStatus:
    | 'Inactive'
    | 'Knitting Workshop(Processing)'
    | 'Knitting Workshop(Finished)'
    | 'Sewing Workshop(Processing)'
    | 'Sewing Workshop(Finished)'
    | 'Molding Workshop(Processing)'
    | 'Molding Workshop(Finished)'
    | 'Labeling Workshop(Processing)'
    | 'Labeling Workshop(Finished)'
    | 'Packaging Workshop(Processing)'
    | 'Packaging Workshop(Finished)'
    | 'Completed'
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

  
