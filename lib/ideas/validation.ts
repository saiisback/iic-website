import {
  COLLABORATOR_CHOICES,
  IDEA_DOMAINS,
  PRODUCT_CATEGORIES,
  PROTOTYPE_STATUSES,
  SUPPORT_OPTIONS,
  TEAM_SIZES,
  TEAM_STATUSES,
  type CollaboratorChoice,
  type IdeaDomain,
  type IdeaDraft,
  type IdeaFieldErrors,
  type ProductCategory,
  type PrototypeStatus,
  type SupportNeed,
  type TeamSize,
  type TeamStatus,
  type ValidIdeaSubmission,
  type ValidationResult,
} from "./types";

const USN_PATTERN = /^[A-Z0-9-]{6,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9][0-9\s()-]{5,24}$/;

function readString(input: Record<string, unknown>, key: keyof IdeaDraft): string {
  const value = input[key];
  return typeof value === "string" ? value.trim() : "";
}

function isMember<T extends readonly string[]>(
  values: T,
  value: string,
): value is T[number] {
  return values.includes(value as T[number]);
}

function hasLength(value: string, min: number, max: number): boolean {
  return value.length >= min && value.length <= max;
}

function isHttpUrl(value: string): boolean {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidPhone(value: string): boolean {
  if (!PHONE_PATTERN.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function checkOptionalUrl(
  value: string,
  errors: IdeaFieldErrors,
  field: keyof IdeaDraft,
): void {
  if (value.length > 500 || !isHttpUrl(value)) {
    errors[field] = "Enter a valid HTTP or HTTPS URL (or leave it empty).";
  }
}

export function validateIdeaSubmission(input: unknown): ValidationResult {
  const source =
    typeof input === "object" && input !== null && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const fullName = readString(source, "fullName");
  const usn = readString(source, "usn").toUpperCase();
  const email = readString(source, "email");
  const portfolioUrl = readString(source, "portfolioUrl");
  const phone = readString(source, "phone");
  const projectName = readString(source, "projectName");
  const domain = readString(source, "domain");
  const productCategory = readString(source, "productCategory");
  const problem = readString(source, "problem");
  const solution = readString(source, "solution");
  const prototypeStatus = readString(source, "prototypeStatus");
  const traction = readString(source, "traction");
  const teamStatus = readString(source, "teamStatus");
  const teamSize = readString(source, "teamSize");
  const teamRoles = readString(source, "teamRoles");
  const lookingForCollaborators = readString(source, "lookingForCollaborators");
  const collaboratorNeeds = readString(source, "collaboratorNeeds");
  const businessPotential = readString(source, "businessPotential");
  const nextMilestone = readString(source, "nextMilestone");
  const fundingEstimate = readString(source, "fundingEstimate");
  const githubUrl = readString(source, "githubUrl");
  const demoUrl = readString(source, "demoUrl");
  const websiteUrl = readString(source, "websiteUrl");
  const pitchDeckUrl = readString(source, "pitchDeckUrl");
  const website = readString(source, "website");
  const submittedSupportNeeds = Array.isArray(source.supportNeeds)
    ? source.supportNeeds
    : [];
  const supportNeeds = [...new Set(submittedSupportNeeds)].filter(
    (value): value is string => typeof value === "string",
  );
  const errors: IdeaFieldErrors = {};

  // 01. Builder information
  if (!hasLength(fullName, 2, 80)) errors.fullName = "Enter a name between 2 and 80 characters.";
  if (!USN_PATTERN.test(usn)) errors.usn = "Enter a valid USN.";
  if (!EMAIL_PATTERN.test(email) || email.length > 160) errors.email = "Enter a valid email address.";
  checkOptionalUrl(portfolioUrl, errors, "portfolioUrl");
  if (!isValidPhone(phone)) errors.phone = "Enter a valid phone number (7-15 digits).";

  // 02. Project classification
  if (!hasLength(projectName, 2, 120)) errors.projectName = "Enter a project name between 2 and 120 characters.";
  if (!isMember(IDEA_DOMAINS, domain)) errors.domain = "Choose a valid domain.";
  if (!isMember(PRODUCT_CATEGORIES, productCategory)) errors.productCategory = "Choose a product category.";

  // 03-04. Problem and product
  if (!hasLength(problem, 20, 1500)) errors.problem = "Describe the problem in 20 to 1,500 characters.";
  if (!hasLength(solution, 20, 2500)) errors.solution = "Describe the product in 20 to 2,500 characters.";

  // 05. Development & validation
  if (!isMember(PROTOTYPE_STATUSES, prototypeStatus)) errors.prototypeStatus = "Choose a valid development stage.";
  if (!hasLength(traction, 20, 1500)) errors.traction = "Describe your progress in 20 to 1,500 characters.";

  // 06. Team & collaboration
  if (!isMember(TEAM_STATUSES, teamStatus)) errors.teamStatus = "Choose a valid team status.";
  if (!isMember(TEAM_SIZES, teamSize)) errors.teamSize = "Choose the number of team members.";
  if (!hasLength(teamRoles, 5, 1500)) errors.teamRoles = "Describe the team roles in 5 to 1,500 characters.";
  if (!isMember(COLLABORATOR_CHOICES, lookingForCollaborators)) {
    errors.lookingForCollaborators = "Tell us whether you are looking for collaborators.";
  }
  if (
    lookingForCollaborators === "Yes" && !hasLength(collaboratorNeeds, 5, 800)
  ) {
    errors.collaboratorNeeds = "Tell us which skills or roles you need (5-800 characters).";
  } else if (collaboratorNeeds.length > 800) {
    errors.collaboratorNeeds = "Keep this under 800 characters.";
  }

  // 07. Business & sustainability
  if (!hasLength(businessPotential, 20, 1500)) errors.businessPotential = "Describe the long-term potential in 20 to 1,500 characters.";

  // 08. Roadmap & support requirements
  if (!supportNeeds.length || supportNeeds.some((value) => !isMember(SUPPORT_OPTIONS, value))) {
    errors.supportNeeds = "Choose at least one valid support need.";
  }
  if (!hasLength(nextMilestone, 10, 1000)) errors.nextMilestone = "Describe your next milestone in 10 to 1,000 characters.";
  if (fundingEstimate.length > 100) errors.fundingEstimate = "Keep this under 100 characters.";

  // 09. Project links
  checkOptionalUrl(githubUrl, errors, "githubUrl");
  checkOptionalUrl(demoUrl, errors, "demoUrl");
  checkOptionalUrl(websiteUrl, errors, "websiteUrl");
  checkOptionalUrl(pitchDeckUrl, errors, "pitchDeckUrl");

  // Consent
  if (source.consentReview !== true) errors.consentReview = "Please agree so we can review your submission.";
  if (source.consentShare !== true) errors.consentShare = "Please agree so we can share your project details.";
  if (source.consentFeature !== true) errors.consentFeature = "Please agree so we can feature your project.";
  if (website) errors.website = "Unable to submit this form.";

  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };

  return {
    ok: true,
    value: {
      fullName,
      usn,
      email,
      portfolioUrl,
      phone,
      projectName,
      domain: domain as IdeaDomain,
      productCategory: productCategory as ProductCategory,
      problem,
      solution,
      prototypeStatus: prototypeStatus as PrototypeStatus,
      traction,
      teamStatus: teamStatus as TeamStatus,
      teamSize: teamSize as TeamSize,
      teamRoles,
      lookingForCollaborators: lookingForCollaborators as CollaboratorChoice,
      collaboratorNeeds,
      businessPotential,
      supportNeeds: supportNeeds as SupportNeed[],
      nextMilestone,
      fundingEstimate,
      githubUrl,
      demoUrl,
      websiteUrl,
      pitchDeckUrl,
      consentReview: true,
      consentShare: true,
      consentFeature: true,
    } satisfies ValidIdeaSubmission,
  };
}
