export const CAREER_ROLE_TYPES = [
  "Idea Person",
  "Builder",
  "Organizer",
] as const;

export type CareerRoleType = (typeof CAREER_ROLE_TYPES)[number];

export interface CareerDraft {
  fullName: string;
  usn: string;
  email: string;
  whyIic: string;
  innovationMeaning: string;
  talkAbout: string;
  proudWork: string;
  roleType: string;
  roleExample: string;
  mistakeResponse: string;
  differentStyle: string;
  learningStruggle: string;
  campusProblem: string;
  unlimitedProblem: string;
  contribution: string;
  rememberedFor: string;
  expectations: string;
  consent: boolean;
  website: string;
}

export interface ValidCareerSubmission extends Omit<
  CareerDraft,
  "roleType" | "website"
> {
  roleType: CareerRoleType;
}

export type CareerFieldErrors = Partial<Record<keyof CareerDraft, string>>;
export type ValidationResult =
  | { ok: true; value: ValidCareerSubmission }
  | { ok: false; fieldErrors: CareerFieldErrors };

export const EMPTY_CAREER_DRAFT: CareerDraft = {
  fullName: "",
  usn: "",
  email: "",
  whyIic: "",
  innovationMeaning: "",
  talkAbout: "",
  proudWork: "",
  roleType: "",
  roleExample: "",
  mistakeResponse: "",
  differentStyle: "",
  learningStruggle: "",
  campusProblem: "",
  unlimitedProblem: "",
  contribution: "",
  rememberedFor: "",
  expectations: "",
  consent: false,
  website: "",
};
