import Link from "next/link";
import type { EventoConLocal } from "@/lib/venues";
import { formatFecha, formatHora, formatPrecio, num } from "@/lib/utils";

export function EventCard({ evento }: { evento: EventoConLocal }) {
  const precio = num(evento.precio_desde);
  const destino = evento.venues ? `/local/${evento.venues.id}` : "/buscar";

  return (
    <Link
      href={destino}
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
            <span className="text-6xl opacity-40">🎉</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-lime-400 px-3 py-1 text-xs font-bold capitalize text-black">
          {formatFecha(evento.fecha_inicio, true)}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-lime-400">
          {formatHora(evento.fecha_inicio)}
          {evento.fecha_fin ? ` - ${formatHora(evento.fecha_fin)}` : ""}
        </p>
        <h3 className="mt-1 font-bold leading-tight">
          {evento.nombre ?? evento.venues?.nombre ?? "Evento"}
        </h3>
        {evento.venues && (
          <p className="mt-1 text-sm text-zinc-500">{evento.venues.nombre}</p>
        )}
        {precio !== null && (
          <p className="mt-3 text-sm font-semibold">
            {precio === 0 ? "Gratis" : `Desde ${formatPrecio(precio)}`}
          </p>
        )}
      </div>
    </Link>
  );
}
