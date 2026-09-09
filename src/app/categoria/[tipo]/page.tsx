import { getVenuesByTipo } from "@/lib/venues";
import { notFound } from "next/navigation";

// Mapea el slug de la URL (plural, para que se lea bien) al valor guardado en BD (singular)
const TIPOS: Record<string, { db: string; label: string; icon: string }> = {
  discotecas: { db: "discoteca", label: "Discotecas", icon: "🪩" },
  pubs: { db: "pub", label: "Pubs", icon: "🍸" },
  tardeos: { db: "tardeo", label: "Tardeos", icon: "🍹" },
  bares: { db: "bar", label: "Bares", icon: "🍺" },
};

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo } = await params;
  const config = TIPOS[tipo];

  if (!config) {
    notFound();
  }

  const venues = await getVenuesByTipo(config.db);

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

          <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
            <a href="/" className="transition hover:text-white">
              Explorar
            </a>
            <a
              href="/categoria/discotecas"
              className={tipo === "discotecas" ? "text-white" : "transition hover:text-white"}
            >
              Discotecas
            </a>
            <a
              href="/categoria/tardeos"
              className={tipo === "tardeos" ? "text-white" : "transition hover:text-white"}
            >
              Tardeos
            </a>
            <a
              href="/categoria/pubs"
              className={tipo === "pubs" ? "text-white" : "transition hover:text-white"}
            >
              Pubs
            </a>
          </nav>

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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-3xl">
            {config.icon}
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            {config.label}
          </h1>
          <p className="mt-2 text-zinc-500">
            {venues.length > 0
              ? `${venues.length} ${venues.length === 1 ? "sitio" : "sitios"} en Madrid`
              : "Aún no tenemos locales de esta categoría — muy pronto añadiremos más."}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-7xl">
          {venues.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-zinc-500">
              Esta categoría está en construcción. Vuelve pronto 👀
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
                          {generos.map((genre) => (
                            <span
                              key={genre}
                              className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-400"
                            >
                              🎵 {genre}
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
