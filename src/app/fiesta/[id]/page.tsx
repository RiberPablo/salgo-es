import Link from "next/link";
import { notFound } from "next/navigation";
import { getFiestaById } from "@/lib/venues";
import { formatFecha, formatHora, formatPrecio, madridNow, num } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function FiestaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fiesta = await getFiestaById(id);

  if (!fiesta) {
    notFound();
  }

  const hoy = madridNow().fecha;
  const proximas = fiesta.fechas.filter(
    (f) => f.fecha_inicio && f.fecha_inicio.slice(0, 10) >= hoy
  );
  const pasadas = fiesta.fechas.filter(
    (f) => f.fecha_inicio && f.fecha_inicio.slice(0, 10) < hoy
  );

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Header />

      {/* CABECERA */}
      <section className="relative overflow-hidden px-5 pb-10 pt-12">
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_20%_0%,rgba(217,70,239,0.14),transparent_45%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-5 sm:flex-row sm:items-center">
          {fiesta.logo_url ? (
            <img
              src={fiesta.logo_url}
              alt={fiesta.nombre}
              className="h-24 w-24 flex-none rounded-3xl border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 flex-none items-center justify-center rounded-3xl border border-white/10 bg-zinc-900 text-4xl">
              🎉
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-lime-400">FIESTA</p>
            <h1 className="mt-1 text-4xl font-black tracking-tight md:text-5xl">
              {fiesta.nombre}
            </h1>
            {fiesta.descripcion && (
              <p className="mt-3 max-w-2xl text-zinc-400">
                {fiesta.descripcion}
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {fiesta.instagram && (
                <a
                  href={fiesta.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-white/[0.06] px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
                >
                  Instagram →
                </a>
              )}
              {fiesta.web && (
                <a
                  href={fiesta.web}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
                >
                  Web →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PROXIMAS FECHAS */}
      <section className="px-5 pb-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold">
            {proximas.length > 0
              ? "Próximas fechas"
              : "No hay fechas confirmadas todavía"}
          </h2>

          {proximas.length > 0 && (
            <div className="mt-4 flex flex-col gap-4">
              {proximas.map((f) => {
                const precio = num(f.precio_desde);
                return (
                  <div
                    key={f.id}
                    className="flex overflow-hidden rounded-2xl border border-white/5 bg-zinc-900"
                  >
                    {f.foto_url && (
                      <img
                        src={f.foto_url}
                        alt={f.nombre ?? fiesta.nombre}
                        loading="lazy"
                        className="w-28 flex-none object-cover sm:w-40"
                      />
                    )}

                    <div className="flex flex-1 flex-col justify-center p-4">
                      <p className="text-xs font-medium capitalize text-lime-400">
                        {formatFecha(f.fecha_inicio)} · {formatHora(f.fecha_inicio)}
                        {f.fecha_fin ? ` - ${formatHora(f.fecha_fin)}` : ""}
                      </p>

                      <h3 className="mt-1 font-bold">{f.nombre ?? fiesta.nombre}</h3>

                      {f.venues && (
                        <Link
                          href={`/local/${f.venues.id}`}
                          className="mt-1 w-fit text-sm text-zinc-400 transition hover:text-white"
                        >
                          📍 {f.venues.nombre}
                          {f.venues.zones ? ` · ${f.venues.zones.nombre}` : ""}
                        </Link>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {precio !== null && (
                          <span className="text-sm font-semibold">
                            {precio === 0 ? "Gratis" : `Desde ${formatPrecio(precio)}`}
                          </span>
                        )}
                        {f.entrada_url && (
                          <a
                            href={f.entrada_url}
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
          )}
        </div>
      </section>

      {/* FECHAS PASADAS (referencia rápida, sin destacar) */}
      {pasadas.length > 0 && (
        <section className="px-5 pb-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-sm font-medium text-zinc-500">
              Fechas anteriores
            </h2>
            <div className="mt-3 divide-y divide-white/5 rounded-2xl border border-white/5">
              {pasadas.map((f) => (
                <div
                  key={f.id}
                  className="flex justify-between px-4 py-3 text-sm text-zinc-500"
                >
                  <span className="capitalize">{formatFecha(f.fecha_inicio)}</span>
                  <span>{f.venues?.nombre ?? ""}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
