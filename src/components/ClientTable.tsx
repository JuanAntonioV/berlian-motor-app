'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Loader2 } from 'lucide-react';
import Pagination from './Pagination';
import { useEffect, useState } from 'react';
import { SortingState } from '@/types';
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from 'react-icons/ai';
import { cn } from '@/lib/utils';

type Props<TData> = {
  columns: any[];
  data: TData[];
  isLoading?: boolean;
};

export default function ClientTable<TData>({
  columns,
  data,
  isLoading,
}: Props<TData>) {
  const [dataRaw, setDataRaw] = useState(data);

  useEffect(() => {
    setDataRaw(data);
  }, [data]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: dataRaw,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <main className='overflow-x-auto w-auto'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      <div
                        className={cn(
                          'flex items-center gap-1',
                          header.column.getCanSort() &&
                            'cursor-pointer select-none'
                        )}
                        style={{ width: `${header.getSize()}px` }}
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                              ? 'Sort descending'
                              : 'Clear sort'
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <AiOutlineSortAscending size={16} />,
                          desc: <AiOutlineSortDescending size={16} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className='flexCenterCol gap-2'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary' />
                    <span className='text-sm text-gray-500'>
                      Memuat data...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='even:bg-gray-100'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <footer className='mt-6 mb-2'>
        <Pagination table={table} />
      </footer>
    </main>
  );
}
