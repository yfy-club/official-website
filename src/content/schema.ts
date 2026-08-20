import { z } from "zod";

export const trackSlugSchema = z.enum([
  "ai",
  "software",
  "database",
  "cloud-iot",
  "industrial",
]);

const stageSchema = z.object({
  label: z.string().min(2),
  items: z.array(z.string().min(2)).min(3).max(5),
});

export const trackMetricSchema = z.object({
  code: z.string(),
  label: z.string(),
  value: z.number(),
  suffix: z.string().optional(),
  detail: z.string(),
});

export const trackDeepFocusSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  techTags: z.array(z.string()),
  highlight: z.string(),
});

export const trackCurriculumModuleSchema = z.object({
  stage: z.string(),
  title: z.string(),
  objective: z.string(),
  coreTopics: z.array(z.string()),
  experiment: z.string(),
  reviewStandard: z.string(),
});

export const trackSchema = z.object({
  slug: trackSlugSchema,
  index: z.string().regex(/^0[1-5]$/),
  nameZh: z.string().min(2),
  nameEn: z.string().min(2),
  tagline: z.string().min(10).max(40),
  positioning: z.string().min(30),
  metrics: z.array(trackMetricSchema).optional(),
  stack: z.object({
    languages: z.array(z.string()).min(1),
    frameworks: z.array(z.string()).min(1),
    engineering: z.array(z.string()).min(1),
    toolchain: z.array(z.string()).optional(),
  }),
  deepFocus: z.array(trackDeepFocusSchema).optional(),
  curriculumModules: z.array(trackCurriculumModuleSchema).optional(),
  roadmap: z.object({
    freshman: stageSchema,
    sophomore: stageSchema,
    junior: z.object({
      employment: stageSchema,
      postgrad: stageSchema,
    }),
  }),
  goal: z.string().min(2),
  relatedWorkSlugs: z.array(z.string()).default([]),
  relatedAwardIds: z.array(z.string()).default([]),
});

export const workArchitectureTierSchema = z.object({
  code: z.string(),
  name: z.string(),
  role: z.string(),
  techTags: z.array(z.string()),
  features: z.array(z.string()).optional(),
});

export const workDataflowStepSchema = z.object({
  step: z.string(),
  title: z.string(),
  detail: z.string(),
  protocol: z.string().optional(),
});

export const workArchitectureSchema = z.object({
  summary: z.string().optional(),
  tiers: z.array(workArchitectureTierSchema).min(2),
  dataflow: z.array(workDataflowStepSchema).optional(),
});

export const workDecisionSchema = z.object({
  what: z.string(),
  why: z.string(),
  tag: z.string().optional(),
  problem: z.string().optional(),
  solution: z.string().optional(),
  impact: z.string().optional(),
  tradeoff: z.string().optional(),
  highlight: z.string().optional(),
});

export const workMetricSchema = z.object({
  label: z.string().min(2),
  value: z.string().min(1),
  description: z.string().optional(),
  tag: z.string().optional(),
  status: z.enum(["verified", "realtime", "benchmark", "hardened"]).optional(),
  progress: z.number().min(0).max(100).optional(),
});

export const workPrincipleSchema = z.object({
  code: z.string(),
  name: z.string(),
  category: z.string(),
  summary: z.string(),
  mechanism: z.string(),
  codeSnippet: z.string().optional(),
  formula: z.string().optional(),
  keyBenefit: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const workSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  nameZh: z.string().min(2),
  nameEn: z.string().optional(),
  status: z.enum(["已上线", "在研", "已结项"]),
  tagline: z.string().min(10),
  liveUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  period: z.string().optional(),
  trackSlugs: z.array(trackSlugSchema).default([]),
  image: z.string().startsWith("/images/works/").optional(),
  logo: z.string().startsWith("/images/works/").optional(),
  stackSummary: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  detail: z
    .object({
      problem: z.array(z.string()).min(2),
      stack: z.record(z.string(), z.array(z.string())),
      principles: z.array(workPrincipleSchema).optional(),
      architecture: workArchitectureSchema.optional(),
      decisions: z.array(workDecisionSchema).min(3),
      metrics: z.array(workMetricSchema).min(2).optional(),
      tradeoffs: z
        .array(
          z.object({
            title: z.string().min(2),
            detail: z.string().min(6),
          }),
        )
        .min(2)
        .optional(),
      evidence: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
      limits: z.array(z.string()).optional(),
      demoAccounts: z
        .array(z.object({
          role: z.string().min(2),
          account: z.string().min(2),
          password: z.string().min(6),
          access: z.string().min(4),
        }))
        .min(1)
        .optional(),
      shots: z
        .discriminatedUnion("type", [
          z.object({
            type: z.literal("single"),
            image: z.string().startsWith("/images/works/"),
            alt: z.string().min(2),
          }),
          z.object({
            type: z.literal("comparison"),
            dark: z.string().startsWith("/images/works/"),
            light: z.string().startsWith("/images/works/"),
            alt: z.string().min(2),
          }),
        ])
        .optional(),
      galleryMode: z.enum(["grid", "tour"]).default("grid").optional(),
      gallery: z
        .array(z.object({
          label: z.string().min(2),
          description: z.string().min(6),
          group: z.string().min(2).optional(),
          shot: z.discriminatedUnion("type", [
            z.object({
              type: z.literal("single"),
              image: z.string().startsWith("/images/works/"),
              alt: z.string().min(2),
            }),
            z.object({
              type: z.literal("comparison"),
              dark: z.string().startsWith("/images/works/"),
              light: z.string().startsWith("/images/works/"),
              alt: z.string().min(2),
            }),
          ]),
        }))
        .optional(),
    })
    .optional(),
});

