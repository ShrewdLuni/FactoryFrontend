import { columns} from "./colums";
import { DataTable } from "../data-table";
import { BatchForm } from "../forms/batch";
import { useBatches } from "@/hooks/useBatch";

export const BatchPage = () => {

  const { batches } = useBatches()

  console.log(batches);

  return (
    <DataTable columns={columns} data={batches} contentForm={<BatchForm />} />
  );
};
