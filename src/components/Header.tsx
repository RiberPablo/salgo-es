import Link from "next/link";

const NAV = [
  { href: "/", label: "Explorar" },
  { href: "/categoria/discotecas", label: "Discotecas" },
  { href: "/categoria/tardeos", label: "Tardeos" },
  { href: "/categoria/pubs", label: "Pubs" },
  { href: "/eventos", label: "Eventos" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-lg font-black text-black">
            S
          </div>
          <span className="text-xl font-black tracking-tight">
            salgo<span className="text-lime-400">.es</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-zinc-400 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/buscar"
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:bg-white hover:text-black"
        >
          🔎 Buscar
        </Link>
      </div>

      {/* Navegación en móvil: fila deslizable */}
      <nav className="flex gap-2 overflow-x-auto px-5 pb-3 text-sm md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-none rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-zinc-300 transition hover:border-lime-400/40 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
