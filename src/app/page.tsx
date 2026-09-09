export default function Home() {
  const categories = [
    { icon: "🪩", name: "Discotecas", count: "42 sitios" },
    { icon: "🍸", name: "Pubs", count: "28 sitios" },
    { icon: "🍹", name: "Tardeos", count: "19 sitios" },
    { icon: "🍺", name: "Bares", count: "64 sitios" },
  ];

  const venues = [
    {
      name: "Sala Example",
      city: "Madrid",
      zone: "Centro",
      type: "Discoteca",
      genres: ["Reggaeton", "Comercial"],
      entry: "15€",
      drink: "8€",
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "The Night Club",
      city: "Madrid",
      zone: "Malasaña",
      type: "Pub",
      genres: ["House", "Electrónica"],
      entry: "Gratis",
      drink: "9€",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Tardeo Example",
      city: "Toledo",
      zone: "Casco histórico",
      type: "Tardeo",
      genres: ["Pop", "Latin"],
      entry: "10€",
      drink: "7€",
      image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Urban Room",
      city: "Illescas",
      zone: "Centro",
      type: "Bar",
      genres: ["Urban", "Hip Hop"],
      entry: "Gratis",
      drink: "6€",
      image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-lg font-black text-black">
              S
            </div>

            <span className="text-xl font-black tracking-tight">
              salgo<span className="text-lime-400">.es</span>
            </span>
          </div>

          <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
            <a href="#" className="text-white">
              Explorar
            </a>
            <a href="#" className="transition hover:text-white">
              Discotecas
            </a>
            <a href="#" className="transition hover:text-white">
              Tardeos
            </a>
            <a href="#" className="transition hover:text-white">
              Pubs
            </a>
          </nav>

          <button className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white hover:text-black">
            Entrar
          </button>
        </div>
      </header>


      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-10 pt-12 md:pb-16 md:pt-20">
        
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-lime-400/5 blur-[140px]" />

        <div className="relative mx-auto max-w-7xl">
          
          <div className="max-w-3xl">
            
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-sm text-lime-300">
              <span className="h-2 w-2 rounded-full bg-lime-400" />
              Descubre dónde salir
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-8xl">
              Tu próximo plan
              <br />
              empieza <span className="text-lime-400">aquí.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg">
              Encuentra discotecas, pubs, tardeos y bares cerca de ti.
              Filtra por zona, tipo de local o música y descubre dónde salir.
            </p>
          </div>


          {/* BUSCADOR */}
          <div className="mt-10 max-w-5xl rounded-3xl border border-white/10 bg-zinc-900/70 p-3 shadow-2xl backdrop-blur">
            
            <div className="grid gap-2 md:grid-cols-[1.5fr_1fr_1fr_auto]">

              <div className="flex items-center gap-3 rounded-2xl bg-white/[0.04] px-5 py-4">
                <span className="text-xl">🔎</span>

                <div className="flex flex-1 flex-col">
                  <span className="text-xs text-zinc-500">
                    Buscar
                  </span>

                  <input
                    type="text"
                    placeholder="Local, ciudad o zona"
                    className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-zinc-600"
                  />
                </div>
              </div>


              <button className="flex items-center gap-3 rounded-2xl px-5 py-4 text-left transition hover:bg-white/[0.04]">
                <span className="text-xl">📍</span>

                <div>
                  <p className="text-xs text-zinc-500">
                    Ubicación
                  </p>

                  <p className="text-sm font-medium">
                    Cerca de mí
                  </p>
                </div>
              </button>


              <button className="flex items-center gap-3 rounded-2xl px-5 py-4 text-left transition hover:bg-white/[0.04]">
                <span className="text-xl">🪩</span>

                <div>
                  <p className="text-xs text-zinc-500">
                    Tipo
                  </p>

                  <p className="text-sm font-medium">
                    Todos los sitios
                  </p>
                </div>
              </button>


              <button className="rounded-2xl bg-lime-400 px-7 py-4 font-bold text-black transition hover:scale-[1.02] hover:bg-lime-300">
                Explorar
              </button>

            </div>
          </div>


          {/* FILTROS RAPIDOS */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 transition hover:border-lime-400/40 hover:text-white">
              Esta noche
            </button>

            <button className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 transition hover:border-lime-400/40 hover:text-white">
              🎵 Reggaeton
            </button>

            <button className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 transition hover:border-lime-400/40 hover:text-white">
              🎧 Electrónica
            </button>

            <button className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 transition hover:border-lime-400/40 hover:text-white">
              🎉 Comercial
            </button>
          </div>

        </div>
      </section>


      {/* CATEGORIAS */}
      <section className="px-5 py-10">
        <div className="mx-auto max-w-7xl">
          
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-lime-400">
                EXPLORA
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                ¿Qué te apetece hoy?
              </h2>
            </div>

            <button className="hidden text-sm text-zinc-400 sm:block">
              Ver todo →
            </button>
          </div>


          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {categories.map((category) => (
              <button
                key={category.name}
                className="group rounded-3xl border border-white/5 bg-zinc-900 p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-lime-400/40 hover:bg-zinc-800"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05] text-2xl transition group-hover:bg-lime-400">
                  {category.icon}
                </div>

                <h3 className="mt-8 text-lg font-bold">
                  {category.name}
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  {category.count}
                </p>

                <div className="mt-5 text-lime-400">
                  →
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>


      {/* CERCA DE TI */}
      <section className="px-5 py-14">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-lime-400">
                <span className="h-2 w-2 rounded-full bg-lime-400" />
                CERCA DE TI
              </div>

              <h2 className="mt-2 text-3xl font-bold">
                Sitios para salir
              </h2>

              <p className="mt-2 text-zinc-500">
                Descubre locales y planes en tu zona.
              </p>
            </div>


            <button className="w-fit rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white hover:text-black">
              Ver en mapa 🗺️
            </button>

          </div>


          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

            {venues.map((venue) => (
              <article
                key={venue.name}
                className="group overflow-hidden rounded-3xl border border-white/5 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                
                {/* IMAGEN */}
                <div className="relative h-64 overflow-hidden bg-zinc-800">

                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">
                    {venue.type}
                  </div>

                  <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur transition hover:bg-white hover:text-black">
                    ♡
                  </button>

                  <div className="absolute bottom-4 left-4">
                    <p className="text-sm text-zinc-300">
                      📍 {venue.zone}
                    </p>

                    <p className="text-xs text-zinc-400">
                      {venue.city}
                    </p>
                  </div>

                </div>


                {/* INFORMACION */}
                <div className="p-5">

                  <h3 className="text-lg font-bold">
                    {venue.name}
                  </h3>


                  <div className="mt-4 flex flex-wrap gap-2">

                    {venue.genres.map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-zinc-400"
                      >
                        🎵 {genre}
                      </span>
                    ))}

                  </div>


                  <div className="mt-5 border-t border-white/5 pt-4">

                    <div className="flex items-center justify-between text-sm">

                      <div>
                        <p className="text-xs text-zinc-500">
                          Entrada
                        </p>

                        <p className="font-semibold text-white">
                          {venue.entry}
                        </p>
                      </div>


                      <div className="text-right">
                        <p className="text-xs text-zinc-500">
                          Copa
                        </p>

                        <p className="font-semibold text-white">
                          {venue.drink}
                        </p>
                      </div>

                    </div>

                  </div>


                  <button className="mt-5 w-full rounded-xl bg-white/[0.05] py-3 text-sm font-medium text-white transition hover:bg-lime-400 hover:text-black">
                    Ver local
                  </button>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="px-5 py-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-900 px-6 py-12 md:px-12">

          <div className="max-w-2xl">
            <p className="text-sm font-medium text-lime-400">
              ¿NO SABES DÓNDE IR?
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Encuentra tu próximo sitio favorito.
            </h2>

            <p className="mt-5 text-zinc-400">
              Explora locales según tu ciudad, tus gustos musicales y el tipo de plan que buscas.
            </p>

            <button className="mt-7 rounded-xl bg-lime-400 px-6 py-3 font-bold text-black transition hover:bg-lime-300">
              Explorar locales →
            </button>
          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="mt-10 border-t border-white/5 px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-2 text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 font-black text-black">
              S
            </div>

            <span className="font-bold">
              salgo.es
            </span>
          </div>

          <p>
            © 2026 SalGo · Descubre dónde salir.
          </p>

          <div className="flex gap-5">
            <a href="#">Instagram</a>
            <a href="#">Contacto</a>
          </div>

        </div>
      </footer>

    </main>
  );
}
