"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

type Props<T> = {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  loading?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
};

export function DataTable<T>({
  data,
  columns,
  loading = false,
  searchPlaceholder = "Buscar...",
  pageSize = 20,
}: Props<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const totalFiltered = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 min-h-0">
      {/* Buscador */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Tabla */}
      <div className="min-h-0 flex-1 rounded-lg border border-border bg-card overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent bg-muted/50">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id} style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}>
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors -ml-0.5"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sorted === "asc"  ? <ArrowUp size={13} /> :
                           sorted === "desc" ? <ArrowDown size={13} /> :
                           <ArrowUpDown size={13} className="opacity-40" />}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FileText size={36} className="opacity-30" />
                    <p className="text-sm">
                      {globalFilter
                        ? `Sin resultados para "${globalFilter}"`
                        : "No hay datos."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pie: selector de página + total + paginación */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {/* Izquierda: selector + total */}
        <div className="flex items-center gap-2">
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(v) => {
              table.setPageSize(Number(v));
              table.setPageIndex(0);
            }}
          >
            <SelectTrigger className="h-7 w-20 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <SelectItem key={n} value={String(n)}>{n} / pág.</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>{totalFiltered} registro{totalFiltered !== 1 ? "s" : ""}</span>
        </div>

        {/* Derecha: anterior / página X de Y / siguiente */}
        {pageCount > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="xs"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <span>
              Página {table.getState().pagination.pageIndex + 1} de {pageCount}
            </span>
            <Button
              variant="outline" size="xs"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
