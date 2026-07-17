import { useGetProductInventory } from "@/api/generated/product/product";
import { DataTable } from "@/components/data-table";
import { getInventoryColumns } from "./columns";

export const InventoryPage = () => {
  const { data: inventory = [], isLoading } = useGetProductInventory();

  const milestones = inventory[0]?.milestones.map((m) => ({ id: m.id, label: m.label })) ?? [];
  const columns = getInventoryColumns({ milestones });

  if (isLoading) return <div></div>;

  return (
    <div>
      <DataTable
        searchValues="name"
        data={inventory}
        columns={columns}
      />
    </div>
  );
};
