import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/AuthProvider";
import { BASE_URL } from "@/config";
import { useGetAllBatches } from "@/api/generated/batch/batch";
import { useGetQRCode, usePatchQRCode } from "@/api/generated/qrcode/qrcode";
import type { Batch } from "@/api/generated/models";

const INACTIVE_STATUS_ID = 1;

const ProductSelectItem = ({ batch }: { batch: Batch }) => (
<SelectItem value={String(batch.id)}>
  <div className="flex items-center gap-2 justify-between">
    <img
      src="https://static.vecteezy.com/system/resources/previews/004/240/295/non_2x/warm-socks-linear-icon-sox-wardrobe-element-contour-symbol-socks-pair-thin-line-illustration-isolated-outline-drawing-vector.jpg"
      alt=""
      className="h-20 rounded-sm object-cover shrink-0"
    />
    <span className="whitespace-normal ">
      {`${batch.product.name}`}
    </span>
  </div>
</SelectItem>
);

export const QRCodePreviewPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeBatchId, setActiveBatchId] = useState<string | undefined>(undefined);

  const { data: batches = [], isLoading: isBatchLoading } = useGetAllBatches();
  const { data: qrcode, isLoading: isQrCodeLoading } = useGetQRCode(id || "0");
  const { mutateAsync: patchQRCode } = usePatchQRCode();

  const workstationId = Number(localStorage.getItem("workstationId"));
  const hasWorkstation = Boolean(workstationId);

  const seenProducts = new Set<number>();

  const availableBatches = batches.filter((batch) => {
    const productId = batch.product.id;

    if (
      batch.status.id !== INACTIVE_STATUS_ID ||
        batch.workstation.id !== workstationId ||
        !batch.product.name ||
        productId == null
    ) {
      return false;
    }

    if (seenProducts.has(productId)) {
      return false;
    }

    seenProducts.add(productId);
    return true;
  });

  if (!id || isNaN(parseInt(id)) || !user || qrcode?.isTaken) {
    return <div>Щось пішло не так</div>;
  }

  if (isQrCodeLoading || isBatchLoading) {
    return <div>Завантаження...</div>;
  }

  const handleConfirm = async () => {
    if (!activeBatchId) return;

    await patchQRCode({ id, data: { resource: `${BASE_URL}/batch/${activeBatchId}` } });
    localStorage.removeItem("workstationId");
    navigate(`/batch/${activeBatchId}`);
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Прив'язка QR-коду до партії</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasWorkstation ? (
              <div className="flex flex-col gap-2">
                <p className="text-lg">
                  <strong>Робочу станцію не знайдено</strong>
                </p>
                <p className="mt-4 text-lg">
                  <strong>Будь ласка, відскануйте своє робоче місце, щоб продовжити</strong>
                </p>
              </div>
            ) : (
              qrcode && (
                <div className="flex flex-col gap-2">
                  <p className="text-lg">
                    <strong>QR-код:</strong>
                  </p>
                  <div className="border p-4 rounded-md shadow-sm space-y-2">
                    <p>
                      <strong>ID:</strong> {qrcode.id}
                    </p>
                    <p>
                      <strong>Назва:</strong> {qrcode.name}
                    </p>
                  </div>
                  <p className="mt-4 text-md">
                    <strong>Будь ласка, оберіть партію, щоб продовжити</strong>
                  </p>
                  <Select value={activeBatchId} onValueChange={setActiveBatchId}>
                    <SelectTrigger className="w-full h-full min-h-26" size="default">
                      <SelectValue placeholder="Оберіть партію" />
                    </SelectTrigger>
                    <SelectContent className="w-[var(--radix-select-trigger-width)]">
                      {availableBatches.map((batch) => (
                        <ProductSelectItem key={batch.id} batch={batch} />
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleConfirm}>Підтвердити</Button>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
