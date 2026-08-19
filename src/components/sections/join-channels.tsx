"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  CardFrame,
  CardFrameAction,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@/components/ui/card";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function JoinChannels({ qqGroup }: { qqGroup: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });
  const qqDeepLink = `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${qqGroup}&card_type=group&source=qrcode`;

  return (
    <CardFrame
      id="join-channel"
      className="join-channels-frame shadow-xs border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-colors w-full max-w-lg"
    >
      <CardFrameHeader className="py-3 px-4 sm:px-5">
        <CardFrameTitle className="text-xs">01.1 // QQ 迎新群</CardFrameTitle>
        <CardFrameAction>
          <Button
            type="button"
            variant="ghost"
            className="min-h-[28px] h-auto py-1 px-2.5 text-xs font-mono border border-[var(--border)]"
            onClick={() => copyToClipboard(qqGroup)}
          >
            {isCopied ? (
              <>
                <Check aria-hidden="true" size={12} className="text-[var(--success)]" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy aria-hidden="true" size={12} />
                <span>COPY ID</span>
              </>
            )}
          </Button>
        </CardFrameAction>
      </CardFrameHeader>

      <CardPanel className="p-4 sm:p-5">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border)] bg-white p-1.5 shadow-2xs">
            <Image
              src="/images/qr/qr-group.svg"
              alt={`2026 云飞扬迎新 QQ 群二维码，群号 ${qqGroup}`}
              width={96}
              height={96}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-center gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[var(--fg-muted)]">群号：</span>
              <kbd className="font-mono text-xs font-semibold text-[var(--fg)] tabular">{qqGroup}</kbd>
            </div>
            <p className="font-sans text-xs text-[var(--fg-muted)] leading-snug">
              扫码直达迎新群，与学长学姐直接交流获取一手资讯
            </p>
            <div className="pt-0.5">
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="min-h-[28px] h-auto py-1 px-2.5 text-xs border border-[var(--border)] font-mono"
              >
                <a href={qqDeepLink}>
                  唤起 QQ 加入 <ExternalLink aria-hidden="true" size={12} />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardPanel>
    </CardFrame>
  );
}
