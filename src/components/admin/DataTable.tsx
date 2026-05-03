// Generic admin data table component.
import type { ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
}

export function DataTable<T>({ rows, columns }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-hairline)]">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-[var(--color-surface-soft)]">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3 font-medium" key={column.key}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr className="border-t border-[var(--color-hairline)]" key={index}>
              {columns.map((column) => (
                <td className="px-4 py-3" key={`${column.key}-${index}`}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
