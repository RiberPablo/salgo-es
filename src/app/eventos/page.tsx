import Link from "next/link";
import { getEventosEspeciales } from "@/lib/venues";
import {
  EVENTO_CATEGORIAS,
  etiquetaFechaLarga,
  nocheActual,
  proximosDias,
} from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DayStrip } from "@/components/DayStrip";
import { EventCard } from "@/components/EventCard";

export const dynamic = "force-dynamic";

type Params = Record<string, string | string[] | undefined>;

function primero(v: string | string[] | undefined): string | undefined {
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() ? s.trim() : undefined;
}

const diaDe = (fecha: string | null) => (fecha ?? "").slice(0, 10);

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const raw = await searchParams;
  const todos = await getEventosEspeciales();

  // Tipos que hay de verdad ahora mismo (con su número de eventos)
  const conteo = new Map<string, number>();
  for (const e of todos) {
    const c = e.categoria ?? "fiesta";
    conteo.set(c, (conteo.get(c) ?? 0) + 1);
  }

  const categoriaPedida = primero(raw.categoria);
  const categoria =
    categoriaPedida && conteo.has(categoriaPedida) ? categoriaPedida : undefined;

  const delTipo = categoria
    ? todos.filter((e) => (e.categoria ?? "fiesta") === categoria)
    : todos;

  // Solo se ofrecen los días en los que hay algo
  const diasConEvento = new Set(delTipo.map((e) => diaDe(e.fecha_inicio)));
  const fechaPedida = primero(raw.fecha);
  const fecha =
    fechaPedida && diasConEvento.has(fechaPedida) ? fechaPedida : undefined;

  const visibles = fecha
    ? delTipo.filter((e) => diaDe(e.fecha_inicio) === fecha)
    : delTipo;

  // Agrupados por día, en orden
  const grupos = new Map<string, typeof visibles>();
  for (const e of visibles) {
    const d = diaDe(e.fecha_inicio);
    if (!grupos.has(d)) grupos.set(d, []);
    grupos.get(d)!.push(e);
  }

  function hrefCon(nuevo: { categoria?: string; fecha?: string }) {
    const p = new URLSearchParams();
    const c = "categoria" in nuevo ? nuevo.categoria : categoria;
    const f = "fecha" in nuevo ? nuevo.fecha : fecha;
    if (c) p.set("categoria", c);
    if (f) p.set("fecha", f);
    const qs = p.toString();
    return qs ? `/eventos?${qs}` : "/eventos";
  }

  const dias = proximosDias(90)
    .filter((d) => diasConEvento.has(d.fecha))
    .slice(0, 14)
    .map((d) => ({
      ...d,
      href: hrefCon({ fecha: d.fecha }),
      activo: d.fecha === fecha,
    }));

  const chip = (activo: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition ${
      activo
        ? "border-lime-400 bg-lime-400 font-bold text-black"
        : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-lime-400/40 hover:text-white"
    }`;

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Header />

      <section className="px-5 pb-6 pt-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-lime-400">AGENDA DE MADRID</p>
          <h1 className="mt-1 text-3xl font-black md:text-5xl">
            {fecha ? `Eventos el ${etiquetaFechaLarga(fecha)}` : "Eventos"}
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-500">
            Conciertos, festivales y fiestas populares: la Hispanidad, fiestas
            patronales y todo lo que pasa en la ciudad fuera de las
            discotecas.
          </p>

          {/* TIPO DE EVENTO */}
          {conteo.size > 1 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href={hrefCon({ categoria: undefined })}
                className={chip(!categoria)}
              >
                Todos ({todos.length})
              </Link>
              {Array.from(conteo.entries()).map(([c, n]) => (
                <Link
                  key={c}
                  href={hrefCon({ categoria: c })}
                  className={chip(categoria === c)}
                >
                  {EVENTO_CATEGORIAS[c]?.icon ?? "🎉"}{" "}
                  {EVENTO_CATEGORIAS[c]?.plural ?? c} ({n})
                </Link>
              ))}
            </div>
          )}

          {/* ELEGIR DÍA */}
          {dias.length > 0 && (
            <div className="mt-5">
              <DayStrip
                dias={dias}
                hrefTodos={hrefCon({ fecha: undefined })}
                sinFecha={!fecha}
              />
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pb-16 pt-2">
        <div className="mx-auto max-w-7xl">
          {visibles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-zinc-500">
              Todavía no hay eventos publicados. Vuelve pronto 👀
              <br />
              <Link
                href="/buscar?fecha=hoy"
                className="mt-4 inline-block text-lime-400 hover:underline"
              >
                Ver qué abre esta noche →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {Array.from(grupos.entries()).map(([dia, lista]) => (
                <div key={dia}>
                  <h2 className="mb-4 text-xl font-bold capitalize">
                    {etiquetaFechaLarga(dia)}{" "}
                    <span className="text-base font-normal text-zinc-500">
                      ({lista.length})
                    </span>
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {lista.map((e) => (
                      <EventCard key={e.id} evento={e} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-14 rounded-3xl border border-white/5 bg-zinc-900 p-6 text-sm text-zinc-400">
            ¿Buscas fiesta en una discoteca o un tardeo?{" "}
            <Link
              href={`/buscar?fecha=${fecha ?? nocheActual().fecha}`}
              className="font-medium text-lime-400 hover:underline"
            >
              Mira qué hay ese día en los locales →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
