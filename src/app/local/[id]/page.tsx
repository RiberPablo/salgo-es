import { getVenueById } from "@/lib/venues";
import { notFound } from "next/navigation";

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const venue = await getVenueById(id);

  if (!venue) {
    notFound();
  }

  const foto =
    venue.photos?.find((p) => p.is_main)?.image_url ??
    venue.photos?.[0]?.image_url ??
    "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80";

  const generos = (venue.venue_genres
    ?.map((vg) => vg.genres?.nombre)
    .filter(Boolean) ?? []) as string[];

  const horarios = venue.schedules ?? [];

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

      {/* IMAGEN PRINCIPAL */}
      <div className="relative h-[45vh] w-full overflow-hidden bg-zinc-800">
        <img src={foto} alt={venue.nombre} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/30 to-transparent" />

        <div className="absolute bottom-6 left-5 right-5 mx-auto max-w-7xl">
          <span className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold capitalize text-black">
            {venue.tipo_local ?? "Local"}
          </span>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
            {venue.nombre}
          </h1>
          <p className="mt-2 text-zinc-300">
            📍 {venue.direccion ? `${venue.direccion} · ` : ""}
            {venue.zones?.nombre ?? "Sin zona"}
            {venue.cities?.nombre ? `, ${venue.cities.nombre}` : ""}
          </p>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-3">
        {/* COLUMNA PRINCIPAL */}
        <div className="md:col-span-2">
          {venue.descripcion && (
            <>
              <h2 className="text-xl font-bold">Sobre este local</h2>
              <p className="mt-3 leading-relaxed text-zinc-400">{venue.descripcion}</p>
            </>
          )}

          {generos.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Música</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {generos.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-300"
                  >
                    🎵 {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          {horarios.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Horarios</h2>
              <div className="mt-3 divide-y divide-white/5 rounded-2xl border border-white/5">
                {horarios
                  .sort((a, b) => a.dia_semana - b.dia_semana)
                  .map((h) => (
                    <div
                      key={h.dia_semana}
                      className="flex justify-between px-4 py-3 text-sm"
                    >
                      <span className="text-zinc-400">{DIAS[h.dia_semana]}</span>
                      <span className="font-medium">
                        {h.apertura && h.cierre ? `${h.apertura} - ${h.cierre}` : "Cerrado"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="h-fit rounded-3xl border border-white/5 bg-zinc-900 p-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-zinc-500">Entrada</p>
              <p className="mt-1 text-lg font-bold">
                {venue.precio_entrada ? `${venue.precio_entrada}€` : "Consultar"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Copa</p>
              <p className="mt-1 text-lg font-bold">
                {venue.precio_copa ? `${venue.precio_copa}€` : "Consultar"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Rango de edad</p>
              <p className="mt-1 font-medium">{venue.rango_edad ?? "Todas"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Vestimenta</p>
              <p className="mt-1 font-medium capitalize">{venue.vestimenta ?? "Casual"}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {venue.instagram && (
              <a
                href={venue.instagram}
                target="_blank"
                className="rounded-xl bg-white/[0.05] py-3 text-center text-sm font-medium transition hover:bg-lime-400 hover:text-black"
              >
                Instagram →
              </a>
            )}
            {venue.web && (
              <a
                href={venue.web}
                target="_blank"
                className="rounded-xl border border-white/10 py-3 text-center text-sm font-medium transition hover:bg-white hover:text-black"
              >
                Web oficial →
              </a>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
