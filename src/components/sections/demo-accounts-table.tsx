"use client";

import { Check, Copy } from "lucide-react";

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
      title={`点击复制${label} ${value}`}
      aria-label={`复制${label} ${value}`}
      className={cn(
        "group inline-flex items-center justify-between gap-2 px-2.5 py-1 rounded-[var(--radius-xs)] font-mono text-xs cursor-pointer transition-all duration-150 border outline-none select-all text-left active:scale-[0.96]",
        isCopied
          ? "bg-[var(--success)]/10 border-[var(--success)]/40 text-[var(--success)] shadow-2xs"
          : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--fg)] hover:bg-[var(--surface-3)] hover:border-[var(--accent)]/50 hover:text-[var(--fg)]"
      )}
    >
      <span className="tracking-tight select-all">{value}</span>
      <span className="shrink-0 flex items-center justify-center w-3.5 h-3.5 text-[var(--fg-faint)] group-hover:text-[var(--accent)] transition-colors">
        {isCopied ? (
          <Check size={13} className="text-[var(--success)] stroke-[2.5] animate-in zoom-in-50 duration-150" />
        ) : (
          <Copy size={12} className="opacity-70 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    </button>
  );
}

export function DemoAccountsTable({ workNameZh, accounts }: DemoAccountsTableProps) {
  return (
    <CardFrame className="demo-access mb-8 border-[var(--border)] bg-[var(--surface)] shadow-xs">
      <CardFrameHeader className="py-3.5 px-5 sm:px-6">
        <div>
          <CardFrameTitle>02.1 // 演示凭据</CardFrameTitle>
          <CardFrameDescription>系统预置测试账号与访问权限边界</CardFrameDescription>
        </div>
      </CardFrameHeader>
      <CardPanel className="p-0 overflow-x-auto">
        <table className="data-table w-full">
          <caption className="sr-only">{workNameZh}公开演示账号与体验范围</caption>
          <thead>
            <tr>
              <th scope="col" className="w-[18%] min-w-[90px]">角色</th>
              <th scope="col" className="w-[24%] min-w-[120px]">账号</th>
              <th scope="col" className="w-[26%] min-w-[140px]">密码</th>
              <th scope="col" className="w-[32%] min-w-[180px]">体验范围</th>
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
