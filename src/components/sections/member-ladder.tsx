"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { CardCorners } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";

type LadderItem = {
  branches?: readonly {
    detail: string;
    label: string;
  }[];
  count: number;
  detail: string;
  signals: readonly string[];
  stage: string;
  theme: string;
};

export function MemberLadder({ items }: { items: readonly LadderItem[] }) {
  const defaultValue = items[2] ? "phase-3" : "phase-1";
  const [activeValue, setActiveValue] = useState(defaultValue);
  const activeIndex = Math.max(0, Number(activeValue.split("-")[1]) - 1);

  function previewStage(value: string) {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setActiveValue(value);
  }

  return (
    <Tabs.Root
      className="ladder-console"
      onValueChange={setActiveValue}
      orientation="horizontal"
      value={activeValue}
    >
      <Tabs.List className="ladder-console__rail" aria-label="成员成长阶段">
        {items.map((item, index) => {
          const value = `phase-${index + 1}`;
          return (
            <Tabs.Trigger
              className="ladder-console__trigger"
              key={item.stage}
              onFocus={() => setActiveValue(value)}
              onPointerEnter={() => previewStage(value)}
              value={value}
            >
              <span className="ladder-console__number tabular">0{index + 1}</span>
              <span>
                <strong>{item.theme}</strong>
                <small>{item.stage}</small>
              </span>
              <i aria-hidden="true" />
            </Tabs.Trigger>
          );
        })}
      </Tabs.List>

      <MagicCard
        className="ladder-dossier"
        gradientColor="var(--accent-quiet)"
        gradientFrom="var(--accent)"
        gradientOpacity={0.7}
        gradientSize={460}
        gradientTo="var(--border-strong)"
      >
        <CardCorners />
        {items.map((item, index) => (
          <Tabs.Content className="ladder-dossier__panel" key={item.stage} value={`phase-${index + 1}`}>
            <header className="ladder-dossier__meta">
              <span className="caps tabular">PHASE 0{index + 1} / {item.theme}</span>
              <Badge variant={index === 2 ? "warning" : "neutral"}>{item.count} MEMBERS</Badge>
            </header>

            <div className="ladder-dossier__body">
              <div className="ladder-dossier__identity">
                <span className="ladder-dossier__phase tabular" aria-hidden="true">0{index + 1}</span>
                <div>
                  <p className="caps">{item.stage} / Member Ladder</p>
                  <h3>{item.theme}</h3>
                  <p>{item.detail}</p>
                </div>
              </div>

              {item.branches ? (
                <div className="ladder-dossier__branches">
                  {item.branches.map((branch) => (
                    <section key={branch.label}>
                      <h4 className="caps">{branch.label}</h4>
                      <p>{branch.detail}</p>
                    </section>
                  ))}
                </div>
              ) : (
                <div className="ladder-dossier__signals">
                  <p className="caps">Checkpoints</p>
                  <ol className="clean-list">
                    {item.signals.map((signal, signalIndex) => (
                      <li key={signal}>
                        <span className="tabular">0{signalIndex + 1}</span>
                        {signal}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </Tabs.Content>
        ))}
        {activeIndex === 2 && (
          <BorderBeam
            borderWidth={1}
            colorFrom="var(--warn)"
            colorTo="var(--accent)"
            duration={8}
            size={88}
          />
        )}
      </MagicCard>
    </Tabs.Root>
  );
}
