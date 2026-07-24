"use client";

import { useState } from "react";
import { SectionCard } from "@/components/app";
import type { MesResultado } from "./ResultadoAnualContainer";

// Colores validados para uso adyacente (barras/línea una al lado de la otra):
// par divergente azul↔rojo. El verde/rojo que ya usa el resto de la app para
// positivo/negativo (text-green-600/text-destructive) falla el chequeo de
// daltonismo cuando queda adyacente (ΔE 5.4, por debajo del piso de 6) — acá
// sí importa porque hay 12 barras una al lado de la otra. En números sueltos
// (cards de IVA/Resultado) no aplica el mismo problema y se dejaron como están.
const POS_FILL = "fill-[#2a78d6] dark:fill-[#3987e5]";
const NEG_FILL = "fill-[#e34948] dark:fill-[#e66767]";
const POS_TEXT = "text-[#2a78d6] dark:text-[#3987e5]";
const NEG_TEXT = "text-[#e34948] dark:text-[#e66767]";
const LINE_STROKE = "stroke-[#2a78d6] dark:stroke-[#3987e5]";

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const formatCompact = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", notation: "compact", maximumFractionDigits: 1 }).format(n);

function niceCeil(v: number): number {
  if (v <= 0) return 0;
  const exp = Math.floor(Math.log10(v));
  const base = 10 ** exp;
  const norm = v / base;
  const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return step * base;
}

// Path de barra con radio de 4px solo en las dos esquinas del extremo del
// dato (arriba si crece hacia arriba, abajo si crece hacia abajo) y esquina
// recta en la base — spec de marks-and-anatomy.
function barPath(x: number, y: number, w: number, h: number, roundTop: boolean): string {
  const r = Math.min(4, w / 2, h);
  if (h <= 0.5) return "";
  if (roundTop) {
    return `M${x},${y + h} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h} Z`;
  }
  return `M${x},${y} L${x + w},${y} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x + r},${y + h} Q${x},${y + h} ${x},${y + h - r} Z`;
}

type Props = {
  meses: MesResultado[];
  loading: boolean;
  error: string | null;
  anio: number;
};

const VBW = 760;
const MARGIN_L = 8;
const MARGIN_R = 12;
const BAR_TOP = 10;
const BAR_H = 140;
const LABELS_H = 20;
const GAP = 22;
const LINE_H = 90;
const VBH = BAR_TOP + BAR_H + LABELS_H + GAP + LINE_H + 28;

