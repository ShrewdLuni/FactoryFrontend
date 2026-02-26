import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { useBatches } from "@/hooks/useBatch";
import { useGetProduct } from "@/hooks/useProducts";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { API_URL } from "@/config";

const SECOND_GRADE = [
  { id: 1, label: "Не відповідність лінійним розмірам" },
  { id: 2, label: "Не чистий носок (масло, пух, пил, i т.д)" },
  { id: 3, label: "Не коректний рисунок" },
  { id: 4, label: "Невеликі дірки" },
  { id: 5, label: "Обрив нитки (не значно)" },
];

const SPOILAGE = [
  { id: 6, label: "Сильне відхилення від лінійних розмірів" },
  { id: 7, label: "Дірки, стрілки" },
  { id: 8, label: "Обрив нитки (значно)" },
  { id: 9, label: "Не довязаний виріб" },
];

export const BatchPreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: batch } = useBatches.get(Number(id));
  const { mutate: scan } = useBatches.scan();
  const { mutate: updateBatch } = useBatches.update();
  const { data: product } = useGetProduct(batch?.productId || 0);

  const [defects, setDefects] = useState<Record<number, number>>({});

  const [actualSize, setActualSize] = useState<number>(0)

  useEffect(() => {
    if (batch?.actualSize) {
      setActualSize(batch.actualSize);
    }
  }, [batch?.actualSize]);

  const questioneer = String(batch?.progressStatus).includes("In-Progress");

  const actualSizeQuestion = String(batch?.progressStatus) === "Knitting Workshop (In-Progress)";

  if (!id) return null;

  const handleChange = (id: number, value: string) => {
    setDefects((prev) => ({ ...prev, [id]: Math.max(0, parseInt(value) || 0) }));
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!batch) {
      return
    }

    const total = Object.values(defects).reduce((sum, count) => sum + count, 0);
    if (total > (batch?.size ?? 0)) return;

    const defectsPayload = Object.entries(defects)
      .filter(([, count]) => count > 0)
      .map(([typeId, count]) => ({ typeId: Number(typeId), count }));

    await fetch(`${API_URL}/batches/${id}/spoilage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defects: defectsPayload }),
    });

    const updatedBatch = {
      ...batch,
      actualSize: ((actualSize ?? batch?.actualSize ?? batch?.size ?? 100) - total),
    };

    updateBatch({ id: Number(id), data: updatedBatch });
    scan(Number(id));
    navigate("/");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Інформація про партію</CardTitle>
              <CardDescription>
                {batch && (
                  <div className="border p-4 text-white font-semibold rounded-md shadow-sm space-y-2">
                    <p>{product?.name}</p>
                    <p>Розмір: {batch.size}</p>
                    <p>Актуальний Розмір: {batch.actualSize}</p>
                    <p>Статус: {batch.progressStatus}</p>
                    <p>Назва партії: {batch.name}</p>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {questioneer && 
              <ScrollArea className="h-[40vh] px-4">
                <form className="flex flex-col gap-4" onSubmit={handleScan}>
                  <FieldSet className="flex gap-4">
                    <FieldLegend>Другий сорт</FieldLegend>
                    <FieldGroup className="gap-2">
                      {SECOND_GRADE.map((type) => (
                        <Field key={type.id} className="flex flex-row font-normal">
                          <FieldLabel>{type.label}</FieldLabel>
                          <Input
                            value={defects[type.id] ?? 0}
                            onChange={(e) => handleChange(type.id, e.target.value)}
                          />
                        </Field>
                      ))}
                    </FieldGroup>
                    <FieldGroup className="mt-10 gap-2">
                      <FieldLegend>Брак</FieldLegend>
                      {SPOILAGE.map((type) => (
                        <Field key={type.id} className="flex flex-row font-normal">
                          <FieldLabel>{type.label}</FieldLabel>
                          <Input
                            value={defects[type.id] ?? 0}
                            onChange={(e) => handleChange(type.id, e.target.value)}
                          />
                        </Field>
                      ))}
                    </FieldGroup>
                      {actualSizeQuestion &&  <Field className="flex flex-row font-normal">
                        <FieldLabel>Актуальное Количество</FieldLabel>
                        <Input
                          value={actualSize}
                          onChange={(e) => setActualSize(Number(e.target.value))}
                        />
                      </Field>}
                  </FieldSet>
                </form>
              </ScrollArea>}
              <Button className="mt-4 w-full" onClick={handleScan} disabled={!id}>
                Сканувати
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
