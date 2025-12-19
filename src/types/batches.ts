export type Batch = {
  id: string;
  name: string;
  productId: number;
  productName?: string;
  size: number;
  progressStatus:
    | "Inactive"
    | "Knitting Workshop"
    | "Sewing Workshop"
    | "Molding Workshop"
    | "Labeling Workshop"
    | "Turning-Out"
    | "Finished";
  updatedAt: string;
  createdAt: string;
};

export type BatchInitialization = {
  name: string,
  productId: number,
  size: number,
  amount: number,
}
