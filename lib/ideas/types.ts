export const IDEA_DOMAINS = [
  "AI/ML",
  "Software/SaaS",
  "Hardware/IoT",
  "Robotics",
  "Sustainability",
  "Health",
  "Education",
  "FinTech",
  "Other",
] as const;

export const PROTOTYPE_STATUSES = [
  "Idea",
  "Research",
  "Design",
  "Proof of Concept",
  "Working Prototype",
  "Testing",
  "Pilot Ready",
  "Launched",
] as const;

export const TEAM_STATUSES = [
  "Solo",
  "Have a Team",
  "Looking for Teammates",
] as const;

export const SUPPORT_OPTIONS = [
  "Mentorship",
  "Technical Guidance",
  "Funding",
  "Lab/Tools",
  "IP/Patent",
  "Business Model",
  "Teammates",
  "User Testing",
] as const;

export type IdeaDomain = (typeof IDEA_DOMAINS)[number];
export type PrototypeStatus = (typeof PROTOTYPE_STATUSES)[number];
export type TeamStatus = (typeof TEAM_STATUSES)[number];
export type SupportNeed = (typeof SUPPORT_OPTIONS)[number];

export interface IdeaDraft {
  fullName: string;
  usn: string;
  email: string;
  projectName: string;
  summary: string;
  problem: string;
  solution: string;
  domain: string;
  prototypeStatus: string;
  teamStatus: string;
  supportNeeds: string[];
  projectUrl: string;
  consent: boolean;
  website: string;
}

export interface ValidIdeaSubmission extends Omit<
  IdeaDraft,
  "domain" | "prototypeStatus" | "teamStatus" | "supportNeeds" | "website"
> {
  domain: IdeaDomain;
  prototypeStatus: PrototypeStatus;
  teamStatus: TeamStatus;
  supportNeeds: SupportNeed[];
}

export type IdeaFieldErrors = Partial<Record<keyof IdeaDraft, string>>;
export type ValidationResult =
  | { ok: true; value: ValidIdeaSubmission }
  | { ok: false; fieldErrors: IdeaFieldErrors };

export const EMPTY_IDEA_DRAFT: IdeaDraft = {
  fullName: "",
  usn: "",
  email: "",
  projectName: "",
  summary: "",
  problem: "",
  solution: "",
  domain: "",
  prototypeStatus: "",
  teamStatus: "",
  supportNeeds: [],
  projectUrl: "",
  consent: false,
  website: "",
};
