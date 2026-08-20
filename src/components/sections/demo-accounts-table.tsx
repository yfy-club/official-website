"use client";

import { AlertTriangle, Check, Copy } from "lucide-react";

import {
  CardFrame,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@/components/ui/card";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type DemoAccount = {
  role: string;
  account: string;
  password: string;
  access: string;
};

type DemoAccountsTableProps = {
  workNameZh: string;
  accounts: DemoAccount[];
  notice?: string;
};

function CopyCell({ value, label }: { value: string; label: string }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });

  const handleCopy = () => {
    copyToClipboard(value);
    toast({
      title: `已复制${label}`,
      description: `${value} 已复制到剪贴板。`,
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`复制${label} ${value}`}
      className={cn(
        "group inline-flex items-center justify-between gap-2.5 px-2.5 py-1 rounded-[var(--radius-xs)] font-mono text-xs cursor-pointer transition-all border outline-none select-all text-left active:scale-[0.94]",
        isCopied
          ? "bg-[var(--success)]/10 border-[var(--success)]/40 text-[var(--success)] font-bold shadow-2xs"
          : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--fg)] hover:bg-[var(--surface-3)] hover:border-[var(--accent)]/50 hover:text-[var(--fg)]"
      )}
    >
      <span className="tracking-tight">{value}</span>
      <span className="shrink-0 flex items-center transition-transform duration-150 group-hover:scale-110">
        {isCopied ? (
          <span className="flex items-center gap-1 text-[11px] text-[var(--success)] font-bold">
            <Check size={12} className="stroke-[2.5]" />
            <span className="text-[10px] hidden sm:inline">已复制</span>
          </span>
        ) : (
          <Copy
            size={12}
            className="text-[var(--fg-faint)] group-hover:text-[var(--accent)] transition-colors opacity-70 group-hover:opacity-100"
          />
        )}
      </span>
    </button>
  );
}

export function DemoAccountsTable({ workNameZh, accounts, notice }: DemoAccountsTableProps) {
  const displayNotice =
    notice ??
    "当前系统为 Mock 数据演示版系统（非真实生产服务器），请勿随意删除或修改演示数据，以免影响他人体验系统效果。";

  return (
    <CardFrame className="demo-access mb-8 border-[var(--border)] bg-[var(--surface)] shadow-xs">
      <CardFrameHeader className="py-4 px-5 sm:px-6">
        <div>
          <CardFrameTitle>02.1 // 演示凭据</CardFrameTitle>
          <CardFrameDescription>系统预置测试账号与访问权限边界</CardFrameDescription>
        </div>
      </CardFrameHeader>

      {/* 醒目工业警示横幅 */}
      <div className="mx-5 sm:mx-6 mb-4 p-3.5 sm:p-4 rounded-[var(--radius-xs)] border-l-4 border-l-[var(--warn)] border border-[var(--warn)]/35 bg-[var(--warn)]/10 dark:bg-[var(--warn)]/15">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--warn)] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--warn)]">
              MOCK DEMO NOTICE // 演示环境提示
            </span>
            <p className="text-xs sm:text-sm text-[var(--fg)] font-medium leading-relaxed m-0">
              {displayNotice}
            </p>
          </div>
        </div>
      </div>

      <CardPanel className="p-0 overflow-x-auto">
        <table className="data-table">
          <caption className="sr-only">{workNameZh}公开演示账号与体验范围</caption>
          <thead>
            <tr>
              <th scope="col">角色</th>
              <th scope="col">账号</th>
              <th scope="col">密码</th>
              <th scope="col">体验范围</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.account}>
                <td className="font-medium text-[var(--fg)]">{account.role}</td>
                <td>
                  <CopyCell value={account.account} label="账号" />
                </td>
                <td>
                  <CopyCell value={account.password} label="密码" />
                </td>
                <td className="text-[var(--fg-muted)]">{account.access}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardPanel>
    </CardFrame>
  );
}
