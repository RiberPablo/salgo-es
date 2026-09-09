import { searchVenues } from "@/lib/venues";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tipo?: string; genero?: string }>;
}) {
  const { q, tipo, genero } = await searchParams;
  const venues = await searchVenues({ q, tipo, genero });

  const etiquetas: string[] = [];
  if (q) etiquetas.push(`"${q}"`);
  if (tipo) etiquetas.push(tipo);
  if (genero) etiquetas.push(genero);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-lg font-black text-black">
              S
            </div>
            <span className="text-xl font-black tracking-tight">
              salgo<span className="text-lime-400">.es</span>
            </span>
          </a>
          <a
            href="/"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white hover:text-black"
          >
            ← Volver
          </a>
        </div>
      </header>

      {/* TITULO */}
      <section className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium text-lime-400">RESULTADOS</p>
          <h1 className="mt-1 text-3xl font-black md:text-4xl">
            {etiquetas.length > 0 ? etiquetas.join(" · ") : "Todos los locales"}
          </h1>
          <p className="mt-2 text-zinc-500">
            {venues.length > 0
              ? `${venues.length} ${venues.length === 1 ? "resultado" : "resultados"}`
              : "No hemos encontrado nada con esos filtros."}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-7xl">
          {venues.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-zinc-500">
              Prueba con otra búsqueda, otra zona o quita algún filtro.
              <br />
              <a href="/" className="mt-4 inline-block text-lime-400 hover:underline">
                ← Volver al inicio
              </a>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {venues.map((venue) => {
                const foto =
                  venue.photos?.find((p) => p.is_main)?.image_url ??
                  venue.photos?.[0]?.image_url ??
                  "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80";

                const generos = (venue.venue_genres
                  ?.map((vg) => vg.genres?.nombre)
                  .filter(Boolean) ?? []) as string[];

                return (
                  <article
                    key={venue.id}
                    className="group overflow-hidden rounded-3xl border border-white/5 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-white/20"
                  >
                    <div className="relative h-64 overflow-hidden bg-zinc-800">
                      <img
                        src={foto}
                        alt={venue.nombre}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium capitalize text-white backdrop-blur">
                        {venue.tipo_local ?? "Local"}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <p className="text-sm text-zinc-300">
                          📍 {venue.zones?.nombre ?? "Sin zona"}
                        </p>
                        <p className="text-xs text-zinc-400">{venue.cities?.nombre ?? ""}</p>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold">{venue.nombre}</h3>

                      {generos.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {generos.map((g) => (
                            <span
                              key={g}
                              className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-400"
                            >
                              🎵 {g}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-xs text-zinc-500">Entrada</p>
                            <p className="font-semibold text-white">
                              {venue.precio_entrada ? `${venue.precio_entrada}€` : "Consultar"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-zinc-500">Copa</p>
                            <p className="font-semibold text-white">
                              {venue.precio_copa ? `${venue.precio_copa}€` : "Consultar"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <a
                        href={`/local/${venue.id}`}
                        className="mt-5 block w-full rounded-xl bg-white/[0.05] py-3 text-center text-sm font-medium text-white transition hover:bg-lime-400 hover:text-black"
                      >
                        Ver local
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
