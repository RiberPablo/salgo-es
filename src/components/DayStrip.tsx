import Link from "next/link";

export type DiaChip = {
  fecha: string;
  nombre: string; // Hoy / Mañana / Sáb
  numero: number;
  mes: string;
  href: string;
  activo: boolean;
};

const BASE =
  "flex w-[4.25rem] flex-none flex-col items-center gap-0.5 rounded-2xl border px-2 py-2.5 text-center transition";
const ON = "border-lime-400 bg-lime-400 text-black";
const OFF =
  "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-lime-400/40 hover:text-white";

// Tira de días para elegir cuándo quieres salir. Son enlaces normales (sin
// JavaScript en el navegador): cada día recarga la búsqueda con esa fecha.
export function DayStrip({
  dias,
  hrefTodos,
  sinFecha,
}: {
  dias: DiaChip[];
  hrefTodos: string;
  sinFecha: boolean;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Link href={hrefTodos} className={`${BASE} ${sinFecha ? ON : OFF}`}>
        <span className="text-[11px] font-medium uppercase">Todos</span>
        <span className="text-lg font-black leading-none">∞</span>
        <span className="text-[11px]">los días</span>
      </Link>

      {dias.map((d) => (
        <Link
          key={d.fecha}
          href={d.href}
          className={`${BASE} ${d.activo ? ON : OFF}`}
        >
          <span className="text-[11px] font-medium uppercase">{d.nombre}</span>
          <span className="text-lg font-black leading-none">{d.numero}</span>
          <span className="text-[11px]">{d.mes}</span>
        </Link>
      ))}
    </div>
  );
}
