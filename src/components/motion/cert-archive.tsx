"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Sparkles, X } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardFooter, CardMeta } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag } from "@/components/ui/tag";
import { useToast } from "@/hooks/use-toast";

export type CertAward = {
  description: string;
  id: string;
  image: string;
  level: string;
  result: string;
  trackSlugs: string[];
  year: string;
  competition: string;
};

export function CertArchive({ awards }: { awards: CertAward[] }) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const triggers = useRef(new Map<string, HTMLButtonElement>());

  const filteredAwards = useMemo(() => {
    if (activeTab === "all") return awards;
    if (activeTab === "national") return awards.filter((a) => a.level === "国家级");
    if (activeTab === "provincial") return awards.filter((a) => a.level === "省级");
    if (activeTab === "2025") return awards.filter((a) => a.year === "2025");
    if (activeTab === "2024") return awards.filter((a) => a.year === "2024");
    return awards;
  }, [awards, activeTab]);

  const currentIndex = awards.findIndex((award) => award.id === openId);
  const currentAward = currentIndex >= 0 ? awards[currentIndex] : null;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setOpenId(awards[currentIndex - 1].id);
    } else {
      setOpenId(awards[awards.length - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < awards.length - 1) {
      setOpenId(awards[currentIndex + 1].id);
    } else {
      setOpenId(awards[0].id);
    }
  };

  useEffect(() => {
    if (!openId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prevIdx = currentIndex > 0 ? currentIndex - 1 : awards.length - 1;
        setOpenId(awards[prevIdx]?.id ?? null);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        const nextIdx = currentIndex < awards.length - 1 ? currentIndex + 1 : 0;
        setOpenId(awards[nextIdx]?.id ?? null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openId, currentIndex, awards]);

  const handleCopyArchiveId = (award: CertAward) => {
    const archiveCode = `YFY-CERT-${award.year}-${award.id.toUpperCase()}`;
    navigator.clipboard.writeText(archiveCode).then(() => {
      setCopied(true);
      toast({
        title: "档案编号已复制",
        description: `${archiveCode} 已复制到剪贴板。`,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="cert-archive-console">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all">
              全部 ({awards.length})
            </TabsTrigger>
            <TabsTrigger value="national">
              国家级 ({awards.filter((a) => a.level === "国家级").length})
            </TabsTrigger>
            <TabsTrigger value="provincial">
              省级 ({awards.filter((a) => a.level === "省级").length})
            </TabsTrigger>
            <TabsTrigger value="2025">
              2025 年度 ({awards.filter((a) => a.year === "2025").length})
            </TabsTrigger>
            <TabsTrigger value="2024">
              2024 年度 ({awards.filter((a) => a.year === "2024").length})
            </TabsTrigger>
          </TabsList>
          <div className="font-mono text-xs text-[var(--fg-muted)]">
            显示 {filteredAwards.length} / {awards.length} 份脱敏档案
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0 focus-visible:outline-none">
          {filteredAwards.length === 0 ? (
            <Empty className="my-12">
              <EmptyHeader>
                <EmptyTitle>暂无匹配证书</EmptyTitle>
                <EmptyDescription>当前分类下暂无已归档证书，请切换其他分类。</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAwards.map((award, index) => {
                const isNational = award.level === "国家级";
                const archiveCode = `CERT-${award.year}-${String(index + 1).padStart(2, "0")}`;

                return (
                  <Card
                    corners
                    key={award.id}
                    variant="frame"
                    className="group/cert relative flex flex-col justify-between overflow-hidden border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)] transition-all shadow-xs"
                  >
                    <div className="flex flex-col flex-1">
                      <CardMeta
                        code={archiveCode}
                        revision={`REV ${award.year}`}
                        status={{
                          label: award.level,
                          variant: isNational ? "active" : "neutral",
                        }}
                      />
                      <button
                        type="button"
                        className="relative block w-full aspect-16/11 overflow-hidden bg-[var(--surface-2)] border-b border-[var(--border)] text-left group-hover/cert:opacity-95 transition-opacity cursor-pointer"
                        ref={(node) => {
                          if (node) triggers.current.set(award.id, node);
                          else triggers.current.delete(award.id);
                        }}
                        onClick={() => setOpenId(award.id)}
                        aria-label={`查看 ${award.competition} ${award.result} 证书大图`}
                      >
                        <Image
                          src={award.image}
                          alt={`${award.year} 年${award.competition}${award.result}证书`}
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover/cert:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/cert:opacity-100 transition-opacity flex items-end justify-between p-3 text-white">
                          <span className="font-mono text-xs flex items-center gap-1">
                            <Sparkles size={13} className="text-[var(--accent)]" /> 查看脱敏原件
                          </span>
                          <ExternalLink size={14} />
                        </div>
                      </button>

                      <CardBody className="flex flex-col flex-1 p-5 pb-5">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant={isNational ? "active" : "warning"} className="text-[11px]">
                            {award.result}
                          </Badge>
                          <span className="font-mono text-xs text-[var(--fg-faint)]">
                            {award.year} 年度
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[var(--fg)] tracking-tight leading-snug mb-2">
                          {award.competition}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--fg-muted)] leading-relaxed mb-4">
                          {award.description}
                        </p>

                        <div className="mt-auto pt-3 border-t border-[var(--border)] flex flex-wrap gap-1.5">
                          {award.trackSlugs.map((slug) => (
                            <Tag key={slug} className="text-[11px] py-0.5 px-2 font-mono">
                              #{slug}
                            </Tag>
                          ))}
                        </div>
                      </CardBody>
                    </div>

                    <CardFooter className="p-3.5 px-5 border-t border-[var(--border)] bg-[var(--surface-2)]/30 text-xs font-mono text-[var(--fg-muted)] flex items-center justify-between">
                      <span className="truncate">归档 ID: {award.id}</span>
                      <span className="text-[11px] text-[var(--fg-faint)]">已脱敏原件</span>
                    </CardFooter>

                    <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover/cert:opacity-100 transition-opacity duration-300">
                      <BorderBeam
                        borderWidth={1.5}
                        colorFrom={isNational ? "var(--warn)" : "var(--accent)"}
                        colorTo="var(--accent)"
                        duration={6}
                        size={110}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Coss UI / Radix Lightbox Dialog */}
      <Dialog.Root open={openId !== null} onOpenChange={(next) => { if (!next) setOpenId(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md animate-in fade-in-0 duration-200" />
          {currentAward && (
            <Dialog.Content
              className="fixed left-1/2 top-1/2 z-50 w-[94vw] max-w-6xl max-h-[94vh] -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] p-5 sm:p-7 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200 focus:outline-hidden overflow-hidden"
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                if (openId) triggers.current.get(openId)?.focus();
              }}
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--border)] shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant={currentAward.level === "国家级" ? "active" : "warning"}>
                      {currentAward.level} · {currentAward.result}
                    </Badge>
                    <span className="font-mono text-xs text-[var(--fg-faint)]">
                      {currentAward.year} 年档案
                    </span>
                  </div>
                  <Dialog.Title className="text-lg sm:text-2xl font-bold text-[var(--fg)] tracking-tight">
                    {currentAward.competition}
                  </Dialog.Title>
                  <Dialog.Description className="text-xs sm:text-sm text-[var(--fg-muted)] mt-1">
                    {currentAward.description} · 公开脱敏版验证原件
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--fg)] hover:bg-[var(--surface)] hover:text-[var(--accent)] hover:rotate-90 transition-all duration-200 cursor-pointer shadow-xs focus:outline-hidden"
                    aria-label="关闭灯箱"
                  >
                    <X size={18} className="stroke-[2.5]" />
                  </button>
                </Dialog.Close>
              </div>

              {/* Certificate Image Frame */}
              <div className="relative flex-1 flex items-center justify-center rounded-[var(--radius-xs)] border border-[var(--border)] bg-black/60 p-4 sm:p-6 my-4 overflow-hidden min-h-[380px] max-h-[68vh]">
                <Image
                  src={currentAward.image}
                  alt={`${currentAward.year} 年${currentAward.competition}${currentAward.result}证书，公开脱敏版`}
                  width={1800}
                  height={1300}
                  className="max-h-[64vh] max-w-full w-auto h-auto object-contain rounded-[var(--radius-xs)] shadow-2xl select-none"
                  priority
                />

                {/* Left/Right Switch Buttons */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border-strong)] flex items-center justify-center text-[var(--fg)] hover:bg-[var(--surface)] hover:scale-110 shadow-xl transition-all cursor-pointer"
                  aria-label="查看上一份证书"
                >
                  <ArrowLeft size={20} className="stroke-[2.2]" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border-strong)] flex items-center justify-center text-[var(--fg)] hover:bg-[var(--surface)] hover:scale-110 shadow-xl transition-all cursor-pointer"
                  aria-label="查看下一份证书"
                >
                  <ArrowRight size={20} className="stroke-[2.2]" />
                </button>
              </div>

              {/* Dialog Footer Actions & Shortcuts */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[var(--border)] text-xs text-[var(--fg-muted)] shrink-0">
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 font-mono text-xs border border-[var(--border)] rounded-[var(--radius-xs)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]"
                    onClick={() => handleCopyArchiveId(currentAward)}
                  >
                    {copied ? <Check size={13} className="text-[var(--accent)] mr-1" /> : <Copy size={13} className="mr-1" />}
                    <span>复制档案编号</span>
                  </Button>
                  <span className="font-mono text-[11px] text-[var(--fg-faint)]">
                    档案 ID: YFY-CERT-{currentAward.year}-{currentAward.id.toUpperCase()}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[var(--fg-faint)]">
                  <span>快捷键:</span>
                  <KbdGroup>
                    <Kbd>←</Kbd>
                    <Kbd>→</Kbd>
                    <span>切图</span>
                  </KbdGroup>
                  <KbdGroup className="ml-2">
                    <Kbd>ESC</Kbd>
                    <span>退出</span>
                  </KbdGroup>
                </div>
              </div>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
