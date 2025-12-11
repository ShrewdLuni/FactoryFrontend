import { columns} from "./colums";
import { DataTable } from "../data-table";
import { BatchForm } from "../forms/batch";
import { useBatches } from "@/hooks/useBatch";
import { CircleX, CircleEllipsis, CircleCheck } from "lucide-react";

export const BatchPage = () => {

  const { batches } = useBatches()

  console.log(batches);

  const status = [
    {
      label: "Inactive",
      value: "Inactive",
      icon: CircleX,
    },
    {
      label: "In-Progress",
      value: "In-Progress",
      icon: CircleEllipsis,
    },
    {
      label: "Completed",
      value: "Completed",
      icon: CircleCheck,
    },
  ]

  const filters = [{column: "status", title: "Status", options: status,}]

  return (
    <DataTable columns={columns} data={batches} contentForm={<BatchForm />}  filters={filters}/>
  );
};
