"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";

import { Stamp } from "@/components/motion/stamp";
import { Turnstile } from "@/components/sections/turnstile";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupText } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { joinFormSchema, type JoinFormInput } from "@/content/schema";

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

function descriptionId(id: string, message?: string) {
  return message ? `${id}-description` : undefined;
}

function isJoinResponse(value: unknown): value is JoinResponse {
  return typeof value === "object" && value !== null;
}

export function JoinForm({ siteKey, tracks }: JoinFormProps) {
  const [submitted, setSubmitted] = useState(false);
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
      grade: "",
      major: "",
      name: "",
      reason: "",
      studentId: "",
      turnstileToken: "",
      website: "",
    },
  });

  const onTokenChange = useCallback((token: string) => {
    setValue("turnstileToken", token, { shouldValidate: false });
  }, [setValue]);

  const onSubmit = handleSubmit(async (values) => {
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

      reset();
      setSubmitted(true);
    } catch {
      setTurnstileReset((value) => value + 1);
      setError("root.server", { message: "网络连接失败，请检查网络后重试。" });
    }
  }, (validationErrors) => {
    const ids: Array<[keyof JoinFormInput, string]> = [
      ["name", "join-name"],
      ["studentId", "join-student-id"],
      ["major", "join-major"],
      ["grade", "join-grade"],
      ["contact", "join-contact"],
      ["track", "join-track"],
      ["reason", "join-reason"],
    ];
    const firstInvalid = ids.find(([field]) => validationErrors[field]);
    if (!firstInvalid) return;
    window.requestAnimationFrame(() => {
      document.getElementById(firstInvalid[1])?.scrollIntoView({ block: "center", behavior: "auto" });
    });
  });

  const nameError = errors.name?.message;
  const studentIdError = errors.studentId?.message;
  const majorError = errors.major?.message;
  const gradeError = errors.grade?.message;
  const contactError = errors.contact?.message;
  const trackError = errors.track?.message;
  const reasonError = errors.reason?.message;
  const rootError = errors.root?.server?.message;

  const currentTrack = watch("track") || "";
  const reasonText = watch("reason") || "";

  return (
    <form className="join-form" noValidate onSubmit={onSubmit} aria-busy={isSubmitting} aria-labelledby="join-form-title">
      <fieldset className="join-form__grid" disabled={isSubmitting || submitted}>
        <legend className="sr-only">报名信息</legend>
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
              placeholder="8-20 位数字学号"
              aria-describedby={descriptionId("join-student-id", studentIdError)}
              aria-invalid={Boolean(studentIdError)}
              required
              {...register("studentId")}
            />
          </InputGroup>
        </Field>
        <Field id="join-major" label="专业班级" error={majorError}>
          <Input
            id="join-major"
            autoComplete="organization-title"
            placeholder="如：软件工程 2401 班"
            aria-describedby={descriptionId("join-major", majorError)}
            aria-invalid={Boolean(majorError)}
            required
            {...register("major")}
          />
        </Field>
        <Field id="join-grade" label="年级" error={gradeError}>
          <Input
            id="join-grade"
            autoComplete="off"
            placeholder="如：2026 级"
            aria-describedby={descriptionId("join-grade", gradeError)}
            aria-invalid={Boolean(gradeError)}
            required
            {...register("grade")}
          />
        </Field>
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
        <Field id="join-track" label="感兴趣的方向" error={trackError}>
          <Select
            value={currentTrack || undefined}
            onValueChange={(val) => {
              setValue("track", val as JoinFormInput["track"], { shouldValidate: true });
            }}
            disabled={isSubmitting || submitted}
          >
            <SelectTrigger
              id="join-track"
              error={Boolean(trackError)}
              aria-describedby={descriptionId("join-track", trackError)}
              aria-invalid={Boolean(trackError)}
            >
              <SelectValue placeholder="请选择感兴趣的技术方向" />
            </SelectTrigger>
            <SelectContent>
              {tracks.map((track) => (
                <SelectItem key={track.value} value={track.value}>
                  {track.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          className="join-form__wide"
          id="join-reason"
          label="自我介绍 / 申请理由"
          hint={`${reasonText.length}/1000 字（至少 20 字）`}
          error={reasonError}
        >
          <Textarea
            id="join-reason"
            placeholder="简单介绍自己与申请理由..."
            minLength={20}
            maxLength={1000}
            aria-describedby="join-reason-description"
            aria-invalid={Boolean(reasonError)}
            required
            {...register("reason")}
          />
        </Field>

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

        <div className="join-form__actions join-form__wide">
          {submitted ? (
            <Stamp message="报名已提交，我们会尽快与你联系。" />
          ) : (
            <Button id="join-submit" type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting}>
              <Send size={16} aria-hidden="true" />
              <span>{isSubmitting ? "正在提交…" : "立即提交申请"}</span>
            </Button>
          )}
          {rootError && !submitted ? (
            <p className="join-form__status join-form__status--error" role="status" aria-live="polite">
              {rootError}
            </p>
          ) : null}
        </div>
      </fieldset>
    </form>
  );
}