export default function ResultadoAnualChart({ meses, loading, error, anio }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const acumulados: number[] = [];
  meses.reduce((acc, m) => {
    const next = acc + m.resultado;
    acumulados.push(next);
    return next;
  }, 0);
  const totalAnual = acumulados.length > 0 ? acumulados[acumulados.length - 1] : 0;

  const n = meses.length;
  const plotW = VBW - MARGIN_L - MARGIN_R;
  const bandW = n > 0 ? plotW / n : plotW;
  const barW = Math.min(24, bandW * 0.55);

  const maxAbsMensual = Math.max(1, ...meses.map((m) => Math.abs(m.resultado)));
  const domainMensual = niceCeil(maxAbsMensual);
  const baselineY = BAR_TOP + BAR_H / 2;

  const minAcum = Math.min(0, ...acumulados, 0);
  const maxAcum = Math.max(0, ...acumulados, 0);
  const domainAcumLow = minAcum < 0 ? -niceCeil(-minAcum) : 0;
  const domainAcumHigh = maxAcum > 0 ? niceCeil(maxAcum) : niceCeil(1);
  const lineTop = BAR_TOP + BAR_H + LABELS_H + GAP;
  const acumRange = domainAcumHigh - domainAcumLow || 1;
  const yForAcum = (v: number) => lineTop + ((domainAcumHigh - v) / acumRange) * LINE_H;

  const xForIndex = (i: number) => MARGIN_L + bandW * i + bandW / 2;

  const points = acumulados.map((v, i) => `${xForIndex(i)},${yForAcum(v)}`).join(" ");

  const resultadoColor = totalAnual >= 0 ? POS_TEXT : NEG_TEXT;

  return (
    <SectionCard>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Resultado {anio}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Ganancia/pérdida mes a mes y acumulado del año</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Acumulado</p>
          <p className={`text-xl font-bold tabular-nums ${loading ? "opacity-40 text-foreground" : resultadoColor}`}>
            {loading ? "—" : (totalAnual > 0 ? "+" : "") + formatARS(totalAnual)}
          </p>
        </div>
      </div>

      {error && <div className="mb-3 rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">Cargando...</div>
      ) : n === 0 ? (
        <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">Sin datos este año.</div>
      ) : (
        <div className="relative">
          <svg viewBox={`0 0 ${VBW} ${VBH}`} className="w-full h-auto" role="img" aria-label={`Resultado mensual y acumulado ${anio}`}>
            {/* Gridlines barras: cero + tope +/- */}
            <line x1={MARGIN_L} y1={baselineY} x2={VBW - MARGIN_R} y2={baselineY} className="stroke-border" strokeWidth={1} />
            <line x1={MARGIN_L} y1={BAR_TOP} x2={VBW - MARGIN_R} y2={BAR_TOP} className="stroke-border/50" strokeWidth={1} />
            <line x1={MARGIN_L} y1={BAR_TOP + BAR_H} x2={VBW - MARGIN_R} y2={BAR_TOP + BAR_H} className="stroke-border/50" strokeWidth={1} />
            <text x={VBW - MARGIN_R} y={BAR_TOP + 8} textAnchor="end" className="fill-muted-foreground text-[9px]">
              {formatCompact(domainMensual)}
            </text>
            <text x={VBW - MARGIN_R} y={BAR_TOP + BAR_H - 2} textAnchor="end" className="fill-muted-foreground text-[9px]">
              -{formatCompact(domainMensual)}
            </text>

            {/* Barras mensuales */}
            {meses.map((m, i) => {
              const cx = xForIndex(i);
              const x = cx - barW / 2;
              const offset = (m.resultado / domainMensual) * (BAR_H / 2);
              const positivo = m.resultado >= 0;
              const y = positivo ? baselineY - offset : baselineY;
              const h = Math.abs(offset);
              return (
                <g key={m.label}>
                  <path d={barPath(x, y, barW, h, positivo)} className={positivo ? POS_FILL : NEG_FILL} />
                  <text x={cx} y={BAR_TOP + BAR_H + 14} textAnchor="middle" className="fill-muted-foreground text-[10px]">
                    {m.label}
                  </text>
                </g>
              );
            })}

            {/* Línea de acumulado */}
            {domainAcumLow < 0 && (
              <line x1={MARGIN_L} y1={yForAcum(0)} x2={VBW - MARGIN_R} y2={yForAcum(0)} className="stroke-border/50" strokeWidth={1} />
            )}
            <polyline points={points} fill="none" className={LINE_STROKE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {acumulados.map((v, i) => (
              <circle
                key={i}
                cx={xForIndex(i)}
                cy={yForAcum(v)}
                r={i === acumulados.length - 1 ? 4 : 3}
                className={`${v >= 0 ? POS_FILL : NEG_FILL} stroke-card`}
                strokeWidth={2}
              />
            ))}
            {acumulados.length > 0 && (
              <text
                x={xForIndex(acumulados.length - 1)}
                y={yForAcum(acumulados[acumulados.length - 1]) - 8}
                textAnchor="end"
                className={`text-[10px] font-medium ${acumulados[acumulados.length - 1] >= 0 ? POS_TEXT : NEG_TEXT}`}
              >
                {formatCompact(acumulados[acumulados.length - 1])}
              </text>
            )}

            {/* Columnas de hover (cubren barra + línea de ese mes) */}
            {meses.map((m, i) => (
              <rect
                key={`hit-${m.label}`}
                x={MARGIN_L + bandW * i}
                y={BAR_TOP}
                width={bandW}
                height={LINE_H + LABELS_H + GAP + BAR_H}
                fill="transparent"
                tabIndex={0}
                role="img"
                aria-label={`${m.label}: resultado ${formatARS(m.resultado)}, acumulado ${formatARS(acumulados[i])}`}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="outline-none"
              />
            ))}
          </svg>

          {hover !== null && (
            <div
              className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md"
              style={{ left: `${((hover + 0.5) / n) * 100}%`, top: `${(BAR_TOP / VBH) * 100}%` }}
            >
              <p className="font-semibold text-foreground mb-1">{meses[hover].label} {anio}</p>
              <p className="text-muted-foreground">
                Resultado: <span className={`font-medium ${meses[hover].resultado >= 0 ? POS_TEXT : NEG_TEXT}`}>{formatARS(meses[hover].resultado)}</span>
              </p>
              <p className="text-muted-foreground">
                Acumulado: <span className={`font-medium ${acumulados[hover] >= 0 ? POS_TEXT : NEG_TEXT}`}>{formatARS(acumulados[hover])}</span>
              </p>
            </div>
          )}

          <p className="mt-2 text-[11px] text-muted-foreground">
            Barras: resultado del mes (sobre la línea = ganancia, debajo = pérdida). Línea: acumulado del año.
          </p>
        </div>
      )}
    </SectionCard>
  );
}
