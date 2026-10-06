import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventoById, getVenueById } from "@/lib/venues";
import {
  TIPO_GRADIENTE,
  edadLabel,
  formatFecha,
  formatHora,
  formatPrecio,
  madridNow,
  num,
  tipoInfo,
  tiposPrincipales,
  venueFoto,
} from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function EventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const evento = await getEventoById(id);

  if (!evento) {
    notFound();
  }

  // Ficha completa del local (foto, géneros, edad, redes...) y sus otros eventos
  const venue = evento.venues ? await getVenueById(evento.venues.id) : null;

  const precio = num(evento.precio_desde);
  const direccion = venue?.direccion ?? evento.venues?.direccion ?? null;
  const ciudad = venue?.cities?.nombre ?? evento.venues?.cities?.nombre ?? "";

  const mapsUrl = direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${direccion}, ${ciudad}`
      )}`
    : null;

  // La edad y la vestimenta del evento mandan; si no hay, las del local
  const edad = edadLabel(evento.rango_edad ?? venue?.rango_edad);
  const vestimenta = evento.vestimenta ?? venue?.vestimenta ?? null;
  const generos = (venue?.venue_genres ?? [])
    .map((vg) => vg.genres?.nombre)
    .filter(Boolean) as string[];

  const tipos = venue ? tiposPrincipales(venue) : [];
  const fotoLocal = venue ? venueFoto(venue) : null;

  const pmin = num(venue?.precio_persona_min);
  const pmax = num(venue?.precio_persona_max);

  const hoy = madridNow().fecha;
  const otros = (venue?.events ?? [])
    .filter(
      (e) =>
        e.id !== evento.id &&
        e.fecha_inicio &&
        e.fecha_inicio.slice(0, 10) >= hoy
    )
    .sort((a, b) => (a.fecha_inicio! < b.fecha_inicio! ? -1 : 1))
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Header />

      <div className="mx-auto max-w-5xl px-5 py-10">
        <Link
          href={venue ? `/local/${venue.id}` : "/"}
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← {venue ? venue.nombre : "Volver"}
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_1.3fr]">
          {/* FLYER */}
          <div className="h-fit overflow-hidden rounded-3xl border border-white/5 bg-zinc-900">
            {evento.foto_url ? (
              <img
                src={evento.foto_url}
                alt={evento.nombre ?? "Evento"}
                className="aspect-[4/5] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-fuchsia-600/40 via-violet-900/40 to-zinc-900">
                <span className="text-7xl opacity-40">🎉</span>
              </div>
            )}
          </div>

          {/* INFO DEL EVENTO */}
          <div>
            <p className="text-sm font-medium capitalize text-lime-400">
              {formatFecha(evento.fecha_inicio)} ·{" "}
              {formatHora(evento.fecha_inicio)}
              {evento.fecha_fin ? ` - ${formatHora(evento.fecha_fin)}` : ""}
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              {evento.nombre ?? venue?.nombre ?? "Evento"}
            </h1>

            {evento.fiestas && (
              <Link
                href={`/fiesta/${evento.fiestas.id}`}
                className="mt-2 inline-block text-sm text-zinc-400 underline decoration-dotted transition hover:text-lime-400"
              >
                {evento.fiestas.nombre}
              </Link>
            )}

            {venue && (
              <Link
                href={`/local/${venue.id}`}
                className="mt-1 block w-fit text-zinc-300 transition hover:text-white"
              >
                📍 {venue.nombre}
                {venue.zones?.nombre ? ` · ${venue.zones.nombre}` : ""}
                {ciudad ? `, ${ciudad}` : ""}
              </Link>
            )}

            {(edad || vestimenta || generos.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {edad && (
                  <span className="rounded-full bg-white/[0.08] px-3 py-1 text-sm font-medium">
                    {edad}
                  </span>
                )}
                {vestimenta && (
                  <span className="rounded-full bg-white/[0.08] px-3 py-1 text-sm font-medium capitalize">
                    👕 {vestimenta}
                  </span>
                )}
                {generos.map((g) => (
                  <Link
                    key={g}
                    href={`/buscar?genero=${encodeURIComponent(g)}`}
                    className="rounded-full bg-white/[0.05] px-3 py-1 text-sm text-zinc-300 transition hover:bg-lime-400 hover:text-black"
                  >
                    🎵 {g}
                  </Link>
                ))}
              </div>
            )}

            {evento.descripcion && (
              <p className="mt-5 leading-relaxed text-zinc-400">
                {evento.descripcion}
              </p>
            )}

            <div className="mt-6">
              <p className="text-xs text-zinc-500">Precio</p>
              <p className="text-xl font-bold">
                {precio === null
                  ? "Consultar"
                  : precio === 0
                  ? "Gratis"
                  : `Desde ${formatPrecio(precio)}`}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {evento.entrada_url && (
                <a
                  href={evento.entrada_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-lime-400 px-6 py-3 text-center text-sm font-bold text-black transition hover:bg-lime-300"
                >
                  Comprar entrada →
                </a>
              )}
              {mapsUrl && (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm font-medium transition hover:bg-white hover:text-black"
                >
                  Cómo llegar 📍
                </a>
              )}
            </div>

            {!evento.entrada_url && (
              <p className="mt-4 text-xs text-zinc-600">
                Todavía no tenemos el enlace de venta de entradas para esta
                fecha en concreto.
              </p>
            )}
          </div>
        </div>

        {/* EL LOCAL */}
        {venue && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">El local</h2>
            <div className="mt-4 flex flex-col overflow-hidden rounded-3xl border border-white/5 bg-zinc-900 sm:flex-row">
              <div className="h-44 w-full flex-none sm:h-auto sm:w-64">
                {fotoLocal ? (
                  <img
                    src={fotoLocal}
                    alt={venue.nombre}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
                      TIPO_GRADIENTE[tipos[0] ?? ""] ?? TIPO_GRADIENTE.discoteca
                    }`}
                  >
                    <span className="text-5xl opacity-40">
                      {tipoInfo(tipos[0])?.icon ?? "🪩"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  {tipos.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-lime-400 px-2.5 py-0.5 text-xs font-bold capitalize text-black"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/local/${venue.id}`}
                  className="mt-2 text-2xl font-black tracking-tight transition hover:text-lime-400"
                >
                  {venue.nombre}
                </Link>

                <p className="mt-1 text-sm text-zinc-400">
                  📍 {direccion ? `${direccion} · ` : ""}
                  {venue.zones?.nombre ?? "Sin zona"}
                  {ciudad ? `, ${ciudad}` : ""}
                </p>

                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-xs text-zinc-500">Entrada habitual</dt>
                    <dd className="font-semibold">
                      {formatPrecio(venue.precio_entrada)}
                    </dd>
                  </div>
                  {pmin !== null && pmax !== null && (
                    <div>
                      <dt className="text-xs text-zinc-500">
                        Medio por persona
                      </dt>
                      <dd className="font-semibold">
                        €{pmin}-{pmax}
                      </dd>
                    </div>
                  )}
                  {edadLabel(venue.rango_edad) && (
                    <div>
                      <dt className="text-xs text-zinc-500">Edad</dt>
                      <dd className="font-semibold">
                        {edadLabel(venue.rango_edad)}
                      </dd>
                    </div>
                  )}
                  {venue.vestimenta && (
                    <div>
                      <dt className="text-xs text-zinc-500">Vestimenta</dt>
                      <dd className="font-semibold capitalize">
                        {venue.vestimenta}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`/local/${venue.id}`}
                    className="rounded-xl bg-white/[0.08] px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
                  >
                    Ver el local →
                  </Link>
                  {venue.instagram && (
                    <a
                      href={venue.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white hover:text-black"
                    >
                      Instagram
                    </a>
                  )}
                  {venue.web && (
                    <a
                      href={venue.web}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm transition hover:bg-white hover:text-black"
                    >
                      Web
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MÁS EVENTOS EN EL LOCAL */}
        {venue && otros.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold">Más eventos en {venue.nombre}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {otros.map((e) => {
                const p = num(e.precio_desde);
                return (
                  <Link
                    key={e.id}
                    href={`/evento/${e.id}`}
                    className="group flex overflow-hidden rounded-2xl border border-white/5 bg-zinc-900 transition hover:border-lime-400/30"
                  >
                    {e.foto_url && (
                      <img
                        src={e.foto_url}
                        alt=""
                        loading="lazy"
                        className="w-20 flex-none object-cover"
                      />
                    )}
                    <div className="min-w-0 p-3">
                      <p className="text-xs font-medium capitalize text-lime-400">
                        {formatFecha(e.fecha_inicio, true)} ·{" "}
                        {formatHora(e.fecha_inicio)}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-sm font-semibold">
                        {e.nombre ?? venue.nombre}
                      </p>
                      {p !== null && (
                        <p className="mt-1 text-xs text-zinc-400">
                          {p === 0 ? "Gratis" : `Desde ${formatPrecio(p)}`}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
