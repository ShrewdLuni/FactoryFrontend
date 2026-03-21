import { useWorkstations } from "@/hooks/useWorkstations";
import { DataTable } from "../../components/data-table";
import { columns } from "./columns";

export const WorkstationsPage = () => {
  const { data: workstations, isLoading } = useWorkstations.getAll();

  if (isLoading) return <div>Loading...</div>;

  return (
    <DataTable
      columns={columns}
      data={workstations!}
      searchValues={"name"}
      isAddSection={false}
      // contentForm={
      //   <WorkstationsForm
      //     onSuccess={() => {
      //       console.log("success");
      //     }}
      //   />
      // }
    />
  );
};
