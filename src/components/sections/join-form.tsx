"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Copy, ExternalLink, Send, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useState, type KeyboardEvent } from "react";
import { useForm, type FieldPath } from "react-hook-form";

import { Stamp } from "@/components/motion/stamp";
import { Turnstile } from "@/components/sections/turnstile";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupText } from "@/components/ui/input-group";
import { joinFormSchema, type JoinFormInput } from "@/content/schema";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type TrackOption = {
  label: string;
  value: JoinFormInput["track"];
};

type JoinFormProps = {
  siteKey?: string;
  tracks: TrackOption[];
};

type JoinResponse = {
  fieldErrors?: Partial<Record<FieldPath<JoinFormInput>, string[]>>;
  message?: string;
  ok?: boolean;
};

type SubmittedRecord = {
  contact: string;
  grade: string;
  major: string;
  name: string;
  studentId: string;
  timestamp: string;
  track: JoinFormInput["track"];
  customTrack?: string;
  trackLabel: string;
};

function descriptionId(id: string, message?: string) {
  return message ? `${id}-description` : undefined;
}

function isJoinResponse(value: unknown): value is JoinResponse {
  return typeof value === "object" && value !== null;
}

/* ── 字数动态刻度尺 (Live Character Meter) ───────────────────────────── */
function LiveCharacterMeter({ count }: { count: number }) {
  const isSatisfied = count >= 20;
  const progressRatio = isSatisfied
    ? Math.min(100, (count / 1000) * 100)
    : Math.min(100, (count / 20) * 100);

  return (
    <div className="flex items-center justify-between gap-3 font-mono mt-2 pt-1">
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "h-2 w-2 rounded-full shrink-0 transition-colors",
            isSatisfied
              ? "bg-[var(--success)]"
              : count > 0
                ? "bg-[var(--warn)]"
                : "bg-[var(--fg-faint)]"
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            "truncate text-xs sm:text-xs font-mono font-medium",
            isSatisfied
              ? "text-[var(--success)] font-semibold"
              : count > 0
                ? "text-[var(--warn)]"
                : "text-[var(--fg-muted)]"
          )}
        >
          {isSatisfied ? `[ ✓ 达标 · ${count}/1000 字 ]` : `[ 需满 20 字 · 当前 ${count} 字 ]`}
        </span>
      </div>
      <div
        className="w-24 sm:w-32 h-2 bg-[var(--surface-2)] rounded-full overflow-hidden border border-[var(--border)] shrink-0"
        aria-hidden="true"
      >
        <div
          className={cn(
            "h-full transition-all duration-200 rounded-full",
            isSatisfied ? "bg-[var(--success)]" : "bg-[var(--warn)]"
          )}
          style={{ width: `${Math.max(count > 0 ? 6 : 0, progressRatio)}%` }}
        />
      </div>
    </div>
  );
}

