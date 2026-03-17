export type Product = {
  id: number;
  code: string;
  name: string;
  measureUnitId: number;
  isActive: boolean;
};

export type InsertProduct = Omit<Product, "id">
