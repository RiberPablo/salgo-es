import Link from "next/link";
import { notFound } from "next/navigation";
import { getVenueById } from "@/lib/venues";
import {
  DIAS,
  TIPO_GRADIENTE,
  abreHoy,
  edadLabel,
  formatFecha,
  formatHora,
  formatPrecio,
  hhmm,
  madridNow,
  num,
  tipoInfo,
  venueFoto,
  venueTipos,
} from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

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

  const foto = venueFoto(venue);
  const fotos = venue.photos ?? [];
  const tipos = venueTipos(venue);
  const principal = tipoInfo(tipos[0]);
  const abre = abreHoy(venue);
  const edad = edadLabel(venue.rango_edad);

  const generos = (venue.venue_genres ?? [])
    .map((vg) => vg.genres?.nombre)
    .filter(Boolean) as string[];

  // Horarios de lunes a domingo (en BD 0 = domingo)
  const horarios = [...(venue.schedules ?? [])].sort(
    (a, b) => (a.dia_semana + 6) % 7 - (b.dia_semana + 6) % 7
  );

  // Solo eventos de hoy en adelante, el más cercano primero
  const hoy = madridNow().fecha;
  const eventos = (venue.events ?? [])
    .filter((e) => e.fecha_inicio && e.fecha_inicio.slice(0, 10) >= hoy)
    .sort((a, b) => (a.fecha_inicio! < b.fecha_inicio! ? -1 : 1));

  const mapsUrl = venue.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${venue.direccion}, ${venue.cities?.nombre ?? ""}`
      )}`
    : null;

  const pmin = num(venue.precio_persona_min);
  const pmax = num(venue.precio_persona_max);
  const tienePrecioMedioPersona = pmin !== null && pmax !== null;
  const precioMedioEstimado = num(venue.precio_medio);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Header />

      {/* IMAGEN PRINCIPAL */}
      <div className="relative h-[45vh] w-full overflow-hidden bg-zinc-800">
        {foto ? (
          <img
            src={foto}
            alt={venue.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
              TIPO_GRADIENTE[tipos[0] ?? ""] ?? TIPO_GRADIENTE.discoteca
            }`}
          >
            <span className="text-8xl opacity-30">
              {principal?.icon ?? "🪩"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-black/30 to-transparent" />

        <div className="absolute bottom-6 left-5 right-5 mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2">
            {tipos.map((t) => (
              <span
                key={t}
                className="rounded-full bg-lime-400 px-3 py-1 text-xs font-bold capitalize text-black"
              >
                {t}
              </span>
            ))}
            {abre && (
              <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
                Abre hoy
              </span>
            )}
          </div>
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
              <p className="mt-3 leading-relaxed text-zinc-400">
                {venue.descripcion}
              </p>
            </>
          )}

          {generos.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Música</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {generos.map((g) => (
                  <Link
                    key={g}
                    href={`/buscar?genero=${encodeURIComponent(g)}`}
                    className="rounded-full bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-lime-400 hover:text-black"
                  >
                    🎵 {g}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* GALERÍA */}
          {fotos.length > 1 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Fotos</h2>
              <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {fotos.map((f, i) => (
                  <img
                    key={`${f.image_url}-${i}`}
                    src={f.image_url}
                    alt={`${venue.nombre} ${i + 1}`}
                    loading="lazy"
                    className="h-56 w-auto flex-none snap-start rounded-2xl border border-white/5 object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          {/* PRÓXIMOS EVENTOS */}
          {eventos.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Próximos eventos</h2>
              <div className="mt-3 flex flex-col gap-4">
                {eventos.map((evento) => {
                  const precio = num(evento.precio_desde);
                  return (
                    <div
                      key={evento.id}
                      className="flex overflow-hidden rounded-2xl border border-white/5 bg-zinc-900"
                    >
                      {evento.foto_url && (
                        <img
                          src={evento.foto_url}
                          alt={evento.nombre ?? "Evento"}
                          loading="lazy"
                          className="w-28 flex-none object-cover sm:w-40"
                        />
                      )}

                      <div className="flex flex-1 flex-col justify-center p-4">
                        <p className="text-xs font-medium capitalize text-lime-400">
                          {formatFecha(evento.fecha_inicio)} ·{" "}
                          {formatHora(evento.fecha_inicio)}
                          {evento.fecha_fin
                            ? ` - ${formatHora(evento.fecha_fin)}`
                            : ""}
                        </p>

                        <h3 className="mt-1 font-bold">
                          {evento.nombre ?? venue.nombre}
                        </h3>

                        {evento.descripcion && (
                          <p className="mt-1 text-sm text-zinc-400">
                            {evento.descripcion}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {precio !== null && (
                            <span className="text-sm font-semibold">
                              {precio === 0
                                ? "Gratis"
                                : `Desde ${formatPrecio(precio)}`}
                            </span>
                          )}

                          {evento.entrada_url && (
                            <a
                              href={evento.entrada_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg bg-lime-400 px-3 py-1.5 text-xs font-bold text-black transition hover:bg-lime-300"
                            >
                              Comprar entrada →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {horarios.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold">Horarios</h2>
              <div className="mt-3 divide-y divide-white/5 rounded-2xl border border-white/5">
                {horarios.map((h) => (
                  <div
                    key={h.dia_semana}
                    className="flex justify-between px-4 py-3 text-sm"
                  >
                    <span className="text-zinc-400">{DIAS[h.dia_semana]}</span>
                    <span className="font-medium">
                      {h.apertura && h.cierre
                        ? `${hhmm(h.apertura)} - ${hhmm(h.cierre)}`
                        : "Cerrado"}
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
                {formatPrecio(venue.precio_entrada)}
              </p>
            </div>

            {tienePrecioMedioPersona ? (
              <div>
                <p className="text-xs text-zinc-500">Precio medio/persona</p>
                <p className="mt-1 text-lg font-bold">
                  €{pmin}-{pmax}
                </p>
                <p className="mt-0.5 text-[11px] text-zinc-600">Según Google</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-zinc-500">Copa</p>
                <p className="mt-1 text-lg font-bold">
                  {formatPrecio(venue.precio_copa)}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs text-zinc-500">Rango de edad</p>
              <p className="mt-1 font-medium">{edad ?? "Todas"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Vestimenta</p>
              <p className="mt-1 font-medium capitalize">
                {venue.vestimenta ?? "Casual"}
              </p>
            </div>
          </div>

          {precioMedioEstimado !== null && !tienePrecioMedioPersona && (
            <p className="mt-4 text-xs text-zinc-500">
              Precio medio estimado: ~{precioMedioEstimado}€ (sin confirmar por
              el local)
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-lime-400 py-3 text-center text-sm font-bold text-black transition hover:bg-lime-300"
              >
                Cómo llegar 📍
              </a>
            )}
            {venue.instagram && (
              <a
                href={venue.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white/[0.05] py-3 text-center text-sm font-medium transition hover:bg-white hover:text-black"
              >
                Instagram →
              </a>
            )}
            {venue.web && (
              <a
                href={venue.web}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 py-3 text-center text-sm font-medium transition hover:bg-white hover:text-black"
              >
                Web oficial →
              </a>
            )}
          </div>
        </aside>
      </div>

      <Footer />
    </main>
  );
}
