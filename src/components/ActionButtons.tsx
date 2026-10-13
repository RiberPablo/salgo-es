// Botones de acción de las fichas (local y evento): cada uno con su color,
// para que se reconozcan de un vistazo.
// Paleta de la web: el verde lima es el único color sólido y se reserva
// para la acción principal (entradas o, si no hay, cómo llegar). El resto
// van sobre fondo oscuro; Instagram solo lleva un toque de su color.

const externo = { target: "_blank", rel: "noopener noreferrer" } as const;

const svg = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconoEntrada = () => (
  <svg {...svg}>
    <path d="M3 9a2 2 0 0 0 0 6v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3a2 2 0 0 1 0-6V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z" />
    <path d="M13 5v2M13 11v2M13 17v2" />
  </svg>
);

export const IconoInstagram = () => (
  <svg {...svg}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
);

export const IconoWeb = () => (
  <svg {...svg}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

export const IconoMapa = () => (
  <svg {...svg}>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

type Tam = "grande" | "pequeno";

const base =
  "flex items-center justify-center gap-2 rounded-xl text-center font-semibold transition duration-200";
const tamano = (t: Tam) =>
  t === "grande" ? "px-5 py-3.5 text-sm" : "px-3 py-2.5 text-xs";

export function BotonEntrada({
  href,
  detalle,
  tam = "grande",
}: {
  href: string;
  detalle?: string | null;
  tam?: Tam;
}) {
  return (
    <a
      href={href}
      {...externo}
      className={`${base} ${tamano(tam)} w-full bg-lime-400 font-bold text-black hover:bg-lime-300 ${
        detalle ? "flex-col gap-0.5" : ""
      }`}
    >
      <span className="flex items-center gap-2">
        <IconoEntrada />
        Comprar entrada
      </span>
      {detalle && (
        <span className="line-clamp-1 text-xs font-medium text-black/65">
          {detalle}
        </span>
      )}
    </a>
  );
}

export function BotonInstagram({
  href,
  tam = "grande",
}: {
  href: string;
  tam?: Tam;
}) {
  return (
    <a
      href={href}
      {...externo}
      className={`${base} ${tamano(tam)} flex-1 border border-rose-400/25 bg-gradient-to-br from-rose-500/15 to-orange-400/15 text-rose-100 hover:border-rose-400/60 hover:from-rose-500/25 hover:to-orange-400/25`}
    >
      <IconoInstagram />
      Instagram
    </a>
  );
}

export function BotonWeb({
  href,
  tam = "grande",
}: {
  href: string;
  tam?: Tam;
}) {
  return (
    <a
      href={href}
      {...externo}
      className={`${base} ${tamano(tam)} flex-1 border border-white/10 bg-white/[0.05] text-zinc-200 hover:bg-white hover:text-black`}
    >
      <IconoWeb />
      Web oficial
    </a>
  );
}

export function BotonMapa({
  href,
  tam = "grande",
}: {
  href: string;
  tam?: Tam;
}) {
  return (
    <a
      href={href}
      {...externo}
      className={`${base} ${tamano(tam)} ${
        tam === "grande" ? "w-full" : "flex-1"
      } ${
        tam === "grande"
          ? "bg-lime-400 font-bold text-black hover:bg-lime-300"
          : "border border-white/10 bg-white/[0.05] text-zinc-200 hover:bg-white hover:text-black"
      }`}
    >
      <IconoMapa />
      Cómo llegar
    </a>
  );
}
