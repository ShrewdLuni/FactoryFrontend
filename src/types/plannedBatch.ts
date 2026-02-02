export type PlannedBatch = {
  id: number;
  productId: number | null | undefined;
  size: number;
  masters: {
    knitting: number | null | undefined;
    sewing: number | null | undefined;
    molding: number | null | undefined;
    labeling: number | null | undefined;
    packaging: number | null | undefined;
  };
  workstationId: number | null | undefined;
};
