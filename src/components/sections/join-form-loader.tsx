"use client";

import dynamic from "next/dynamic";

import type { JoinFormInput } from "@/content/schema";

type JoinFormLoaderProps = {
  siteKey?: string;
  tracks: Array<{
    label: string;
    value: JoinFormInput["track"];
  }>;
};

const JoinForm = dynamic(
  () => import("@/components/sections/join-form").then((module) => module.JoinForm),
  {
    ssr: false,
    loading: () => (
      <div className="join-form__loading" role="status" aria-live="polite">
        <span className="sr-only">报名表单加载中</span>
      </div>
    ),
  },
);

export function JoinFormLoader(props: JoinFormLoaderProps) {
  return <JoinForm {...props} />;
}
