import { DataTable } from "@/components/data-table";
import { useFindQuantities } from "@/hooks/useProducts";
import { getStorageColumns } from "./columns";

export const StoragePage = () => {
  const { data: quantities = [], isLoading } = useFindQuantities();

  if (isLoading) {
    return <div>Loading</div>;
  }

  const statuses = quantities[0]?.quantity?.map((q: any) => q.status) ?? [];
  const columns = getStorageColumns(statuses);

  return <DataTable isAddSection={false} data={quantities} columns={columns} />;
};
