import Link from "next/link";
import type { Venue } from "@/lib/venues";
import {
  TIPO_GRADIENTE,
  abreHoy,
  edadLabel,
  etiquetaFechaCorta,
  eventosDeFecha,
  formatHora,
  formatPrecio,
  horarioDelDia,
  nocheActual,
  num,
  tardeoHoy,
  tipoInfo,
  tiposPrincipales,
  venueFoto,
} from "@/lib/utils";

const MAX_EVENTOS = 2;

export function VenueCard({
  venue,
  noche,
  soloTardeo = false,
}: {
  venue: Venue;
  // Día que se está mirando (por defecto, esta noche)
  noche?: { dia: number; fecha: string };
  // Mirando tardeos: solo enseña lo que pasa por la tarde
  soloTardeo?: boolean;
}) {
  const foto = venueFoto(venue);
  const tipos = tiposPrincipales(venue);
  const principal = tipoInfo(tipos[0]);
  const generos = (venue.venue_genres ?? [])
    .map((vg) => vg.genres?.nombre)
    .filter(Boolean) as string[];

  const hoy = nocheActual();
  const dia = noche ?? hoy;
  const etiquetaDia = etiquetaFechaCorta(dia.fecha).toLowerCase();

  const abre = abreHoy(venue, dia);
  const tardeo = tardeoHoy(venue, dia);
  const eventos = eventosDeFecha(venue, dia.fecha, soloTardeo);
  const horario = horarioDelDia(venue, dia.dia, soloTardeo);

  const edad = edadLabel(venue.rango_edad);
  const gratis = num(venue.precio_entrada) === 0;

  const pmin = num(venue.precio_persona_min);
  const pmax = num(venue.precio_persona_max);
  const segundo =
    pmin !== null && pmax !== null
      ? { label: "Medio/persona", value: `€${pmin}-${pmax}` }
      : { label: "Copa", value: formatPrecio(venue.precio_copa) };

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-lime-400/30">
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
            {tardeo ? "Tardeo" : "Abre"} {etiquetaDia}
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

        {/* QUÉ PASA ESE DÍA: el evento, o el horario habitual */}
        {eventos.length > 0 ? (
          <div className="mt-4">
            <p className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-lime-400">
              <span className="h-px w-5 bg-lime-400/60" />
              {eventos.length > 1 ? `${eventos.length} eventos` : "Evento"} ·{" "}
              {etiquetaDia}
            </p>

            <div className="-mx-2 flex flex-col">
              {eventos.slice(0, MAX_EVENTOS).map((e) => {
                const precio = num(e.precio_desde);
                return (
                  <Link
                    key={e.id}
                    href={`/evento/${e.id}`}
                    className="group/ev relative z-20 flex items-center gap-3.5 rounded-2xl p-2 transition duration-200 hover:bg-white/[0.05]"
                  >
                    {e.foto_url ? (
                      <img
                        src={e.foto_url}
                        alt=""
                        loading="lazy"
                        className="h-[76px] w-[60px] flex-none rounded-xl object-cover shadow-lg shadow-black/50 ring-1 ring-white/10 transition duration-300 group-hover/ev:scale-[1.04]"
                      />
                    ) : (
                      <span className="flex h-[76px] w-[60px] flex-none items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-600/30 to-violet-900/30 text-xl ring-1 ring-white/10">
                        🎉
                      </span>
                    )}

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-xs font-bold tabular-nums text-lime-300">
                          {formatHora(e.fecha_inicio)}
                        </span>
                        {precio !== null &&
                          (precio === 0 ? (
                            <span className="rounded-full bg-lime-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                              Gratis
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-400">
                              Desde {formatPrecio(precio)}
                            </span>
                          ))}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[15px] font-bold leading-snug">
                        {e.nombre}
                      </span>
                      {e.fiestas?.nombre && e.fiestas.nombre !== e.nombre && (
                        <span className="mt-0.5 block truncate text-xs text-zinc-500">
                          {e.fiestas.nombre}
                        </span>
                      )}
                    </span>

                    <span className="flex-none text-lg text-zinc-600 transition group-hover/ev:translate-x-0.5 group-hover/ev:text-lime-400">
                      ›
                    </span>
                  </Link>
                );
              })}
            </div>

            {eventos.length > MAX_EVENTOS && (
              <p className="mt-1 text-xs text-zinc-500">
                +{eventos.length - MAX_EVENTOS} más ese día
              </p>
            )}
          </div>
        ) : (
          horario && (
            <p className="mt-3 text-sm text-zinc-400">
              🕒 {horario}
              <span className="text-zinc-600"> · sin evento publicado</span>
            </p>
          )
        )}

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

      {/* Toda la tarjeta lleva a la ficha del local; los eventos (z-20) llevan al evento */}
      <Link
        href={`/local/${venue.id}`}
        aria-label={`Ver ${venue.nombre}`}
        className="absolute inset-0 z-10"
      />
    </article>
  );
}
