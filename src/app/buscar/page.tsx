import Link from "next/link";
import { FILTRO_KEYS, filtrarLocales, getVenues } from "@/lib/venues";
import type { Filtros } from "@/lib/venues";
import { DIAS, nocheActual, tipoInfo } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FilterPanel } from "@/components/FilterPanel";
import { VenueCard } from "@/components/VenueCard";

export const dynamic = "force-dynamic";

type Params = Record<string, string | string[] | undefined>;

function primero(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() ? s.trim() : undefined;
}

// Texto legible para cada filtro activo (para los chips)
function etiqueta(key: keyof Filtros, valor: string): string {
  switch (key) {
    case "q":
      return `“${valor}”`;
    case "tipo":
      return tipoInfo(valor)?.nombre ?? valor;
    case "cuando":
      return valor === "hoy" ? "Esta noche" : DIAS[Number(valor)] ?? valor;
    case "edad":
      return `+${valor}`;
    case "precio":
      return valor === "gratis" ? "Entrada gratis" : `Hasta ${valor}€`;
    default:
      return valor;
  }
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const raw = await searchParams;

  const filtros: Filtros = {};
  for (const key of FILTRO_KEYS) {
    const valor = primero(raw[key]);
    if (valor) filtros[key] = valor;
  }

  const todos = await getVenues();
  const { resultados, ocultosPorPrecio } = filtrarLocales(todos, filtros);
  const noche = nocheActual();

  // Opciones de los desplegables: solo lo que existe de verdad en los datos
  const unicos = (valores: (string | null | undefined)[]) =>
    Array.from(new Set(valores.filter(Boolean) as string[])).sort((a, b) =>
      a.localeCompare(b, "es")
    );

  const zonas = unicos(todos.map((v) => v.zones?.nombre));
  const ciudades = unicos(todos.map((v) => v.cities?.nombre));
  const vestimentas = unicos(todos.map((v) => v.vestimenta));
  const generos = unicos(
    todos.flatMap((v) => (v.venue_genres ?? []).map((vg) => vg.genres?.nombre))
  );

  const activos = FILTRO_KEYS.filter((k) => filtros[k]);

  // Enlace a esta misma búsqueda pero sin uno de los filtros
  function sinFiltro(quitar: keyof Filtros) {
    const p = new URLSearchParams();
    for (const k of FILTRO_KEYS) {
      const v = filtros[k];
      if (v && k !== quitar) p.set(k, v);
    }
    const qs = p.toString();
    return qs ? `/buscar?${qs}` : "/buscar";
  }

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Header />

      <section className="px-5 pb-6 pt-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-lime-400">BUSCADOR</p>
          <h1 className="mt-1 text-3xl font-black md:text-5xl">
            {activos.length > 0 ? "Resultados" : "Todos los locales"}
          </h1>
          <p className="mt-2 text-zinc-500">
            {resultados.length > 0
              ? `${resultados.length} ${
                  resultados.length === 1 ? "resultado" : "resultados"
                }`
              : "No hemos encontrado nada con esos filtros."}
          </p>

          <div className="mt-6">
            <FilterPanel
              valores={filtros}
              activos={activos.length}
              zonas={zonas}
              ciudades={ciudades}
              generos={generos}
              vestimentas={vestimentas}
            />
          </div>

          {activos.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activos.map((k) => (
                <Link
                  key={k}
                  href={sinFiltro(k)}
                  className="group flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1.5 text-sm text-lime-200 transition hover:border-lime-400"
                >
                  {etiqueta(k, filtros[k] as string)}
                  <span className="text-lime-400/60 group-hover:text-lime-300">
                    ✕
                  </span>
                </Link>
              ))}
              <Link
                href="/buscar"
                className="px-2 text-sm text-zinc-500 transition hover:text-white"
              >
                Quitar todos
              </Link>
            </div>
          )}

          {ocultosPorPrecio > 0 && (
            <p className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
              💡 {ocultosPorPrecio}{" "}
              {ocultosPorPrecio === 1
                ? "local no aparece porque todavía no tiene"
                : "locales no aparecen porque todavía no tienen"}{" "}
              el precio confirmado.
            </p>
          )}
        </div>
      </section>

      <section className="px-5 pb-16 pt-4">
        <div className="mx-auto max-w-7xl">
          {resultados.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-zinc-500">
              Prueba con otra búsqueda, otra zona o quita algún filtro.
              <br />
              <Link
                href="/buscar"
                className="mt-4 inline-block text-lime-400 hover:underline"
              >
                Ver todos los locales
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {resultados.map((v) => (
                <VenueCard key={v.id} venue={v} noche={noche} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
