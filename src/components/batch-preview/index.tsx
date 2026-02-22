import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { useBatches } from "@/hooks/useBatch";
import { useNavigate } from "react-router-dom";
import { useGetProduct } from "@/hooks/useProducts";

export const BatchPreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: batch } = useBatches.get(Number(id));
  const { mutate: scan } = useBatches.scan();
  const { data: product } = useGetProduct(batch?.productId || 0);

  if (!id) return null;

  const handleScan = async (e: any) => {
    e.preventDefault();
    if (!id) return;
    scan(Number(id));
    navigate("/");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch info</CardTitle>
              <CardDescription>
                {batch && (
                  <div className="border p-4 rounded-md shadow-sm space-y-2">
                    <p>Имя партии: {batch.name}</p>
                    <p>Статус: {batch.progressStatus}</p>
                    <p>Продукт: {product?.name}</p>
                    <p>Размер: {batch.size}</p>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="mt-4 w-full" onClick={handleScan} disabled={!id}>
                {"Сканировать"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
