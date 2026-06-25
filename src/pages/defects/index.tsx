import { useMemo, useState } from "react";
import { DataTable } from "@/components/data-table";
import { getColumns, type FlatDefectRow } from "./columns";
import { useGetProductDefects } from "@/api/generated/product/product";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export const DefectPage = () => {
  const { data: defects = [], isLoading } = useGetProductDefects();

  const flatDefects = useMemo<FlatDefectRow[]>(
    () =>
      defects.flatMap((pd) =>
        pd.defects.map((defect, i) => ({
          id: `${pd.product.id}-${i}`,
          product: pd.product,
          defect,
        })),
      ),
    [defects],
  );

  const defectTypeFilter = useMemo(() => {
    const uniqueLabels = Array.from(new Set(flatDefects.map((d) => d.defect.type.label)));
    return {
      column: "defectType",
      title: "Тип дефекту",
      options: uniqueLabels.map((label) => ({ label, value: label })),
    };
  }, [flatDefects]);

  const filters = useMemo(() => [defectTypeFilter], [defectTypeFilter]);

  const columns = getColumns({ something: "" });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <DataTable
        searchValues={"name"}
        columns={columns}
        data={flatDefects}
        filters={filters}
      />
    </div>
  );
};
