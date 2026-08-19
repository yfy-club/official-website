"use client";

import { Check, Copy } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { CardFrame, CardFrameAction, CardFrameHeader, CardFrameTitle, CardPanel } from "@/components/ui/card";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function JoinChannels({ qqGroup }: { qqGroup: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });
  const qqDeepLink = `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${qqGroup}&card_type=group&source=qrcode`;

  return (
    <CardFrame className="join-channels-frame">
      <CardFrameHeader>
        <CardFrameTitle>07 // BOARDING · 迎新群</CardFrameTitle>
        <CardFrameAction>
          <Button
            type="button"
            variant="ghost"
            className="h-8 text-xs font-mono border border-[var(--border)]"
            onClick={() => copyToClipboard(qqGroup)}
          >
            {isCopied ? (
              <>
                <Check aria-hidden="true" size={13} className="text-[var(--success)]" />
                <span>COPIED</span>
              </>
            ) : (
              <>
                <Copy aria-hidden="true" size={13} />
                <span>COPY ID</span>
              </>
            )}
          </Button>
        </CardFrameAction>
      </CardFrameHeader>

      <CardPanel className="p-0">
        <div className="join-channels">
          <div className="join-channels__actions">
            <Button asChild>
              <a href={qqDeepLink}>一键唤起 QQ 迎新群</a>
            </Button>
            <div className="join-channels__number font-mono">
              <span>群号：</span>
              <kbd className="font-mono text-sm font-semibold text-[var(--fg)] tabular">{qqGroup}</kbd>
            </div>
            <p className="text-xs text-[var(--fg-faint)] leading-relaxed">
              若未自动唤起客户端，可点击右上角复制群号手动搜索加入。
            </p>
          </div>

          <div className="join-channels__qr">
            <span className="join-channels__finder">
              <i /><i /><i /><i />
              <Image
                src="/images/qr/qr-group.svg"
                alt={`2026 云飞扬迎新 QQ 群二维码，群号 ${qqGroup}`}
                width={320}
                height={320}
              />
            </span>
            <p className="font-mono text-xs text-[var(--fg-faint)]">扫码直接加入</p>
          </div>
        </div>
      </CardPanel>
    </CardFrame>
  );
}
