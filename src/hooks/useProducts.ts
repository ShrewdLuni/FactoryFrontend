import { API_URL } from "@/config"
import { useEffect, useState } from "react"
import type { Product } from "@/types/products"

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<Boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true)

        const res = await fetch(`${API_URL}/products`, { credentials: "include" });

        if(!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data: Product[] = await res.json();
        setProducts(data);

      } catch (error: any) {
        console.log(error);
        setError(error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, [])

  return { products, loading, error}
}
