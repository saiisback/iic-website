import type { CareerDraft } from "./types";

export interface CareerQuestion {
  id: keyof CareerDraft;
  label: string;
  hint?: string;
  optional?: boolean;
  maxLength: number;
  variant?: "role";
  exampleLabel?: string;
  exampleHint?: string;
  exampleMaxLength?: number;
}

export interface CareerSection {
  id: string;
  number: string;
  title: string;
  copy: string;
  questions: CareerQuestion[];
}

export const ROLE_EXAMPLE_MAX_LENGTH = 1200;
export const MIN_ANSWER_LENGTH = 10;

export const CAREER_SECTIONS: CareerSection[] = [
  {
    id: "why-iic",
    number: "02",
    title: "Why IIC",
    copy: "Tell us why this is the room you want to build in.",
    questions: [
      {
        id: "whyIic",
        label: "Why IIC and not the other clubs you could have joined?",
        maxLength: 1500,
      },
      {
        id: "innovationMeaning",
        label: "What does innovation mean to you? Give one real example.",
        maxLength: 1500,
      },
    ],
  },
  {
    id: "interests",
    number: "03",
    title: "Interests & proof of work",
    copy: "Show us what you have been curious enough to build.",
    questions: [
      {
        id: "talkAbout",
        label: "What could you talk about for 30 minutes with zero preparation?",
        maxLength: 1200,
      },
      {
        id: "proudWork",
        label:
          "Drop a link to something you made and are proud of (GitHub, Canva, video, writing, anything), with one line on why. If you have no link, describe it instead.",
        hint: "Optional. A link, or a short description of the work.",
        optional: true,
        maxLength: 1500,
      },
      {
        id: "roleType",
        label:
          "Are you an Idea Person, a Builder, or an Organizer? Give one quick example.",
        variant: "role",
        maxLength: 1200,
        exampleLabel: "One quick example",
        exampleHint: "Show the role in action with a specific moment or project.",
        exampleMaxLength: ROLE_EXAMPLE_MAX_LENGTH,
      },
    ],
  },
  {
    id: "character",
    number: "04",
    title: "Character",
    copy: "How you act when things get hard says more than a perfect record.",
    questions: [
      {
        id: "mistakeResponse",
        label:
          "You make a mistake that affects an event, and nobody has noticed. What do you do?",
        maxLength: 1500,
      },
      {
        id: "differentStyle",
        label:
          "Tell us about working with someone whose style was very different from yours. What happened?",
        maxLength: 1500,
      },
      {
        id: "learningStruggle",
        label:
          "Tell us about something you struggled to learn. How did you get past it?",
        maxLength: 1500,
      },
    ],
  },
  {
    id: "problems",
    number: "05",
    title: "Problems & contribution",
    copy: "Point at a real problem and show how you would move it.",
    questions: [
      {
        id: "campusProblem",
        label:
          "What is one problem you have noticed on campus or in our innovation ecosystem, and how would you solve it?",
        maxLength: 2000,
      },
      {
        id: "unlimitedProblem",
        label:
          "If you had an unlimited budget and no constraints of any kind, which problem (or up to two) would you solve, and how would you solve it?",
        hint: "Name up to two problems and sketch how you would approach each one.",
        maxLength: 2500,
      },
      {
        id: "contribution",
        label:
          "How do you want to contribute to IIC? Name one skill, one idea, or one role.",
        maxLength: 1200,
      },
    ],
  },
  {
    id: "future",
    number: "06",
    title: "Future & expectations",
    copy: "Where you are headed, and what you want this to become.",
    questions: [
      {
        id: "rememberedFor",
        label:
          "When you graduate, what do you want to be remembered for at IIC/BICEP?",
        maxLength: 1500,
      },
      {
        id: "expectations",
        label: "What do you expect from IIC, and what can we expect from you?",
        maxLength: 1500,
      },
    ],
  },
];

export function getSectionFieldIds(section: CareerSection): (keyof CareerDraft)[] {
  return section.questions.flatMap((question) =>
    question.variant === "role"
      ? [question.id, "roleExample" as keyof CareerDraft]
      : [question.id],
  );
}

