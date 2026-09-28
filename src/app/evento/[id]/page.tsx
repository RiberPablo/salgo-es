import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventoById } from "@/lib/venues";
import { formatFecha, formatHora, formatPrecio, num } from "@/lib/utils";
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

  const precio = num(evento.precio_desde);
  const venue = evento.venues;

  const mapsUrl = venue?.direccion
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${venue.direccion}, ${venue.cities?.nombre ?? ""}`
      )}`
    : null;

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Header />

      <div className="mx-auto max-w-4xl px-5 py-10">
        <Link
          href={venue ? `/local/${venue.id}` : "/"}
          className="text-sm text-zinc-500 transition hover:text-white"
        >
          ← {venue ? venue.nombre : "Volver"}
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-[1fr_1.3fr]">
          {/* FLYER */}
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-zinc-900">
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

          {/* INFO */}
          <div>
            <p className="text-sm font-medium capitalize text-lime-400">
              {formatFecha(evento.fecha_inicio)} · {formatHora(evento.fecha_inicio)}
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
                {venue.cities?.nombre ? `, ${venue.cities.nombre}` : ""}
              </Link>
            )}

            {evento.descripcion && (
              <p className="mt-5 leading-relaxed text-zinc-400">
                {evento.descripcion}
              </p>
            )}

            <div className="mt-6 flex items-center gap-4">
              <div>
                <p className="text-xs text-zinc-500">Precio</p>
                <p className="text-xl font-bold">
                  {precio === null
                    ? "Consultar"
                    : precio === 0
                    ? "Gratis"
                    : `Desde ${formatPrecio(precio)}`}
                </p>
              </div>
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
      </div>

      <Footer />
    </main>
  );
}
