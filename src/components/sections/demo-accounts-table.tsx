"use client";

import { Check, Copy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardFrame,
  CardFrameAction,
  CardFrameDescription,
  CardFrameHeader,
  CardFrameTitle,
  CardPanel,
} from "@/components/ui/card";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { toast } from "@/hooks/use-toast";

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
    <div className="inline-flex items-center gap-1.5 font-mono text-xs">
      <code className="px-1.5 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)] text-[var(--fg)]">
        {value}
      </code>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 rounded text-[var(--fg-faint)] hover:text-[var(--fg)]"
        onClick={handleCopy}
        aria-label={`复制${label} ${value}`}
      >
        {isCopied ? (
          <Check size={12} className="text-[var(--success)]" />
        ) : (
          <Copy size={12} />
        )}
      </Button>
    </div>
  );
}

export function DemoAccountsTable({ workNameZh, accounts }: DemoAccountsTableProps) {
  return (
    <CardFrame className="demo-access mb-8 border-[var(--border)] bg-[var(--surface)] shadow-xs">
      <CardFrameHeader className="py-3.5 px-5 sm:px-6">
        <div>
          <CardFrameTitle>02.1 // 公开体验账号</CardFrameTitle>
          <CardFrameDescription>一键复制体验账号与密码，免注册直接进入系统</CardFrameDescription>
        </div>
        <CardFrameAction>
          <Badge variant="neutral">PUBLIC DEMO</Badge>
        </CardFrameAction>
      </CardFrameHeader>
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
