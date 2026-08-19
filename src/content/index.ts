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
import { tracksRaw } from "./tracks";
import { worksRaw } from "./works";

export const club = clubSchema.parse(clubRaw);
export const tracks = trackSchema.array().parse(tracksRaw);
export const works = workSchema.array().parse(worksRaw);
export const awards = awardSchema.array().parse(awardsRaw);
export const timeline = timelineItemSchema.array().parse(timelineRaw);
export const faq = faqSchema.array().parse(faqRaw);
