export function Marquee({
  items,
  alternate = true,
  className = "",
}: {
  items: string[];
  /** Alternate solid / outline words. */
  alternate?: boolean;
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={`marquee relative overflow-hidden ${className}`} aria-hidden="true">
      <div className="marquee-track flex w-max animate-marquee items-center">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`whitespace-nowrap px-6 text-xl font-semibold uppercase tracking-tight sm:text-2xl md:text-3xl ${
                alternate && i % 2 === 1 ? "text-stroke-thin" : "text-fg/85"
              }`}
            >
              {item}
            </span>
            <span className="text-sm text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
