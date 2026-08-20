import { awardsRaw } from "./awards";
export { competitionOverview } from "./awards";
export { advisorProfile, annualReport, culturePhotos, mechanisms, memberLadder, mentorship } from "./about";
export { joinCriteria, joinProcess, memberVoices, type MemberVoice } from "./join";
import { clubRaw } from "./club";
import { faqRaw } from "./faq";
import {
  awardSchema,
  clubSchema,
  faqSchema,
  timelineItemSchema,
  trackSchema,
  workSchema,
} from "./schema";
import { timelineRaw } from "./timeline";
import { trackDeepDives } from "./track-deep-dives";
import { tracksRaw } from "./tracks";
import { workDeepDives } from "./work-deep-dives";
import { worksRaw } from "./works";

export const club = clubSchema.parse(clubRaw);
export const tracks = trackSchema.array().parse(tracksRaw);
export { trackDeepDives };
export const works = workSchema.array().parse(
  worksRaw.map((work) => {
    const deepDive = workDeepDives[work.slug];
    if (!deepDive || !work.detail) return work;
    return {
      ...work,
      detail: {
        ...work.detail,
        ...deepDive,
      },
    };
  }),
);
export const awards = awardSchema.array().parse(awardsRaw);
export const timeline = timelineItemSchema.array().parse(timelineRaw);
export const faq = faqSchema.array().parse(faqRaw);

export type {
  Award,
  Club,
  Faq,
  JoinFormInput,
  Mechanism,
  Stage,
  TimelineItem,
  Track,
  TrackConcept,
  TrackCurriculumModule,
  TrackDeepDive,
  TrackDeepFocusItem,
  Work,
} from "./schema";
