// pages/qrcode/dialogs/see.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { BASE_URL } from "@/config";
import type { QRCode } from "@/api/generated/models";

type QRCodeSeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: QRCode | null;
};

export const QRCodeSeeDialog = ({ open, onOpenChange, qrCode }: QRCodeSeeDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>QR-код {qrCode?.name}</DialogTitle>
      </DialogHeader>
      {qrCode && (
        <QRCodeCanvas
          style={{ width: "100%", height: "100%" }}
          className="border-4 rounded-xl p-8 bg-white"
          value={qrCode.resource || `${BASE_URL}/qrcodes/${qrCode.id}`}
          size={300}
          level="M"
        />
      )}
    </DialogContent>
  </Dialog>
);

