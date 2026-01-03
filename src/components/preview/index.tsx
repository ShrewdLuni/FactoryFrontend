import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import { useSingularBatch } from "@/hooks/useSingularBatch";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";

export const PreviewPage = () => {
  const { id } = useParams();
  const { batch, fetchBatch, loading, error } = useSingularBatch();
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  console.log(scanResult, scanError, error)

  useEffect(() => {
    if (id) fetchBatch(Number(id));
  }, [id, fetchBatch]);

  const handleScan = async () => {
    if (!id) return;
    setScanning(true);
    setScanError(null);

    try {
      const res = await fetch(`${API_URL}/batches/${id}/scan`, { credentials: "include" });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to scan batch");
      }

      const data = await res.json();
      setScanResult(data);
    } catch (err: any) {
      console.error(err);
      setScanError(err.message || "Unknown error");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch info</CardTitle>
              <CardDescription>
                {loading && <p>Loading batch...</p>}
                {batch && (
                  <div className="border p-4 rounded-md shadow-sm space-y-2">
                    <p><strong>Name:</strong> {batch.name}</p>
                    <p><strong>Progress Status:</strong> {batch.progressStatus}</p>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button  className="mt-4" onClick={handleScan} disabled={scanning || !id}>
                {scanning ? "Scanning..." : "Scan"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

