import { columns, type Batch } from "./colums"
import { DataTable } from "../data-table"

export const BatchPage = () => {

  const data: Batch[] = [
    { id: "B001", status: "Inactive", productId: "S001", category: "Men Socks" },
    { id: "B002", status: "Knitting Workshop", productId: "S002", category: "Women Socks" },
    { id: "B003", status: "Sewing Workshop", productId: "S003", category: "Ankle Socks" },
    { id: "B004", status: "Molding Workshop", productId: "S004", category: "Sports Socks" },
    { id: "B005", status: "Labeling Workshop", productId: "S005", category: "Kids Socks" },
    { id: "B006", status: "Turning-Out", productId: "S006", category: "Men Socks" },
    { id: "B007", status: "Knitting Workshop", productId: "S007", category: "Thermal Socks" },
    { id: "B008", status: "Sewing Workshop", productId: "S008", category: "Compression Socks" },
    { id: "B009", status: "Molding Workshop", productId: "S009", category: "Baby Socks" },
    { id: "B010", status: "Labeling Workshop", productId: "S010", category: "Crew Socks" },
    { id: "B011", status: "Turning-Out", productId: "S011", category: "No-Show Socks" },
    { id: "B012", status: "Finished", productId: "S012", category: "Winter Socks" },
    { id: "B013", status: "Inactive", productId: "S013", category: "Cotton Socks" },
    { id: "B014", status: "Knitting Workshop", productId: "S014", category: "Dress Socks" },
    { id: "B015", status: "Sewing Workshop", productId: "S015", category: "Work Socks" },
    { id: "B016", status: "Molding Workshop", productId: "S016", category: "Casual Socks" },
    { id: "B017", status: "Labeling Workshop", productId: "S017", category: "Printed Socks" },
    { id: "B018", status: "Turning-Out", productId: "S018", category: "Men Socks" },
    { id: "B019", status: "Finished", productId: "S019", category: "Ankle Socks" },
    { id: "B020", status: "Finished", productId: "S020", category: "Women Socks" },
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