/* ── 提交成功电子归档回执 (Application Receipt) ─────────────────────── */
function ApplicationReceipt({ record }: { record: SubmittedRecord }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard({ timeout: 2000 });
  const qqGroup = "952254865";
  const qqDeepLink = `mqqapi://card/show_pslcard?src_type=internal&version=1&uin=${qqGroup}&card_type=group&source=qrcode`;

  const handleCopyQQ = () => {
    copyToClipboard(qqGroup);
    toast({
      title: "已复制 QQ 迎新群号",
      description: `群号 ${qqGroup} 已复制到剪贴板，打开 QQ 搜索即可加入。`,
    });
  };

  return (
    <div className="application-receipt flex flex-col gap-5 py-2 animate-in fade-in zoom-in-98 duration-200" role="status">
      {/* 顶部盖印与状态 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[var(--radius-xs)] border border-[var(--success)]/30 bg-[var(--success)]/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)]">
            <CheckCircle2 size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--fg)]">
              APPLICATION FILED // 报名已归档
            </h4>
            <p className="text-xs text-[var(--fg-muted)] mt-0.5">
              档案流水已记录至社团候选名单，请加入迎新群留意后续通知。
            </p>
          </div>
        </div>
        <div className="shrink-0 self-end sm:self-center">
          <Stamp message="报名申请已成功归档" />
        </div>
      </div>

      {/* 档案核心凭证清单 */}
      <div className="rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface-2)]/50 p-4 font-mono text-xs space-y-2.5">
        <div className="flex justify-between items-center pb-2 border-b border-[var(--border)] text-[var(--fg-faint)]">
          <span>RECEIPT META</span>
          <span className="text-[10px] tabular">{record.timestamp}</span>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[var(--fg-muted)]">
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--fg-faint)]">姓名：</dt>
            <dd className="font-medium text-[var(--fg)] truncate">{record.name}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--fg-faint)]">学号：</dt>
            <dd className="text-[var(--fg)] tabular">{record.studentId}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--fg-faint)]">专业：</dt>
            <dd className="text-[var(--fg)] truncate">{record.major}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[var(--fg-faint)]">方向：</dt>
            <dd className="text-[var(--accent)] font-semibold truncate">
              {record.track === "other" && record.customTrack
                ? `其他（${record.customTrack}）`
                : record.trackLabel}
            </dd>
          </div>
        </dl>
      </div>

      {/* 下一步行动向导 */}
      <div className="flex flex-col gap-3 p-4 rounded-[var(--radius-xs)] border border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[var(--fg)]">
          <Sparkles size={14} className="text-[var(--accent)]" />
          <span>NEXT STEP // 迎新交流群</span>
        </div>
        <p className="text-xs text-[var(--fg-muted)] leading-relaxed">
          招新宣讲会排期、第一轮基础考核题单与导师带学指南均在 QQ 迎新群内同步，扫码或点击下方加入：
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            asChild
            size="sm"
            className="h-8 py-1 px-3 text-xs font-mono rounded-[var(--radius-xs)] active:scale-[0.98]"
          >
            <a href={qqDeepLink}>
              唤起 QQ 加入 <ExternalLink size={12} className="ml-1" />
            </a>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyQQ}
            className="h-8 py-1 px-3 text-xs font-mono border border-[var(--border)] rounded-[var(--radius-xs)] active:scale-[0.98]"
          >
            {isCopied ? (
              <span className="text-[var(--success)] font-bold">COPIED</span>
            ) : (
              <>
                <Copy size={12} className="mr-1" />
                <span>COPY GROUP {qqGroup}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function JoinForm({ siteKey, tracks }: JoinFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const [submittedRecord, setSubmittedRecord] = useState<SubmittedRecord | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = useForm<JoinFormInput>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      contact: "",
      customTrack: "",
      grade: "",
      major: "",
      name: "",
      reason: "",
      studentId: "",
      turnstileToken: "",
      website: "",
    },
  });

  const onTokenChange = useCallback(
    (token: string) => {
      setValue("turnstileToken", token, { shouldValidate: false });
    },
    [setValue]
  );

  const onSubmit = handleSubmit(
    async (values) => {
      if (siteKey && !values.turnstileToken) {
        setError("root.server", { message: "请先完成人机验证。" });
        return;
      }

      try {
        const response = await fetch("/api/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const payload: unknown = await response.json().catch(() => null);
        const result = isJoinResponse(payload) ? payload : null;

        if (!response.ok || !result?.ok) {
          if (result?.fieldErrors) {
            for (const [field, messages] of Object.entries(result.fieldErrors)) {
              const message = messages?.[0];
              if (message) setError(field as FieldPath<JoinFormInput>, { type: "server", message });
            }
          }
          setTurnstileReset((value) => value + 1);
          setError("root.server", { message: result?.message ?? "提交失败，请稍后重试。" });
          return;
        }

        const activeTrack = tracks.find((t) => t.value === values.track);
        const resolvedLabel = values.track === "other" && values.customTrack
          ? `其他（${values.customTrack}）`
          : (activeTrack ? activeTrack.label : values.track);

        setSubmittedRecord({
          name: values.name,
          studentId: values.studentId,
          major: values.major,
          grade: values.grade,
          contact: values.contact,
          track: values.track,
          customTrack: values.customTrack,
          trackLabel: resolvedLabel,
          timestamp: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
        });
        reset();
      } catch {
        setTurnstileReset((value) => value + 1);
        setError("root.server", { message: "网络连接失败，请检查网络后重试。" });
      }
    },
    (validationErrors) => {
      const ids: Array<[keyof JoinFormInput, string]> = [
        ["name", "join-name"],
        ["studentId", "join-student-id"],
        ["major", "join-major"],
        ["grade", "join-grade"],
        ["contact", "join-contact"],
        ["track", "join-track"],
        ["customTrack", "join-custom-track"],
        ["reason", "join-reason"],
      ];
      const firstInvalid = ids.find(([field]) => validationErrors[field]);
      if (!firstInvalid) return;
      window.requestAnimationFrame(() => {
        document.getElementById(firstInvalid[1])?.scrollIntoView({ block: "center", behavior: "auto" });
      });
    }
  );

  const nameError = errors.name?.message;
  const studentIdError = errors.studentId?.message;
  const majorError = errors.major?.message;
  const gradeError = errors.grade?.message;
  const contactError = errors.contact?.message;
  const trackError = errors.track?.message;
  const customTrackError = errors.customTrack?.message;
  const reasonError = errors.reason?.message;
  const rootError = errors.root?.server?.message;

  const currentTrack = watch("track") || "";
  const reasonText = watch("reason") || "";

  const handleTrackKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!tracks.length) return;
    const currentIndex = tracks.findIndex((t) => t.value === currentTrack);
    let nextIndex = currentIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    } else if (e.key === " " || e.key === "Enter") {
      if (currentIndex === -1) {
        e.preventDefault();
        nextIndex = 0;
      }
    }

    if (nextIndex !== currentIndex && tracks[nextIndex]) {
      setValue("track", tracks[nextIndex].value, { shouldValidate: true });
    }
  };

  if (submittedRecord) {
    return <ApplicationReceipt record={submittedRecord} />;
  }

  return (
    <form className="join-form" noValidate onSubmit={onSubmit} aria-busy={isSubmitting} aria-labelledby="join-form-title">
      <fieldset className="join-form__grid" disabled={isSubmitting}>
        <legend className="sr-only">报名信息</legend>

        {/* 姓名 */}
        <Field id="join-name" label="姓名" error={nameError}>
          <Input
            id="join-name"
            autoComplete="name"
            placeholder="你的名字"
            aria-describedby={descriptionId("join-name", nameError)}
            aria-invalid={Boolean(nameError)}
            required
            {...register("name")}
          />
        </Field>

        {/* 学号（ID 紧凑前缀） */}
        <Field id="join-student-id" label="学号" error={studentIdError}>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>ID</InputGroupText>
            </InputGroupAddon>
            <Input
              id="join-student-id"
              autoComplete="off"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="10 位数字学号"
              aria-describedby={descriptionId("join-student-id", studentIdError)}
              aria-invalid={Boolean(studentIdError)}
              required
              {...register("studentId")}
            />
          </InputGroup>
        </Field>

        {/* 专业班级 */}
        <Field id="join-major" label="专业班级" error={majorError}>
          <Input
            id="join-major"
            autoComplete="organization-title"
            placeholder="26 智能云物联 1 班"
            aria-describedby={descriptionId("join-major", majorError)}
            aria-invalid={Boolean(majorError)}
            required
            {...register("major")}
          />
        </Field>

        {/* 年级 */}
        <Field id="join-grade" label="年级" error={gradeError}>
          <Input
            id="join-grade"
            autoComplete="off"
            placeholder="2026 级"
            aria-describedby={descriptionId("join-grade", gradeError)}
            aria-invalid={Boolean(gradeError)}
            required
            {...register("grade")}
          />
        </Field>

        {/* 联系方式（TEL 紧凑前缀） */}
        <Field id="join-contact" label="联系方式" error={contactError}>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <InputGroupText>TEL</InputGroupText>
            </InputGroupAddon>
            <Input
              id="join-contact"
              autoComplete="tel"
              placeholder="微信、QQ 或手机号"
              aria-describedby={descriptionId("join-contact", contactError)}
              aria-invalid={Boolean(contactError)}
              required
              {...register("contact")}
            />
          </InputGroup>
        </Field>

        {/* 感兴趣的方向（Segmented 胶囊 / 物理滑块） */}
        <Field id="join-track" label="感兴趣的方向" error={trackError}>
          <div
            id="join-track"
            tabIndex={0}
            role="radiogroup"
            aria-label="感兴趣的技术方向"
            aria-describedby={descriptionId("join-track", trackError)}
            aria-invalid={Boolean(trackError)}
            onKeyDown={handleTrackKeyDown}
            className={cn(
              "join-track-capsules grid grid-cols-2 sm:grid-cols-3 gap-1.5 p-1 rounded-[var(--radius-xs)] border bg-[var(--surface-2)]/40 transition-colors focus-visible:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]",
              trackError ? "border-[var(--danger)]" : "border-[var(--border-control)]"
            )}
          >
            {tracks.map((track) => {
              const isSelected = currentTrack === track.value;
              return (
                <button
                  key={track.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  onClick={() => setValue("track", track.value, { shouldValidate: true })}
                  className={cn(
                    "group relative flex items-center justify-center py-1.5 px-2 rounded-[var(--radius-xs)] font-mono text-xs transition-all select-none cursor-pointer text-center",
                    isSelected
                      ? "text-[var(--accent)] font-semibold shadow-2xs"
                      : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--surface-2)]/70 active:scale-[0.96]"
                  )}
                >
                  {isSelected && (
                    <motion.span
                      layoutId={shouldReduceMotion ? undefined : "join-track-pill"}
                      className="absolute inset-0 rounded-[var(--radius-xs)] bg-[var(--surface)] border border-[var(--accent)]/50 z-0 shadow-2xs"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 truncate">{track.label}</span>
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register("track")} />
        </Field>

        {/* 选中其他方向时，平滑展开自定义方向输入框 */}
        <AnimatePresence>
          {currentTrack === "other" && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0, marginTop: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto", marginTop: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
              className="overflow-hidden join-form__wide"
            >
              <Field
                id="join-custom-track"
                label="自定义专业 / 技术方向"
                error={customTrackError}
                className="pt-0.5"
              >
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>DIR</InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="join-custom-track"
                    autoComplete="off"
                    placeholder="如：软件安全与管理方向"
                    aria-describedby={descriptionId("join-custom-track", customTrackError)}
                    aria-invalid={Boolean(customTrackError)}
                    required
                    {...register("customTrack")}
                  />
                </InputGroup>
              </Field>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 自我介绍 / 申请理由（含动态字数刻度尺） */}
        <Field
          className="join-form__wide"
          id="join-reason"
          label="自我介绍 / 申请理由"
          error={reasonError}
        >
          <Textarea
            id="join-reason"
            className="min-h-[140px] sm:min-h-[160px]"
            placeholder="简单介绍自己与申请理由（专业背景、编程经历、技术期望等）..."
            minLength={20}
            maxLength={1000}
            aria-describedby="join-reason-description"
            aria-invalid={Boolean(reasonError)}
            required
            {...register("reason")}
          />
          <LiveCharacterMeter count={reasonText.length} />
        </Field>

        {/* 蜜罐 */}
        <div className="join-form__honeypot" aria-hidden="true">
          <label htmlFor="join-website">个人网站</label>
          <input
            id="join-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            {...register("website")}
          />
        </div>
        <input type="hidden" {...register("turnstileToken")} />

        <Turnstile siteKey={siteKey} onTokenChange={onTokenChange} resetSignal={turnstileReset} />

        {/* 提交动作 */}
        <div className="join-form__actions join-form__wide pt-1">
          <Button
            id="join-submit"
            type="submit"
            className="w-full h-11 text-sm font-medium rounded-[var(--radius-xs)] transition-transform active:scale-[0.98] cursor-pointer"
            disabled={isSubmitting}
          >
            <Send size={15} aria-hidden="true" />
            <span>{isSubmitting ? "正在提交…" : "提交申请"}</span>
          </Button>

          {rootError ? (
            <p className="join-form__status join-form__status--error mt-2" role="status" aria-live="polite">
              {rootError}
            </p>
          ) : null}
        </div>
      </fieldset>
    </form>
  );
}
