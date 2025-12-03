export type Batch = {
  id: string;
  code: string;
  productId: number;
  progressStatus:
    | "Inactive"
    | "Knitting Workshop"
    | "Sewing Workshop"
    | "Molding Workshop"
    | "Labeling Workshop"
    | "Turning-Out"
    | "Finished";
};
