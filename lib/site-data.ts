export type TeamMember = {
  name: string;
  role: string;
  expertise: string;
  bio: string;
  avatar: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  date: string;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
};

export type CommunityMember = {
  name: string;
  role: string;
  projects: number;
  xp: number;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Dr. Priya Mehta",
    role: "Faculty Coordinator",
    expertise: "AI / Machine Learning",
    bio: "Leading research in neural architectures and mentor to 50+ student projects.",
    avatar: "/avatars/priya.svg",
  },
  {
    name: "Arjun Nair",
    role: "President",
    expertise: "Full-Stack Development",
    bio: "Built 3 startups from campus. Passionate about scalable systems.",
    avatar: "/avatars/arjun.svg",
  },
  {
    name: "Sneha Kapoor",
    role: "Vice President",
    expertise: "UI/UX Design",
    bio: "Design thinker with a love for minimal interfaces and user research.",
    avatar: "/avatars/sneha.svg",
  },
  {
    name: "Rohit Verma",
    role: "Technical Lead",
    expertise: "IoT / Hardware",
    bio: "Hardware hacker. Turns wild ideas into working prototypes in 48 hours.",
    avatar: "/avatars/rohit.svg",
  },
  {
    name: "Kavya Singh",
    role: "Events Head",
    expertise: "Project Management",
    bio: "Organized 30+ events. Master of logistics and team coordination.",
    avatar: "/avatars/kavya.svg",
  },
  {
    name: "Devansh Gupta",
    role: "Innovation Lead",
    expertise: "Blockchain / Web3",
    bio: "Web3 evangelist building decentralized solutions for real-world problems.",
    avatar: "/avatars/devansh.svg",
  },
  {
    name: "Ananya Reddy",
    role: "Community Manager",
    expertise: "Content / Marketing",
    bio: "Crafts stories that inspire. Grew our community to 500+ members.",
    avatar: "/avatars/ananya.svg",
  },
  {
    name: "Aditya Rao",
    role: "Workshop Coordinator",
    expertise: "Cloud / DevOps",
    bio: "AWS certified. Runs hands-on sessions that make cloud click.",
    avatar: "/avatars/aditya.svg",
  },
];

export const galleryItems: GalleryItem[] = [
  { id: "g1", title: "Ideathon 026.02", category: "Events", image: "/gallery/ideathon.svg", date: "Feb 2026" },
  { id: "g2", title: "Hardware Hack 48H", category: "Workshop", image: "/gallery/hardware.svg", date: "May 2026" },
  { id: "g3", title: "Startup Sprint Vol.3", category: "Competition", image: "/gallery/sprint.svg", date: "Dec 2025" },
  { id: "g4", title: "Patent Clinic", category: "Workshop", image: "/gallery/patent.svg", date: "Jan 2026" },
  { id: "g5", title: "Demo Day Q1", category: "Events", image: "/gallery/demo.svg", date: "Mar 2026" },
  { id: "g6", title: "AI Workshop — Agents", category: "Workshop", image: "/gallery/ai.svg", date: "Jul 2026" },
  { id: "g7", title: "Mentor Roundtable", category: "Networking", image: "/gallery/mentor.svg", date: "Jun 2026" },
  { id: "g8", title: "Faculty x Founders", category: "Networking", image: "/gallery/fxf.svg", date: "Nov 2025" },
  { id: "g9", title: "Hackathon Finals", category: "Competition", image: "/gallery/hackathon.svg", date: "Apr 2026" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "Ideathon 026.02 — Where Wild Ideas Became Real",
    excerpt: "48 teams. 12 hours. 3 revolutionary prototypes. Here's how the most ambitious ideathon yet unfolded.",
    date: "Feb 12, 2026",
    category: "Event Recap",
    readTime: "5 min",
    image: "/blog/ideathon.svg",
  },
  {
    id: "b2",
    title: "Startup Sprint Vol.3 — From Concept to MVP",
    excerpt: "Teams raced against the clock to build minimum viable products. The results were staggering.",
    date: "Dec 10, 2025",
    category: "Event Recap",
    readTime: "4 min",
    image: "/blog/sprint.svg",
  },
  {
    id: "b3",
    title: "Patent Clinic — Protecting Your Innovation",
    excerpt: "Our expert panel broke down the patent filing process into actionable steps for student inventors.",
    date: "Jan 28, 2026",
    category: "Workshop",
    readTime: "3 min",
    image: "/blog/patent.svg",
  },
  {
    id: "b4",
    title: "Faculty x Founders — Bridging Academia and Startup Culture",
    excerpt: "When professors and entrepreneurs share a stage, magic happens. Key takeaways from the panel.",
    date: "Nov 22, 2025",
    category: "Networking",
    readTime: "6 min",
    image: "/blog/fxf.svg",
  },
  {
    id: "b5",
    title: "Building a Hardware Prototype in 48 Hours",
    excerpt: "Our team took on the ultimate challenge — from schematics to working prototype in two sleepless days.",
    date: "May 5, 2026",
    category: "Event Recap",
    readTime: "7 min",
    image: "/blog/hardware.svg",
  },
  {
    id: "b6",
    title: "The Future of AI Agents in Campus Innovation",
    excerpt: "Workshop highlights on building autonomous agents that solve real campus problems.",
    date: "Jul 15, 2026",
    category: "Workshop",
    readTime: "4 min",
    image: "/blog/ai.svg",
  },
];

