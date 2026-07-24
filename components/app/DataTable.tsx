"use client";

import { useLayoutEffect, useRef, useState } from "react";
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
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "right";
  }
}

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
  const bodyRef = useRef<HTMLDivElement>(null);
  const [colWidths, setColWidths] = useState<number[]>([]);

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
  const hasFooter = columns.some((c) => c.footer);
  const rows = table.getRowModel().rows;

  const renderHeader = () => (
    <TableHeader>
      {table.getHeaderGroups().map((hg) => (
        <TableRow key={hg.id} className="hover:bg-transparent bg-muted/50">
          {hg.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const sorted = header.column.getIsSorted();
            const alignRight = header.column.columnDef.meta?.align === "right";
            return (
              <TableHead
                key={header.id}
                className={alignRight ? "text-right" : undefined}
                style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
              >
                {header.isPlaceholder ? null : canSort ? (
                  <button
                    className={cn(
                      "inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors",
                      alignRight ? "-mr-0.5" : "-ml-0.5"
                    )}
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
  );

  // El footer de totales vive en una tabla separada (para poder anclarla al
  // fondo de la grilla en vez de que quede pegada a la última fila cargada).
  // Estas medidas mantienen sus columnas alineadas con las del header/body.
  useLayoutEffect(() => {
    // Mientras loading=true se renderiza el estado "Cargando..." (sin tabla),
    // así que bodyRef todavía no apunta a nada. hasFooter no cambia de valor
    // entre ese render y el primero con datos reales, así que sin `loading`
    // en las deps este efecto nunca vuelve a correr y el footer queda sin medir.
    if (!hasFooter || loading) return;
    const ths = bodyRef.current?.querySelectorAll("thead th");
    if (!ths || ths.length === 0) return;
    const cells = Array.from(ths) as HTMLElement[];
    const measure = () => setColWidths(cells.map((c) => c.getBoundingClientRect().width));
    measure();
    const ro = new ResizeObserver(measure);
    cells.forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, [hasFooter, loading]);

  // ── Loading ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 min-h-0 min-w-0">
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
      <div className="min-h-0 flex-1 flex flex-col rounded-lg border border-border bg-card overflow-hidden">
        <div ref={bodyRef} className="min-h-0 flex-1 overflow-auto">
          {rows.length === 0 ? (
            <div className="flex h-full flex-col">
              <Table>{renderHeader()}</Table>
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
                <FileText size={36} className="opacity-30" />
                <p className="text-sm">
                  {globalFilter
                    ? `Sin resultados para "${globalFilter}"`
                    : "No hay datos."}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              {renderHeader()}
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {hasFooter && (
          <div className="shrink-0 overflow-x-auto">
            <Table>
              <colgroup>
                {colWidths.map((w, i) => (
                  <col key={i} style={{ width: w }} />
                ))}
              </colgroup>
              <TableFooter>
                {table.getFooterGroups().map((fg) => (
                  <TableRow key={fg.id} className="hover:bg-transparent">
                    {fg.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        className={header.column.columnDef.meta?.align === "right" ? "text-right" : undefined}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableFooter>
            </Table>
          </div>
        )}
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