export const awardSchema = z.object({
  id: z.string().min(1),
  competition: z.string().min(2),
  level: z.enum(["国家级", "省级", "校级"]),
  result: z.string().min(2),
  year: z.string().regex(/^\d{4}$/),
  image: z.string().startsWith("/images/certs/").optional(),
  description: z.string().optional(),
  trackSlugs: z.array(trackSlugSchema).default([]),
});

export const clubSchema = z.object({
  name: z.string().min(2),
  nameEn: z.string().min(2),
  abbreviation: z.string().min(2),
  slogan: z.string().min(2),
  subSlogan: z.string().min(2),
  founded: z.number().int().min(2000),
  affiliation: z.string().min(2),
  advisor: z.string().min(2),
  githubUrl: z.url(),
  values: z.array(z.string()).min(3),
  motto: z.string().min(2),
  origin: z.string().min(10),
  platform: z.string().min(2),
  memberCount: z.number().int().positive(),
  annualAwards: z.string().min(2),
  qqGroup: z.string().regex(/^\d{6,12}$/),
});

export const timelineItemSchema = z.object({
  year: z.string().min(4),
  title: z.string().min(2),
  description: z.string().min(10),
  isGap: z.boolean().optional(),
});

export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
});

export const joinFormSchema = z.object({
  name: z.string().trim().min(2, "姓名至少需要 2 个字符").max(20, "姓名不能超过 20 个字符"),
  studentId: z.string().trim().regex(/^\d{8,20}$/, "请输入 8 至 20 位数字学号"),
  major: z.string().trim().min(2, "请输入专业班级").max(40, "专业班级不能超过 40 个字符"),
  grade: z.string().trim().min(2, "请输入年级").max(20, "年级不能超过 20 个字符"),
  contact: z.string().trim().min(5, "请输入可联系到你的微信、QQ 或手机号").max(40, "联系方式不能超过 40 个字符"),
  track: z.enum(trackSlugSchema.options, { error: "请选择一个志向方向" }),
  reason: z.string().trim().min(20, "申请理由至少需要 20 个字符").max(1000, "申请理由不能超过 1000 个字符"),
  website: z.string().trim().max(0, "请勿填写此字段").optional(),
  turnstileToken: z.string().trim().max(2048, "人机验证令牌无效").optional(),
});

export const mechanismSchema = z.object({
  index: z.string().optional(),
  title: z.string().min(2),
  detail: z.string().min(10),
  tag: z.string().optional(),
});

export type Stage = z.infer<typeof stageSchema>;
export type TrackCurriculumModule = z.infer<typeof trackCurriculumModuleSchema>;
export type TrackDeepFocusItem = z.infer<typeof trackDeepFocusSchema>;
export type Track = z.infer<typeof trackSchema>;
export type Work = z.infer<typeof workSchema>;
export type WorkPrinciple = z.infer<typeof workPrincipleSchema>;
export type WorkArchitectureTier = z.infer<typeof workArchitectureTierSchema>;
export type WorkDataflowStep = z.infer<typeof workDataflowStepSchema>;
export type WorkArchitecture = z.infer<typeof workArchitectureSchema>;
export type WorkDecision = z.infer<typeof workDecisionSchema>;
export type WorkMetric = z.infer<typeof workMetricSchema>;
export type Award = z.infer<typeof awardSchema>;
export type Club = z.infer<typeof clubSchema>;
export type TimelineItem = z.infer<typeof timelineItemSchema>;
export type Mechanism = z.infer<typeof mechanismSchema>;
export type Faq = z.infer<typeof faqSchema>;
export type JoinFormInput = z.infer<typeof joinFormSchema>;
