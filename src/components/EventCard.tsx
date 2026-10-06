import Link from "next/link";
import type { EventoConLocal } from "@/lib/venues";
import {
  EVENTO_CATEGORIAS,
  formatFecha,
  formatHora,
  formatPrecio,
  num,
} from "@/lib/utils";

export function EventCard({ evento }: { evento: EventoConLocal }) {
  const precio = num(evento.precio_desde);
  const categoria = evento.categoria ?? "fiesta";
  const infoCategoria = EVENTO_CATEGORIAS[categoria];

  // Dónde es: la fiesta, el local, o el sitio suelto (ej. "Plaza de España")
  const donde =
    evento.fiestas?.nombre ?? evento.venues?.nombre ?? evento.lugar ?? null;

  return (
    <Link
      href={`/evento/${evento.id}`}
      className="group block overflow-hidden rounded-3xl border border-white/5 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-lime-400/30"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-800">
        {evento.foto_url ? (
          <img
            src={evento.foto_url}
            alt={evento.nombre ?? "Evento"}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-fuchsia-600/40 via-violet-900/40 to-zinc-900">
            <span className="text-6xl opacity-40">
              {infoCategoria?.icon ?? "🎉"}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-lime-400 px-3 py-1 text-xs font-bold capitalize text-black">
          {formatFecha(evento.fecha_inicio, true)}
        </span>

        {categoria !== "fiesta" && infoCategoria && (
          <span className="absolute bottom-3 left-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {infoCategoria.icon} {infoCategoria.nombre}
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-lime-400">
          {formatHora(evento.fecha_inicio)}
          {evento.fecha_fin ? ` - ${formatHora(evento.fecha_fin)}` : ""}
        </p>
        <h3 className="mt-1 font-bold leading-tight">
          {evento.nombre ?? evento.venues?.nombre ?? "Evento"}
        </h3>
        {/* Toda la tarjeta ya es un enlace: aquí solo texto */}
        {donde && <p className="mt-1 text-sm text-zinc-500">{donde}</p>}
        {precio !== null && (
          <p className="mt-3 text-sm font-semibold">
            {precio === 0 ? "Gratis" : `Desde ${formatPrecio(precio)}`}
          </p>
        )}
      </div>
    </Link>
  );
}
