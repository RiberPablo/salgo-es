import Link from "next/link";
import { eventosQueCoinciden, getEventos } from "@/lib/venues";
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
  const q = primero(raw.q);
  const local = primero(raw.local);
  const deTodos = eventosQueCoinciden(await getEventos("todos"), q);
  // Filtro por local: solo los eventos de ese sitio (llega desde su ficha)
  const nombreLocal = local
    ? deTodos.find((e) => e.venues?.id === local)?.venues?.nombre ?? null
    : null;
  const todos = local ? deTodos.filter((e) => e.venues?.id === local) : deTodos;

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

  function hrefCon(nuevo: {
    categoria?: string;
    fecha?: string;
    q?: string;
    local?: string;
  }) {
    const p = new URLSearchParams();
    const c = "categoria" in nuevo ? nuevo.categoria : categoria;
    const f = "fecha" in nuevo ? nuevo.fecha : fecha;
    const ll = "local" in nuevo ? nuevo.local : local;
    if (ll) p.set("local", ll);
    const qq = "q" in nuevo ? nuevo.q : q;
    if (qq) p.set("q", qq);
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
          <p className="text-sm font-medium text-lime-400">
            {nombreLocal ? "AGENDA DEL LOCAL" : "AGENDA DE MADRID"}
          </p>
          <h1 className="mt-1 text-3xl font-black md:text-5xl">
            {fecha
              ? `Eventos el ${etiquetaFechaLarga(fecha)}`
              : nombreLocal
              ? `Eventos en ${nombreLocal}`
              : "Eventos"}
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-500">
            Todo lo que pasa en Madrid: fiestas en discotecas y locales,
            conciertos, festivales y fiestas populares.
          </p>

          {/* FILTRO ACTIVO: el local */}
          {nombreLocal && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href={hrefCon({ local: undefined })}
                className="group flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1.5 text-sm text-lime-200 transition hover:border-lime-400"
              >
                📍 {nombreLocal}
                <span className="text-lime-400/60 group-hover:text-lime-300">
                  ✕
                </span>
              </Link>
              <Link
                href={`/local/${local}`}
                className="px-2 text-sm text-zinc-500 transition hover:text-white"
              >
                Ver ficha del local →
              </Link>
              <Link
                href={hrefCon({ local: undefined })}
                className="px-2 text-sm text-zinc-500 transition hover:text-white"
              >
                Ver todos los eventos
              </Link>
            </div>
          )}

          {/* BUSCAR EVENTOS */}
          <form action="/eventos" method="get" className="mt-5 flex max-w-xl gap-2">
            {categoria && <input type="hidden" name="categoria" value={categoria} />}
            {local && <input type="hidden" name="local" value={local} />}
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Busca un evento, artista, fiesta o lugar"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-lime-400/50"
            />
            <button
              type="submit"
              className="rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
            >
              Buscar
            </button>
            {q && (
              <Link
                href={hrefCon({ q: undefined })}
                className="flex items-center rounded-xl border border-white/10 px-4 text-sm text-zinc-400 transition hover:text-white"
              >
                Quitar
              </Link>
            )}
          </form>

          {/* TIPO DE EVENTO */}
          {!local && conteo.size > 1 && (
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
          {!local && dias.length > 0 && (
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
              {q ? `No hay eventos que coincidan con “${q}”.` : "Todavía no hay eventos publicados. Vuelve pronto 👀"}
              <br />
              <Link
                href="/buscar?fecha=hoy"
                className="mt-4 inline-block text-lime-400 hover:underline"
              >
                Ver qué abre esta noche →
              </Link>
            </div>
          ) : local ? (
            /* Un solo local: sus próximas fechas en fila, para deslizar */
            <div>
              <p className="mb-4 text-sm text-zinc-500">
                {visibles.length}{" "}
                {visibles.length === 1 ? "próximo evento" : "próximos eventos"}
                {visibles.length > 1 && " · desliza para ver más →"}
              </p>
              <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-5 [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin]">
                {visibles.map((e) => (
                  <div key={e.id} className="w-60 flex-none snap-start sm:w-64">
                    <EventCard evento={e} />
                  </div>
                ))}
              </div>
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
