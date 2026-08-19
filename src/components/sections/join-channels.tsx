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
import { toast } from "@/hooks/use-toast";

export function JoinChannels({ qqGroup }: { qqGroup: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });
  const qqDeepLink = `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${qqGroup}&card_type=group&source=qrcode`;

  const handleCopy = () => {
    copyToClipboard(qqGroup);
    toast({
      title: "已复制 QQ 迎新群号",
      description: `群号 ${qqGroup} 已复制到剪贴板，打开 QQ 搜索即可申请加入。`,
    });
  };

  return (
    <CardFrame
      id="join-channel"
      className="join-channels-frame shadow-xs border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-colors w-full"
    >
      <CardFrameHeader className="py-3.5 px-5 sm:px-6">
        <CardFrameTitle className="text-xs">QQ 迎新群</CardFrameTitle>
        <CardFrameAction>
          <Button
            type="button"
            variant="ghost"
            className="min-h-[28px] h-auto py-1 px-2.5 text-xs font-mono border border-[var(--border)] rounded-[var(--radius-xs)]"
            onClick={handleCopy}
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

      <CardPanel className="p-5 sm:p-6">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-5 sm:gap-6">
          <div className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border)] bg-white p-2 shadow-2xs">
            <Image
              src="/images/qr/qr-group.svg"
              alt={`2026 云飞扬迎新 QQ 群二维码，群号 ${qqGroup}`}
              width={144}
              height={144}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex flex-col justify-center gap-2.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[var(--fg-muted)]">群号：</span>
              <kbd className="font-mono text-sm font-semibold text-[var(--fg)] tabular px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">
                {qqGroup}
              </kbd>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed">
              扫码直达迎新群，与学长学姐直接交流获取一手资讯
            </p>
            <div className="pt-1">
              <Button
                asChild
                size="sm"
                variant="ghost"
                className="min-h-[32px] h-auto py-1.5 px-3 text-xs border border-[var(--border)] font-mono rounded-[var(--radius-xs)] hover:bg-[var(--surface-2)]"
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
