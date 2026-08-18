"use client";

import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function JoinChannels({ qqGroup }: { qqGroup: string }) {
  const [copied, setCopied] = useState(false);
  async function copyGroup() {
    await navigator.clipboard.writeText(qqGroup);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const qqDeepLink = `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${qqGroup}&card_type=group&source=qrcode`;
  return (
    <div className="join-channels">
      <div className="join-channels__actions">
        <Button asChild><a href={qqDeepLink}>一键加入 QQ 迎新群</a></Button>
        <p>微信内可能无法唤起 QQ，可复制群号后手动搜索。</p>
        <div className="join-channels__number"><span className="tabular">群号：{qqGroup}</span><Button variant="ghost" type="button" onClick={copyGroup}>{copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}{copied ? "已复制" : "复制"}</Button></div>
      </div>
      <div className="join-channels__qr">
        <span className="join-channels__finder">
          <i /><i /><i /><i />
          <Image src="/images/qr/qr-group.svg" alt={`2026 云飞扬迎新 QQ 群二维码，群号 ${qqGroup}`} width={320} height={320} />
        </span>
        <p>长按二维码识别</p>
      </div>
    </div>
  );
}
