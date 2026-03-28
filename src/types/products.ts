export type Product = {
  id: number;
  code: string;
  name: string;
  measureUnitId: number;
  isActive: boolean;
};

export type ProductQuantity = {
  product_id: number;
  product_name: string;
  measure_unit_id: number;
  quantity: {
    status: {
      id: number;
      label: string;
      sortOrder: number;
      isTerminal: boolean;
    };
    quantity: number;
    batchCount: number;
  }[];
};

export type InsertProduct = Omit<Product, "id">
