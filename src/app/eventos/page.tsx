import { getUpcomingEvents } from "@/lib/venues";

export default async function EventosPage() {
  const eventos = await getUpcomingEvents(50);

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
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] text-3xl">
            🎤
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Eventos
          </h1>
          <p className="mt-2 text-zinc-500">
            {eventos.length > 0
              ? `${eventos.length} ${eventos.length === 1 ? "evento" : "eventos"} próximamente`
              : "Todavía no tenemos eventos publicados — vuelve pronto."}
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-7xl">
          {eventos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-zinc-500">
              Todavía no hay eventos con fecha confirmada. Vuelve pronto 👀
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {eventos.map((evento) => {
                const fecha = new Date(evento.fecha_inicio);
                const fechaLabel = fecha.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  timeZone: "Europe/Madrid",
                });
                const horaLabel = fecha.toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Europe/Madrid",
                });

                return (
                  <a
                    key={evento.id}
                    href={evento.venues ? `/local/${evento.venues.id}` : "#"}
                    className="group block overflow-hidden rounded-3xl border border-white/5 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-lime-400/40"
                  >
                    <div className="relative h-48 overflow-hidden bg-zinc-800">
                      <img
                        src={
                          evento.foto_url ??
                          "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80"
                        }
                        alt={evento.nombre}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-lime-400 px-3 py-1.5 text-xs font-bold capitalize text-black">
                        {fechaLabel} · {horaLabel}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold">{evento.nombre}</h3>

                      {evento.venues && (
                        <p className="mt-1 text-sm text-zinc-500">
                          📍 {evento.venues.nombre}
                          {evento.venues.zones ? ` · ${evento.venues.zones.nombre}` : ""}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-sm">
                        <div>
                          <p className="text-xs text-zinc-500">Desde</p>
                          <p className="font-semibold text-white">
                            {evento.precio_desde != null ? `${evento.precio_desde}€` : "Consultar"}
                          </p>
                        </div>

                        {evento.entrada_url && (
                          <span className="rounded-xl bg-white/[0.05] px-4 py-2 text-xs font-medium text-white transition group-hover:bg-lime-400 group-hover:text-black">
                            Entradas →
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
