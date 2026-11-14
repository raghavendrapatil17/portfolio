import { toolbelt } from "@/data/portfolio";

export default function Marquee() {
  const items = [...toolbelt, ...toolbelt];
  return (
    <div className="marquee relative border-y border-line py-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-2xl md:text-3xl font-medium tracking-tight text-dim hover:text-fg transition-colors">
            {t}
            <span className="text-accent text-base">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