export const communityMembers: CommunityMember[] = [
  { name: "Arjun Nair", role: "President", projects: 12, xp: 4200 },
  { name: "Sneha Kapoor", role: "VP", projects: 9, xp: 3800 },
  { name: "Rohit Verma", role: "Tech Lead", projects: 11, xp: 3600 },
  { name: "Kavya Singh", role: "Events Head", projects: 7, xp: 3200 },
  { name: "Devansh Gupta", role: "Innovation Lead", projects: 8, xp: 3000 },
  { name: "Ananya Reddy", role: "Community Mgr", projects: 6, xp: 2800 },
  { name: "Aditya Rao", role: "Workshop Coord", projects: 5, xp: 2400 },
  { name: "Meera S", role: "AI Research", projects: 10, xp: 3400 },
  { name: "Vikram P", role: "Blockchain Lead", projects: 4, xp: 2200 },
  { name: "Nisha Agarwal", role: "Design Lead", projects: 7, xp: 2600 },
];

export const upcomingEvents = [
  {
    id: "ue1",
    title: "Hardware Hack 48H",
    subtitleJa: "ハードウェア.ハック",
    date: "2026-05-30",
    time: "09:00 AM",
    location: "MAKER LAB",
    xpReward: 480,
    spots: 40,
    spotsTaken: 32,
  },
  {
    id: "ue2",
    title: "Mentor Roundtable",
    subtitleJa: "メンター.ラウンド",
    date: "2026-06-12",
    time: "05:30 PM",
    location: "BLOCK B · ROOM 4",
    xpReward: 160,
    spots: 30,
    spotsTaken: 18,
  },
  {
    id: "ue3",
    title: "Demo Day Q2",
    subtitleJa: "デモ.デイ",
    date: "2026-06-26",
    time: "06:00 PM",
    location: "MAIN HALL",
    xpReward: 320,
    spots: 200,
    spotsTaken: 145,
  },
  {
    id: "ue4",
    title: "AI Workshop — Agents",
    subtitleJa: "AIワークショップ",
    date: "2026-07-09",
    time: "01:00 PM",
    location: "LAB · 03F",
    xpReward: 240,
    spots: 35,
    spotsTaken: 28,
  },
  {
    id: "ue5",
    title: "Innovation Summit 2026",
    subtitleJa: "イノベーション.サミット",
    date: "2026-08-15",
    time: "10:00 AM",
    location: "AUDITORIUM",
    xpReward: 500,
    spots: 300,
    spotsTaken: 180,
  },
  {
    id: "ue6",
    title: "Blockchain Bootcamp",
    subtitleJa: "ブロックチェーン.ブートキャンプ",
    date: "2026-09-05",
    time: "02:00 PM",
    location: "LAB · 01F",
    xpReward: 300,
    spots: 25,
    spotsTaken: 12,
  },
];
