import { useMemo } from "react";
import { useAuth } from "@/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetAllProducts, usePackProduct } from "@/api/generated/product/product";

export const StorageAddition = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: storageEntries, isLoading } = useGetAllProducts();
  const { mutate: packProducts } = usePackProduct()

  const groupedEntries = useMemo(() => {
    if (!storageEntries) return [];

    return Object.values(
      storageEntries.reduce
        <Record<
          number,
          {
            productId: number;
            productName: string;
            boxSize: number;
            totalQuantity: number;
            totalBoxes: number;
          }
        >
      >((acc, entry) => {
        const productId = entry.id;
        const boxes = Math.floor(entry.quantity / (entry?.boxSize ?? 60));

        if (!acc[productId]) {
          acc[productId] = {
            productId,
            productName: entry.name ?? `Product #${productId}`,
            boxSize: (entry?.boxSize ?? 60),
            totalQuantity: 0,
            totalBoxes: 0,
          };
        }

        acc[productId].totalQuantity += entry.quantity;
        acc[productId].totalBoxes += boxes;

        return acc;
      }, {}),
    );
  }, [storageEntries]);

  const handleConfirm = async () => {
    if (!user) return;

    try {
      console.log(groupedEntries)
      for (const item of groupedEntries.filter(item => item.totalBoxes > 0)) {
        await packProducts({
          id: item.productId,
          data: {
            boxSize: item.boxSize,
            quantity: item.totalBoxes,
          },
        })
      }
      navigate("/");
      toast.success("Успіх!", { position: "top-right" });
    } catch {
      toast.error("Помилка!", { position: "top-right" });
    }
  };

  const movableEntries = groupedEntries.filter(
    (entry) => entry.totalBoxes > 0
  );

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Приймання з виробництва</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && <p>Триває завантаження.</p>}
              {!isLoading && movableEntries.length > 0 && (
                <div className="flex flex-col gap-4">
                  <ScrollArea className="h-[60vh] gap-2 px-4">
                    <div className="flex flex-col gap-4">
                      {groupedEntries.filter(entry => entry.totalBoxes > 0).map((entry) => (
                        <div key={entry.productId} className="rounded-md border p-4 shadow-sm space-y-2">
                          <p>
                            <span className="font-medium">Продукт:</span> {entry.productName}
                          </p>
                          <p>
                            <span className="font-medium">Кількість:</span> {entry.totalQuantity}
                          </p>
                          <p>
                            <span className="font-medium">Кількість боксів:</span> {entry.totalBoxes.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex flex-row gap-2 justify-center">
                    <Button className="w-[90%] font-bold" onClick={handleConfirm}>
                      Підтвердити
                    </Button>
                  </div>
                </div>
              )}
              {!isLoading && movableEntries.length === 0 && (
                <p className="text-center text-muted-foreground text-3xl">
                  Наразі немає продукції, доступної для переміщення на склад.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
