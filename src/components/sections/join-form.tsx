"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";

import { Stamp } from "@/components/motion/stamp";
import { Turnstile } from "@/components/sections/turnstile";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
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
  });

  const nameError = errors.name?.message;
  const studentIdError = errors.studentId?.message;
  const majorError = errors.major?.message;
  const gradeError = errors.grade?.message;
  const contactError = errors.contact?.message;
  const trackError = errors.track?.message;
  const reasonError = errors.reason?.message;
  const rootError = errors.root?.server?.message;

  return (
    <form className="join-form" noValidate onSubmit={onSubmit} aria-busy={isSubmitting}>
      <fieldset className="join-form__grid" disabled={isSubmitting || submitted}>
        <legend className="sr-only">报名信息</legend>
        <Field id="join-name" label="姓名" error={nameError}>
          <Input
            id="join-name"
            autoComplete="name"
            aria-describedby={descriptionId("join-name", nameError)}
            aria-invalid={Boolean(nameError)}
            required
            {...register("name")}
          />
        </Field>
        <Field id="join-student-id" label="学号" error={studentIdError}>
          <Input
            id="join-student-id"
            autoComplete="off"
            inputMode="numeric"
            pattern="[0-9]*"
            aria-describedby={descriptionId("join-student-id", studentIdError)}
            aria-invalid={Boolean(studentIdError)}
            required
            {...register("studentId")}
          />
        </Field>
        <Field id="join-major" label="专业班级" error={majorError}>
          <Input
            id="join-major"
            autoComplete="organization-title"
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
        <Field id="join-contact" label="联系方式" hint="微信、QQ 或手机号均可" error={contactError}>
          <Input
            id="join-contact"
            autoComplete="tel"
            aria-describedby="join-contact-description"
            aria-invalid={Boolean(contactError)}
            required
            {...register("contact")}
          />
        </Field>
        <Field id="join-track" label="志向方向" error={trackError}>
          <Select
            id="join-track"
            defaultValue=""
            aria-describedby={descriptionId("join-track", trackError)}
            aria-invalid={Boolean(trackError)}
            required
            {...register("track")}
          >
            <option value="" disabled>请选择志向方向</option>
            {tracks.map((track) => <option key={track.value} value={track.value}>{track.label}</option>)}
          </Select>
        </Field>
        <Field className="join-form__wide" id="join-reason" label="申请理由" hint="至少 20 个字符" error={reasonError}>
          <Textarea
            id="join-reason"
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
            <Button id="join-submit" type="submit" disabled={isSubmitting}>
              <Send size={16} aria-hidden="true" />
              {isSubmitting ? "正在提交…" : "提交报名"}
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
