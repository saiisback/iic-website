export const IDEA_DOMAINS = [
  "AI / Machine Learning",
  "FinTech",
  "HealthTech",
  "EdTech",
  "AgriTech",
  "SaaS / Developer Tools",
  "Robotics / IoT / Hardware",
  "Cybersecurity",
  "ClimateTech / Sustainability",
  "E-commerce / Consumer Tech",
  "Social Impact",
  "Other",
] as const;

export const PRODUCT_CATEGORIES = [
  "B2B",
  "B2C",
  "B2B2C",
  "Open Source",
  "Research",
  "Non-profit / Social Impact",
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

export const TEAM_SIZES = ["1", "2", "3", "4", "5", "6+"] as const;

export const COLLABORATOR_CHOICES = ["Yes", "No"] as const;

export const SUPPORT_OPTIONS = [
  "Technical mentorship",
  "Industry mentorship",
  "Co-founders / Teammates",
  "Infrastructure / Lab resources",
  "Cloud credits / Tools",
  "User testing / Market access",
  "Incubation",
  "Funding / Investor connections",
  "Business development / Partnerships",
  "IP / Patent guidance",
] as const;

export type IdeaDomain = (typeof IDEA_DOMAINS)[number];
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
export type PrototypeStatus = (typeof PROTOTYPE_STATUSES)[number];
export type TeamStatus = (typeof TEAM_STATUSES)[number];
export type TeamSize = (typeof TEAM_SIZES)[number];
export type CollaboratorChoice = (typeof COLLABORATOR_CHOICES)[number];
export type SupportNeed = (typeof SUPPORT_OPTIONS)[number];

export interface IdeaDraft {
  fullName: string;
  usn: string;
  email: string;
  portfolioUrl: string;
  phone: string;
  projectName: string;
  domain: string;
  productCategory: string;
  problem: string;
  solution: string;
  prototypeStatus: string;
  traction: string;
  teamStatus: string;
  teamSize: string;
  teamRoles: string;
  lookingForCollaborators: string;
  collaboratorNeeds: string;
  businessPotential: string;
  supportNeeds: string[];
  nextMilestone: string;
  fundingEstimate: string;
  githubUrl: string;
  demoUrl: string;
  websiteUrl: string;
  pitchDeckUrl: string;
  consentReview: boolean;
  consentShare: boolean;
  consentFeature: boolean;
  website: string;
}

export interface ValidIdeaSubmission extends Omit<
  IdeaDraft,
  | "domain"
  | "productCategory"
  | "prototypeStatus"
  | "teamStatus"
  | "teamSize"
  | "lookingForCollaborators"
  | "supportNeeds"
  | "consentReview"
  | "consentShare"
  | "consentFeature"
  | "website"
> {
  domain: IdeaDomain;
  productCategory: ProductCategory;
  prototypeStatus: PrototypeStatus;
  teamStatus: TeamStatus;
  teamSize: TeamSize;
  lookingForCollaborators: CollaboratorChoice;
  supportNeeds: SupportNeed[];
  consentReview: true;
  consentShare: true;
  consentFeature: true;
}

export type IdeaFieldErrors = Partial<Record<keyof IdeaDraft, string>>;
export type ValidationResult =
  | { ok: true; value: ValidIdeaSubmission }
  | { ok: false; fieldErrors: IdeaFieldErrors };

export const EMPTY_IDEA_DRAFT: IdeaDraft = {
  fullName: "",
  usn: "",
  email: "",
  portfolioUrl: "",
  phone: "",
  projectName: "",
  domain: "",
  productCategory: "",
  problem: "",
  solution: "",
  prototypeStatus: "",
  traction: "",
  teamStatus: "",
  teamSize: "",
  teamRoles: "",
  lookingForCollaborators: "",
  collaboratorNeeds: "",
  businessPotential: "",
  supportNeeds: [],
  nextMilestone: "",
  fundingEstimate: "",
  githubUrl: "",
  demoUrl: "",
  websiteUrl: "",
  pitchDeckUrl: "",
  consentReview: false,
  consentShare: false,
  consentFeature: false,
  website: "",
};
