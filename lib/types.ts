export type TierCode = "INITIATE" | "ENGINEER" | "ARCHITECT" | "ORACLE";

export type Tier = {
  code: TierCode;
  index: 1 | 2 | 3 | 4;
  xpFloor: number;
  xpCeil: number;
};

export type Member = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  memberSince: string;
  tier: Tier;
  xp: number;
  stats: {
    attended: number;
    hours: number;
    streak: number;
  };
};

export type EventStatus = "upcoming" | "attended";

export type EventItem = {
  id: string;
  code: string;
  title: string;
  subtitleJa: string;
  date: string;
  location: string;
  xpReward: number;
  cover: string;
  status: EventStatus;
};

export type Attendance = {
  eventId: string;
  attendedAt: string;
  xpEarned: number;
};

export type ShopItem = {
  id: string;
  sku: string;
  name: string;
  subtitleJa: string;
  image: string;
  xpPrice: number;
  tierRequired: TierCode;
  stock: number;
};

export type TierProgress = {
  current: Tier;
  next: Tier | null;
  pct: number;
  xpIntoTier: number;
  xpToNext: number;
};
