import { useWorkstations } from "@/hooks/useWorkstations";
import { DataTable } from "../data-table";
import { columns } from "./columns";
import { WorkstationsForm } from "../forms/workstations";

export const WorkstationsPage = () => {
  const { data: workstations, isLoading } = useWorkstations.getAll();

  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={columns}
      data={workstations!}
      searchValues={"name"}
      contentForm={
        <WorkstationsForm
          onSuccess={() => {
            console.log("success");
          }}
        />
      }
    />
  );
};
