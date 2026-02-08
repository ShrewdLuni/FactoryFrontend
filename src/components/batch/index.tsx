import { columns} from "./columns";
import { DataTable } from "../data-table";
import { BatchForm } from "../forms/batch";
import { CircleX, CircleCheck, Spool, Scissors, Layers, Tag, ArchiveIcon } from "lucide-react";
import { useBatches } from "@/hooks/useBatch";

export const BatchPage = () => {

  const { data: rawBatches, refetch } = useBatches.getAll();

  const batches = rawBatches?.filter(batch => batch.isPlanned === false) || []

  const status = [
    {
      label: "Inactive",
      value: "Inactive",
      icon: CircleX,
    },
    {
      label: "Knitting Workshop",
      value: "Knitting Workshop",
      icon: Scissors,
    },
    {
      label: "Sewing Workshop",
      value: "Sewing Workshop",
      icon: Spool,
    },
    {
      label: "Molding Workshop",
      value: "Molding Workshop",
      icon: Layers,
    },

    {
      label: "Labeling Workshop",
      value: "Labeling Workshop",
      icon: Tag,
    },

    {
      label: "Packaging Workshop",
      value: "Packaging Workshop",
      icon: ArchiveIcon,
    },
    {
      label: "Completed",
      value: "Completed",
      icon: CircleCheck,
    },
  ]

  const filters = [{column: "progressStatus", title: "Status", options: status,}]

  return (
    <DataTable columns={columns} data={batches} contentForm={<BatchForm onSuccess={refetch}/>}  filters={filters}/>
  );
};
