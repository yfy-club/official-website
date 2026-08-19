"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import type { Faq } from "@/content";

export function FaqAccordion({ items }: { items: readonly Faq[] }) {
  return (
    <Accordion.Root className="mechanism-accordion" type="single" collapsible>
      {items.map((item, index) => (
        <Accordion.Item className="mechanism-accordion__item" key={item.question} value={item.question}>
          <Accordion.Header>
            <Accordion.Trigger className="mechanism-accordion__trigger">
              <span className="mechanism-accordion__index tabular">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.question}</span>
              <ChevronDown className="mechanism-accordion__chevron" aria-hidden="true" size={17} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="mechanism-accordion__content">
            <p>{item.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
