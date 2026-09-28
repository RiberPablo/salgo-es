import Link from "next/link";
import { notFound } from "next/navigation";
import { getVenuesByTipo } from "@/lib/venues";
import { CATEGORIAS, nocheActual, venueFoto } from "@/lib/utils";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { VenueCard } from "@/components/VenueCard";

export const dynamic = "force-dynamic";

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo: slug } = await params;
  const categoria = CATEGORIAS.find((c) => c.slug === slug);

  if (!categoria) {
    notFound();
  }

  const encontrados = await getVenuesByTipo(categoria.tipo);
  const noche = nocheActual();

  // Con foto primero; dentro de cada grupo, orden alfabético (ya viene así)
  const venues = [
    ...encontrados.filter((v) => venueFoto(v)),
    ...encontrados.filter((v) => !venueFoto(v)),
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <Header />

      <section className="relative overflow-hidden px-5 pb-6 pt-12">
        <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_20%_0%,rgba(163,230,53,0.10),transparent_45%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-lime-400">CATEGORÍA</p>
            <h1 className="mt-1 flex items-center gap-3 text-4xl font-black tracking-tight md:text-6xl">
              <span>{categoria.icon}</span>
              {categoria.nombre}
            </h1>
            <p className="mt-3 text-zinc-500">
              {venues.length > 0
                ? `${venues.length} ${venues.length === 1 ? "sitio" : "sitios"}`
                : "Todavía no hay locales en esta categoría."}
            </p>
          </div>

          <Link
            href={`/buscar?tipo=${categoria.tipo}`}
            className="w-fit rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white hover:text-black"
          >
            ⚙️ Filtrar {categoria.nombre.toLowerCase()} →
          </Link>
        </div>
      </section>

      <section className="px-5 pb-16 pt-6">
        <div className="mx-auto max-w-7xl">
          {venues.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 p-16 text-center text-zinc-500">
              Estamos añadiendo locales a esta categoría. ¡Vuelve pronto!
              <br />
              <Link
                href="/"
                className="mt-4 inline-block text-lime-400 hover:underline"
              >
                ← Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {venues.map((v) => (
                <VenueCard key={v.id} venue={v} noche={noche} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
