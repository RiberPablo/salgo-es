import Link from "next/link";
import type { Venue } from "@/lib/venues";
import {
  TIPO_GRADIENTE,
  abreHoy,
  edadLabel,
  formatPrecio,
  nocheActual,
  tardeoHoy,
  num,
  tipoInfo,
  tiposPrincipales,
  venueFoto,
} from "@/lib/utils";

export function VenueCard({
  venue,
  noche,
}: {
  venue: Venue;
  noche?: { dia: number; fecha: string };
}) {
  const foto = venueFoto(venue);
  const tipos = tiposPrincipales(venue);
  const principal = tipoInfo(tipos[0]);
  const generos = (venue.venue_genres ?? [])
    .map((vg) => vg.genres?.nombre)
    .filter(Boolean) as string[];

  const hoy = noche ?? nocheActual();
  const abre = abreHoy(venue, hoy);
  const tardeo = tardeoHoy(venue, hoy);
  const edad = edadLabel(venue.rango_edad);
  const gratis = num(venue.precio_entrada) === 0;

  const pmin = num(venue.precio_persona_min);
  const pmax = num(venue.precio_persona_max);
  const segundo =
    pmin !== null && pmax !== null
      ? { label: "Medio/persona", value: `€${pmin}-${pmax}` }
      : { label: "Copa", value: formatPrecio(venue.precio_copa) };

  return (
    <Link
      href={`/local/${venue.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-lime-400/30"
    >
      {/* IMAGEN */}
      <div className="relative h-56 overflow-hidden bg-zinc-800">
        {foto ? (
          <img
            src={foto}
            alt={venue.nombre}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
              TIPO_GRADIENTE[tipos[0] ?? ""] ?? TIPO_GRADIENTE.discoteca
            }`}
          >
            <span className="text-6xl opacity-40 transition duration-500 group-hover:scale-110">
              {principal?.icon ?? "🪩"}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
          {tipos.map((t) => (
            <span
              key={t}
              className="rounded-full bg-black/55 px-3 py-1 text-xs font-medium capitalize text-white backdrop-blur"
            >
              {t}
            </span>
          ))}
        </div>

        {abre && (
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-lime-400 px-3 py-1 text-xs font-bold text-black">
            <span className="h-1.5 w-1.5 rounded-full bg-black" />
            {tardeo ? "Tardeo hoy" : "Abre hoy"}
          </span>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-sm text-zinc-200">
            📍 {venue.zones?.nombre ?? venue.cities?.nombre ?? "Sin zona"}
            {venue.zones?.nombre && venue.cities?.nombre
              ? ` · ${venue.cities.nombre}`
              : ""}
          </p>
        </div>
      </div>

      {/* INFORMACIÓN */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-tight">{venue.nombre}</h3>

        {(gratis || edad) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {gratis && (
              <span className="rounded-full bg-lime-400/15 px-2.5 py-1 text-xs font-semibold text-lime-300">
                Entrada gratis
              </span>
            )}
            {edad && (
              <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-zinc-300">
                {edad}
              </span>
            )}
          </div>
        )}

        {generos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {generos.slice(0, 3).map((g) => (
              <span
                key={g}
                className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-400"
              >
                🎵 {g}
              </span>
            ))}
            {generos.length > 3 && (
              <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-500">
                +{generos.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between border-t border-white/5 pt-4 text-sm">
          <div className="flex gap-5">
            <div>
              <p className="text-xs text-zinc-500">Entrada</p>
              <p className="font-semibold text-white">
                {formatPrecio(venue.precio_entrada)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">{segundo.label}</p>
              <p className="font-semibold text-white">{segundo.value}</p>
            </div>
          </div>

          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/[0.06] text-zinc-400 transition group-hover:bg-lime-400 group-hover:text-black">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
