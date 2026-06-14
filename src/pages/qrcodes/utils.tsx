import type { QRCode } from "@/api/generated/models";
import QRCodeLib from "qrcode";
import { API_URL } from "@/config";

export const printMultipleQRCodes = async (qrCodes: QRCode[]) => {
  const items = await Promise.all(
    qrCodes.map(async (qr) => {
      const dataUrl = await QRCodeLib.toDataURL(
        qr.resource || `${API_URL}/qrcodes/${qr.id}/scan`,
        { width: 240, margin: 2 }
      );
      return { qr, dataUrl };
    })
  );

  const printWindow = window.open("", "_blank", "width=400,height=500");
  if (!printWindow) return;

  const cards = items
    .map(({ qr, dataUrl }) => `
      <div class="card">
        <h2>${qr.name ?? `QR #${qr.id}`}</h2>
        <img src="${dataUrl}" alt="QR Code" />
        <p>${qr.resource || `${API_URL}/qrcodes/${qr.id}`}</p>
      </div>`)
    .join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR Codes</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: sans-serif; }
          .card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100vw;
            height: 100vh;
          }
          h2 { font-size: 16px; font-weight: 600; }
          img { width: 240px; height: 240px; }
          p { font-size: 11px; color: #666; word-break: break-all; text-align: center; max-width: 280px; }
          @media print {
            @page {
              size: 100mm 100mm;
              margin: 0;
            }
            .card {
              width: 100mm;
              height: 100mm;
              page-break-after: always;
              break-after: page;
            }
            .card:last-child {
              page-break-after: avoid;
              break-after: avoid;
            }
            h2 { font-size: 10pt; }
            img { width: 72mm; height: 72mm; }
            p { font-size: 7pt; max-width: 92mm; }
          }
        </style>
      </head>
      <body>
        ${cards}
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

export const printQRCode = async (qr: QRCode) => {

  const dataUrl = await QRCodeLib.toDataURL(qr.resource || `${API_URL}/qrcodes/${qr.id}/scan`, {
    width: 240,
    margin: 2,
  });

  const printWindow = window.open("", "_blank", "width=400,height=500");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR Code - ${qr.name ?? qr.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            font-family: sans-serif;
            gap: 12px;
            padding: 24px;
          }
          h2 { font-size: 16px; font-weight: 600; color: #111; }
          img { width: 240px; height: 240px; object-fit: contain; }
          p {
            font-size: 12px;
            color: #666;
            word-break: break-all;
            text-align: center;
            max-width: 280px;
          }
          @media print {
            @page {
              size: 100mm 100mm;
              margin: 0;
            }
            body {
              width: 100mm;
              height: 100mm;
              justify-content: center;
              padding: 4mm;
              overflow: hidden;
            }
            h2 { font-size: 10pt; }
            img {
              width: 72mm;
              height: 72mm;
            }
            p { font-size: 7pt; max-width: 92mm; }
          }
        </style>
      </head>
      <body>
        <h2>${qr.name ?? `QR #${qr.id}`}</h2>
        <img src="${dataUrl}" alt="QR Code" />
        <p>${qr.resource || `${API_URL}/qrcodes/${qr.id}`}</p>
        <script>
          window.onload = () => {
            window.print();
            window.onafterprint = () => window.close();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

