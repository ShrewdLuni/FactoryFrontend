import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdvanceBatch, useGetBatch } from "@/api/generated/batch/batch";
import { useAuth } from "@/AuthProvider";
import { toast } from "sonner";

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
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: batch } = useGetBatch(id || "0")
  const { mutateAsync: advanceBatch } = useAdvanceBatch()

  const [defects, setDefects] = useState<Record<number, number>>({});
  const [sizeOverride, setSizeOverride] = useState<number>(0);
  const [remain, setRemain] = useState<number>(0);

  useEffect(() => {
    if (batch?.size) {
      setSizeOverride(batch.size);
    }
  }, [batch?.size]);

  if (!batch) return (<div>Помилка</div>)

  const handleChange = (id: number, value: string) => {
    setDefects((prev) => ({ ...prev, [id]: Math.max(0, parseInt(value) || 0) }));
  };

  const handleAdvance = async () => {
    if (!batch || !id || !user) return;

    const defectsPayload = Object.entries(defects)
      .filter(([, quantity]) => quantity > 0)
      .map(([defect_type_id, quantity]) => ({
        defectTypeId: Number(defect_type_id),
        quantity,
      }));

    await advanceBatch({id: Number(id), data: {
      actorId: user.id,
      defects: defectsPayload,
      sizeOverride: batch.status.requiresSizeInput ? sizeOverride : undefined,
      remainder: batch.status.isPackaging ? remain : undefined,
    }} );
    navigate("/");
    toast.success("OK", { position: "top-right" });
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
                  <div className="border p-4 text-black dark:text-white font-semibold rounded-md shadow-sm space-y-2">
                    <p>{batch.product.name}</p>
                    <p>Розмір: {batch.size}</p>
                    <p>Статус: {batch.status.label}</p>
                    <p>Назва партії: {batch.name}</p>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {batch.status.allowsDefectReporting && (
                <ScrollArea className="h-[40vh] px-4">
                  <div className="pb-8">
                    {batch.status.isPackaging && (
                      <FieldSet>
                        <FieldLegend>Залишок</FieldLegend>
                        <Field className="flex flex-row font-normal text-xl">
                          <FieldLabel>Кількість</FieldLabel>
                          <Input
                            value={remain}
                            onChange={(e) => setRemain(Math.max(0, parseInt(e.target.value) || 0))}
                          />
                        </Field>
                      </FieldSet>
                    )}
                    {batch.status.requiresSizeInput && (
                      <Field className="flex flex-row font-normal texl-xl">
                        <FieldLabel>Актуальна Кількість</FieldLabel>
                        <Input
                          value={sizeOverride}
                          onChange={(e) => setSizeOverride(Number(e.target.value))}
                        />
                      </Field>
                    )}
                  </div>
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
                  </FieldSet>
                </ScrollArea>
              )}
              <Button className="mt-4 w-full" onClick={handleAdvance} disabled={!id}>
                {batch.status.isFinished ? "Взяти в роботу" : batch.status.isInProgress ? "Завершити роботу" : "Сканувати"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
