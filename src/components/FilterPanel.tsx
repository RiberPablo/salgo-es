import Link from "next/link";
import type { ReactNode } from "react";
import type { Filtros } from "@/lib/venues";
import { CATEGORIAS } from "@/lib/utils";

// Cada tramo se filtra con su edad mínima: "+25" enseña los locales que
// admiten a alguien de 25, así que quedan fuera los que empiezan en +35.
const EDADES = [
  { value: "18", label: "+18" },
  { value: "25", label: "+25" },
  { value: "35", label: "+35" },
];

const PRECIOS = [
  { value: "gratis", label: "Entrada gratis" },
  { value: "10", label: "Hasta 10€" },
  { value: "15", label: "Hasta 15€" },
  { value: "20", label: "Hasta 20€" },
  { value: "30", label: "Hasta 30€" },
];

const CAMPO =
  "w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-lime-400/60";

function Campo({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-zinc-500">{label}</span>
      {children}
    </label>
  );
}

export function FilterPanel({
  valores,
  activos,
  zonas,
  ciudades,
  generos,
  vestimentas,
  hoy,
}: {
  valores: Filtros;
  activos: number;
  zonas: string[];
  ciudades: string[];
  generos: string[];
  vestimentas: string[];
  hoy: string;
}) {
  return (
    <details
      open={activos > 0}
      className="group rounded-3xl border border-white/10 bg-zinc-900/70 backdrop-blur"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 font-semibold">
          ⚙️ Filtros
          {activos > 0 && (
            <span className="rounded-full bg-lime-400 px-2 py-0.5 text-xs font-bold text-black">
              {activos}
            </span>
          )}
        </span>
        <span className="text-zinc-500 transition group-open:rotate-180">▾</span>
      </summary>

      <form action="/buscar" method="get" className="border-t border-white/5 p-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <Campo label="Buscar">
              <input
                type="text"
                name="q"
                defaultValue={valores.q ?? ""}
                placeholder="Local, calle, zona o ciudad"
                className={CAMPO}
              />
            </Campo>
          </div>

          <Campo label="Tipo de local">
            <select name="tipo" defaultValue={valores.tipo ?? ""} className={CAMPO}>
              <option value="">Todos</option>
              {CATEGORIAS.map((c) => (
                <option key={c.tipo} value={c.tipo}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Día">
            <input
              type="date"
              name="fecha"
              min={hoy}
              defaultValue={valores.fecha ?? ""}
              className={CAMPO}
            />
          </Campo>

          <Campo label="Ciudad">
            <select name="ciudad" defaultValue={valores.ciudad ?? ""} className={CAMPO}>
              <option value="">Todas</option>
              {ciudades.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Zona">
            <select name="zona" defaultValue={valores.zona ?? ""} className={CAMPO}>
              <option value="">Todas</option>
              {zonas.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Música">
            <select name="genero" defaultValue={valores.genero ?? ""} className={CAMPO}>
              <option value="">Cualquiera</option>
              {generos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Edad">
            <select name="edad" defaultValue={valores.edad ?? ""} className={CAMPO}>
              <option value="">Todas</option>
              {EDADES.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Precio">
            <select name="precio" defaultValue={valores.precio ?? ""} className={CAMPO}>
              <option value="">Cualquiera</option>
              {PRECIOS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Vestimenta">
            <select
              name="vestimenta"
              defaultValue={valores.vestimenta ?? ""}
              className={CAMPO}
            >
              <option value="">Cualquiera</option>
              {vestimentas.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Campo>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
          >
            Aplicar filtros
          </button>
          <Link
            href="/buscar"
            className="rounded-xl border border-white/10 px-5 py-3 text-sm text-zinc-300 transition hover:bg-white hover:text-black"
          >
            Limpiar
          </Link>
        </div>
      </form>
    </details>
  );
}
