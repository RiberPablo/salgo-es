export function Footer() {
  return (
    <footer className="mt-10 border-t border-white/5 px-5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 font-black text-black">
            S
          </div>
          <span className="font-bold">salgo.es</span>
        </div>

        <p>© 2026 SalGo · Descubre dónde salir.</p>

        <div className="flex gap-5">
          <a
            href="https://www.instagram.com/salgo_app"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Instagram
          </a>
          <a
            href="https://www.instagram.com/salgo_app"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Contacto
          </a>
        </div>
      </div>
    </footer>
  );
}
