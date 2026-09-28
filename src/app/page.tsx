import Link from "next/link";
import { getUpcomingEvents, getVenues } from "@/lib/venues";
import {
  CATEGORIAS,
  DIAS,
  abreHoy,
  nocheActual,
  venueFoto,
  venueTipos,
} from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchBar } from "@/components/SearchBar";
import { VenueCard } from "@/components/VenueCard";
import { EventCard } from "@/components/EventCard";

// "Abre hoy" y los eventos dependen del día: la página no se puede cachear
export const dynamic = "force-dynamic";

const CHIPS = [
  { label: "🌙 Esta noche", href: "/buscar?cuando=hoy" },
  { label: "🆓 Entrada gratis", href: "/buscar?precio=gratis" },
  { label: "🎵 Música latina", href: "/buscar?genero=M%C3%BAsica%20Latina" },
  { label: "🔥 Reggaetón", href: "/buscar?genero=Reggaet%C3%B3n" },
  { label: "🌍 Afro House", href: "/buscar?genero=Afro%20House" },
  { label: "🎉 Comercial", href: "/buscar?genero=Comercial" },
];

// Posiciones del collage de fotos del hero (solo escritorio)
const COLLAGE = [
  "left-0 top-8 h-72 w-52 -rotate-6",
  "left-44 top-0 z-10 h-80 w-56 rotate-3",
  "left-20 top-64 h-64 w-52 rotate-6",
];

const SCROLLER =
  "flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export default async function Home() {
  const [venues, eventos] = await Promise.all([
    getVenues(),
    getUpcomingEvents(),
  ]);

  const noche = nocheActual();

  const categorias = CATEGORIAS.map((c) => ({
    ...c,
    count: venues.filter((v) => venueTipos(v).includes(c.tipo)).length,
  }));

  const ciudades = new Set(
    venues.map((v) => v.cities?.nombre).filter(Boolean) as string[]
  );

  const estaNoche = venues.filter((v) => abreHoy(v, noche)).slice(0, 12);

  // Los que tienen foto primero: son los que mejor entran por los ojos
  const conFoto = venues.filter((v) => venueFoto(v));
  const sinFoto = venues.filter((v) => !venueFoto(v));
  const destacados = [...conFoto, ...sinFoto].slice(0, 8);
  const fotosHero = conFoto.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-10 pt-12 md:pb-16 md:pt-20">
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_15%_10%,rgba(163,230,53,0.12),transparent_40%),radial-gradient(circle_at_85%_5%,rgba(217,70,239,0.14),transparent_40%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 animate-pulse rounded-full bg-lime-400/5 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-sm text-lime-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
                Descubre dónde salir
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-8xl">
                Tu próximo plan
                <br />
                empieza <span className="text-lime-400">aquí.</span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">
                Encuentra discotecas, pubs, tardeos y bares. Filtra por zona,
                música, edad, precio o el día que quieres salir.
              </p>

              <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <div>
                  <p className="text-2xl font-black text-white">
                    {venues.length}
                  </p>
                  <p className="text-zinc-500">locales</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-white">
                    {ciudades.size}
                  </p>
                  <p className="text-zinc-500">
                    {ciudades.size === 1 ? "ciudad" : "ciudades"}
                  </p>
                </div>
                {eventos.length > 0 && (
                  <div>
                    <p className="text-2xl font-black text-lime-400">
                      {eventos.length}
                    </p>
                    <p className="text-zinc-500">
                      {eventos.length === 1
                        ? "evento próximo"
                        : "eventos próximos"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {fotosHero.length >= 2 && (
              <div className="relative hidden h-[520px] lg:block">
                {fotosHero.map((v, i) => (
                  <Link
                    key={v.id}
                    href={`/local/${v.id}`}
                    className={`absolute overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition duration-500 hover:z-20 hover:scale-105 ${COLLAGE[i]}`}
                  >
                    <img
                      src={venueFoto(v) ?? ""}
                      alt={v.nombre}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 right-3 text-sm font-bold">
                      {v.nombre}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <SearchBar />

          <div className="mt-5 flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 transition hover:border-lime-400/40 hover:text-white"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ESTA NOCHE */}
      {estaNoche.length > 0 && (
        <section className="px-5 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-lime-400">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
                  ESTA NOCHE · {DIAS[noche.dia].toUpperCase()}
                </div>
                <h2 className="mt-2 text-3xl font-bold">Abren hoy</h2>
              </div>
              <Link
                href="/buscar?cuando=hoy"
                className="w-fit flex-none rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white hover:text-black"
              >
                Ver todos →
              </Link>
            </div>

            <div className={SCROLLER}>
              {estaNoche.map((v) => (
                <div key={v.id} className="w-72 flex-none snap-start">
                  <VenueCard venue={v} noche={noche} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRÓXIMOS EVENTOS */}
      {eventos.length > 0 && (
        <section className="px-5 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-lime-400">AGENDA</p>
                <h2 className="mt-1 text-3xl font-bold">Próximos eventos</h2>
                <p className="mt-2 text-zinc-500">
                  Fechas concretas, cada una con su temática.
                </p>
              </div>
              <Link
                href="/eventos"
                className="w-fit flex-none rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white hover:text-black"
              >
                Ver todos →
              </Link>
            </div>

            <div className={SCROLLER}>
              {eventos.slice(0, 10).map((e) => (
                <div key={e.id} className="w-60 flex-none snap-start">
                  <EventCard evento={e} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORÍAS */}
      <section className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <p className="text-sm font-medium text-lime-400">EXPLORA</p>
            <h2 className="mt-1 text-3xl font-bold">¿Qué te apetece hoy?</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categorias.map((c) => (
              <Link
                key={c.slug}
                href={`/categoria/${c.slug}`}
                className="group rounded-3xl border border-white/5 bg-zinc-900 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-lime-400/40 hover:bg-zinc-800"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-2xl transition group-hover:bg-lime-400">
                  {c.icon}
                </div>
                <h3 className="mt-8 text-lg font-bold">{c.nombre}</h3>
                <p className="mt-1 text-sm text-zinc-500">
                  {c.count} {c.count === 1 ? "sitio" : "sitios"}
                </p>
                <div className="mt-5 text-lime-400">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section className="px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-lime-400">
                <span className="h-2 w-2 rounded-full bg-lime-400" />
                DESTACADOS
              </div>
              <h2 className="mt-2 text-3xl font-bold">Sitios para salir</h2>
              <p className="mt-2 text-zinc-500">
                Descubre locales y planes en tu zona.
              </p>
            </div>

            <Link
              href="/buscar"
              className="w-fit rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white hover:text-black"
            >
              Ver todos y filtrar →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destacados.map((v) => (
              <VenueCard key={v.id} venue={v} noche={noche} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-900 px-6 py-12 md:px-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lime-400/10 blur-[100px]" />
          <div className="relative max-w-2xl">
            <p className="text-sm font-medium text-lime-400">
              ¿NO SABES DÓNDE IR?
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Dinos cómo eres y te decimos dónde.
            </h2>
            <p className="mt-5 text-zinc-400">
              Filtra por tu edad, tu presupuesto, la música que te gusta y el
              día que sales. Sin dar mil vueltas.
            </p>
            <Link
              href="/buscar"
              className="mt-7 inline-block rounded-xl bg-lime-400 px-6 py-3 font-bold text-black transition hover:bg-lime-300"
            >
              Buscar mi plan →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
