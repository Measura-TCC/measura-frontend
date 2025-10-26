import React from "react";

export interface Column<T = any> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  hideOnMobile?: boolean;
}

export interface TableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  getRowKey: (item: T) => string;
  emptyMessage?: React.ReactNode;
  className?: string;
}

export function Table<T = any>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No data available",
  className = "",
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <div className={`hidden md:block overflow-x-auto ${className}`}>
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={getRowKey(item)}
                className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm bg-white dark:bg-gray-800 dark:text-gray-300"
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`md:hidden space-y-4 w-full ${className}`}>
        {data.map((item) => (
          <div
            key={getRowKey(item)}
            className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3"
          >
            {columns
              .filter((column) => !column.hideOnMobile)
              .map((column) => (
                <div key={column.key} className="w-full">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {column.label}
                  </div>
                  <div className="text-sm dark:text-gray-300 w-full">
                    {column.render(item)}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  );
}
