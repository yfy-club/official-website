import { GitBranch } from "lucide-react";
import { Card, CardBody, CardMeta } from "@/components/ui/card";

interface TradeoffItem {
  title: string;
  detail: string;
}

interface WorkTradeoffsDeckProps {
  tradeoffs: TradeoffItem[];
}

export function WorkTradeoffsDeck({ tradeoffs }: WorkTradeoffsDeckProps) {
  if (!tradeoffs || tradeoffs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-reveal="group">
      {tradeoffs.map((item, idx) => (
        <Card
          key={item.title}
          corners
          variant="frame"
          className="relative flex flex-col justify-between overflow-hidden border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-xs"
        >
          <CardMeta
            code={`ARCH-0${idx + 1}`}
            revision="DESIGN NOTE"
            status={{ label: "DECISION LOG", variant: "neutral" }}
          />
          <CardBody className="p-6 sm:p-7 flex flex-col flex-1">
            <div className="flex items-start gap-2.5 mb-3">
              <GitBranch className="h-4 w-4 text-[var(--accent)] mt-1 shrink-0" aria-hidden="true" />
              <h3 className="text-base sm:text-lg font-bold text-[var(--fg)] tracking-tight leading-snug">
                {item.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed font-normal mt-1">
              {item.detail}
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
