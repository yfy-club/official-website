"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { useRef, useState } from "react";

type Cert = {
  competition: string;
  id: string;
  image: string;
  level: string;
  result: string;
  year: string;
};

type TransitionDocument = Document & {
  startViewTransition?: (update: () => void) => unknown;
};

export function CertArchive({ awards }: { awards: Cert[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const selected = awards.find((award) => award.id === openId) ?? null;

  function transition(update: () => void) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = (document as TransitionDocument).startViewTransition;
    if (!start || reduce) {
      update();
      return;
    }
    start.call(document, () => flushSync(update));
  }

  function open(id: string) {
    flushSync(() => setSelectedId(id));
    transition(() => setOpenId(id));
  }

  function close() {
    transition(() => setOpenId(null));
  }

  return (
    <Dialog.Root open={openId !== null} onOpenChange={(next) => { if (!next) close(); }}>
      <div className="cert-grid">
        {awards.map((award) => (
          <button
            type="button"
            className="cert-card"
            key={award.id}
            ref={(node) => { if (node) triggers.current.set(award.id, node); else triggers.current.delete(award.id); }}
            aria-haspopup="dialog"
            onClick={() => open(award.id)}
          >
            <span className="cert-card__image" style={{ viewTransitionName: selectedId === award.id && openId === null ? "cert-image" : "none" }}>
              <Image src={award.image} alt={`${award.year} 年${award.competition}${award.result}证书`} fill sizes="(max-width: 640px) 50vw, 33vw" />
            </span>
            <span className="caps tabular">{award.year} / {award.level}</span>
            <strong>{award.competition}</strong>
            <span>{award.result}</span>
          </button>
        ))}
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog__overlay cert-drawer__overlay" />
        {selected && (
          <Dialog.Content
            className="dialog__content cert-drawer"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (selectedId) triggers.current.get(selectedId)?.focus();
            }}
          >
            <Dialog.Title className="dialog__title">{selected.competition}</Dialog.Title>
            <Dialog.Description className="dialog__description">{selected.year} · {selected.level} · {selected.result}</Dialog.Description>
            <div className="dialog__body">
              <Image
                className="cert-full"
                style={{ viewTransitionName: openId ? "cert-image" : "none" }}
                src={selected.image}
                alt={`${selected.year} 年${selected.competition}${selected.result}证书，公开脱敏版`}
                width={1800}
                height={1300}
                sizes="90vw"
              />
            </div>
            <Dialog.Close className="dialog__close" aria-label="关闭"><X aria-hidden="true" size={20} /></Dialog.Close>
          </Dialog.Content>
        )}
      </Dialog.Portal>
    </Dialog.Root>
  );
}
