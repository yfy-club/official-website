"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

type Mechanism = {
  detail: string;
  title: string;
};

export function MechanismAccordion({ items }: { items: readonly Mechanism[] }) {
  return (
    <Accordion.Root className="mechanism-accordion" type="single" collapsible>
      {items.map((item, index) => (
        <Accordion.Item className="mechanism-accordion__item" key={item.title} value={item.title}>
          <Accordion.Header>
            <Accordion.Trigger className="mechanism-accordion__trigger">
              <span className="mechanism-accordion__index tabular">{String(index + 1).padStart(2, "0")}</span>
              <span>{item.title}</span>
              <ChevronDown className="mechanism-accordion__chevron" aria-hidden="true" size={17} />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="mechanism-accordion__content">
            <p>{item.detail}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
