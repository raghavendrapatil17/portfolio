import { TECHNOLOGIES } from '@/data/tech';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TechLogosProps {
  limit?: number;
  size?: number;
  showLabels?: boolean;
}

export const TechLogos: React.FC<TechLogosProps> = ({ limit, size = 44, showLabels = false }) => {
  const list = limit ? TECHNOLOGIES.slice(0, limit) : TECHNOLOGIES;
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-10" aria-label="Technology logos">
      {list.map(t => (
        <Tooltip key={t.id}>
          <TooltipTrigger asChild>
            <a
              href={t.site}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              aria-label={t.name}
            >
              <span
                className="rounded-md bg-secondary/40 border border-border/50 shadow-sm p-2 inline-flex items-center justify-center transition-colors group-hover:bg-secondary/60"
                style={{ width: size, height: size }}
                dangerouslySetInnerHTML={{ __html: t.svg }}
              />
              {showLabels && <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">{t.name}</span>}
            </a>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {t.name}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default TechLogos;
