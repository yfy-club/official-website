"use client";

import { CheckCircle2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardFrame, CardFrameHeader, CardFrameTitle, CardPanel } from "@/components/ui/card";

type Decision = {
  what: string;
  why: string;
};

type DecisionsAccordionProps = {
  decisions: Decision[];
};

export function DecisionsAccordion({ decisions }: DecisionsAccordionProps) {
  return (
    <CardFrame className="decisions-frame my-6 border-[var(--border)] bg-[var(--surface)] shadow-xs">
      <CardFrameHeader className="py-3 px-5 border-b border-[var(--border)]">
        <CardFrameTitle className="text-xs">04.1 // 架构选型与权衡决策</CardFrameTitle>
      </CardFrameHeader>
      <CardPanel className="p-2 sm:p-4">
        <Accordion type="multiple" defaultValue={[decisions[0]?.what ?? ""]} className="w-full">
          {decisions.map((decision, index) => (
            <AccordionItem key={decision.what} value={decision.what} className="border-b border-[var(--border)] last:border-0 px-2">
              <AccordionTrigger className="hover:no-underline py-3">
                <div className="flex items-center gap-2.5 text-left">
                  <span className="font-mono text-xs text-[var(--accent)] tabular">
                    0{index + 1}
                  </span>
                  <span className="font-sans text-sm font-medium text-[var(--fg)]">
                    {decision.what}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-[var(--fg-muted)] pl-6 leading-relaxed">
                <div className="flex items-start gap-2 pt-1 pb-2">
                  <CheckCircle2 className="h-4 w-4 text-[var(--success)] shrink-0 mt-0.5" />
                  <p>{decision.why}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardPanel>
    </CardFrame>
  );
}
