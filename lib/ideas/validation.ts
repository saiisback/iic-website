import {
  IDEA_DOMAINS,
  PROTOTYPE_STATUSES,
  SUPPORT_OPTIONS,
  TEAM_STATUSES,
  type IdeaDomain,
  type IdeaFieldErrors,
  type IdeaDraft,
  type PrototypeStatus,
  type SupportNeed,
  type TeamStatus,
  type ValidIdeaSubmission,
  type ValidationResult,
} from "./types";

const USN_PATTERN = /^[A-Z0-9-]{6,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function validateIdeaSubmission(input: unknown): ValidationResult {
  const source =
    typeof input === "object" && input !== null && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const fullName = readString(source, "fullName");
  const usn = readString(source, "usn").toUpperCase();
  const email = readString(source, "email");
  const projectName = readString(source, "projectName");
  const summary = readString(source, "summary");
  const problem = readString(source, "problem");
  const solution = readString(source, "solution");
  const domain = readString(source, "domain");
  const prototypeStatus = readString(source, "prototypeStatus");
  const teamStatus = readString(source, "teamStatus");
  const projectUrl = readString(source, "projectUrl");
  const website = readString(source, "website");
  const submittedSupportNeeds = Array.isArray(source.supportNeeds)
    ? source.supportNeeds
    : [];
  const supportNeeds = [...new Set(submittedSupportNeeds)].filter(
    (value): value is string => typeof value === "string",
  );
  const errors: IdeaFieldErrors = {};

  if (!hasLength(fullName, 2, 80)) errors.fullName = "Enter a name between 2 and 80 characters.";
  if (!USN_PATTERN.test(usn)) errors.usn = "Enter a valid USN.";
  if (!EMAIL_PATTERN.test(email) || email.length > 160) errors.email = "Enter a valid email address.";
  if (!hasLength(projectName, 2, 120)) errors.projectName = "Enter a project name between 2 and 120 characters.";
  if (!hasLength(summary, 10, 180)) errors.summary = "Enter a summary between 10 and 180 characters.";
  if (!hasLength(problem, 20, 1500)) errors.problem = "Enter a problem statement between 20 and 1,500 characters.";
  if (!hasLength(solution, 20, 2500)) errors.solution = "Enter a solution between 20 and 2,500 characters.";
  if (!isMember(IDEA_DOMAINS, domain)) errors.domain = "Choose a valid domain.";
  if (!isMember(PROTOTYPE_STATUSES, prototypeStatus)) errors.prototypeStatus = "Choose a valid prototype status.";
  if (!isMember(TEAM_STATUSES, teamStatus)) errors.teamStatus = "Choose a valid team status.";
  if (!supportNeeds.length || supportNeeds.some((value) => !isMember(SUPPORT_OPTIONS, value))) {
    errors.supportNeeds = "Choose at least one valid support need.";
  }
  if (projectUrl.length > 500 || !isHttpUrl(projectUrl)) errors.projectUrl = "Enter a valid HTTP or HTTPS URL.";
  if (source.consent !== true) errors.consent = "Consent is required.";
  if (website) errors.website = "Unable to submit this form.";

  if (Object.keys(errors).length > 0) return { ok: false, fieldErrors: errors };

  return {
    ok: true,
    value: {
      fullName,
      usn,
      email,
      projectName,
      summary,
      problem,
      solution,
      domain: domain as IdeaDomain,
      prototypeStatus: prototypeStatus as PrototypeStatus,
      teamStatus: teamStatus as TeamStatus,
      supportNeeds: supportNeeds as SupportNeed[],
      projectUrl,
      consent: true,
    } satisfies ValidIdeaSubmission,
  };
}
