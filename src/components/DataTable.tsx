'use client';

import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SortingState } from '@/types';
import Pagination from './Pagination';
import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from 'react-icons/ai';
import { cn } from '@/lib/utils';

interface DataTableProps<TData> {
  columns: any[];
  data: TData;
  pageCount: number;
}

export default function DataTable<TData>({
  columns,
  data,
  pageCount,
}: DataTableProps<TData>) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = searchParams?.get('page') ?? '1';
  const count = searchParams?.get('count') ?? '10';
  const sort = searchParams?.get('sort') ?? '';
  const order = searchParams?.get('order') ?? '';

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: Number(page) - 1,
    pageSize: Number(count),
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  useEffect(() => {
    setPagination({
      pageIndex: Number(page) - 1,
      pageSize: Number(count),
    });
  }, [page, count]);

  useEffect(() => {
    router.replace(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        count: pageSize,
      })}`
    );
  }, [pageIndex, pageSize]);

  const [dataRaw, setDataRaw] = useState(data);

  useEffect(() => {
    setDataRaw(data);
  }, [data]);

  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams?.toString());
    const sort = sorting.map(({ id }) => {
      return id;
    });
    const order = sorting.map(({ desc }) => {
      return desc ? 'desc' : 'asc';
    });

    if (sort.length) {
      newSearchParams.set('sort', sort.join(','));
    } else {
      newSearchParams.delete('sort');
    }

    if (order.length) {
      newSearchParams.set('order', order.join(','));
    } else {
      newSearchParams.delete('order');
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  }, [sorting]);

  useEffect(() => {
    if (sort && order) {
      setSorting([
        {
          id: sort,
          desc: order === 'desc',
        },
      ]);
    }
  }, [sort, order]);

  const table = useReactTable({
    data: dataRaw as any[],
    columns,
    pageCount: pageCount ?? 1,
    state: {
      pagination,
      sorting,
    },
    initialState: {
      sorting: [
        {
          id: 'id',
          desc: true,
        },
      ],
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    onSortingChange: setSorting,
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
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
