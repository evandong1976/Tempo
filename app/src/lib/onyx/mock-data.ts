export type UserRole = "brand" | "creator";

export type InfluencerCard = {
  id: string;
  name: string;
  handle: string;
  niche: string;
  followers: string;
  engagement: string;
  location: string;
  bio: string;
  tags: string[];
};

export type MatchPartner = {
  id: string;
  name: string;
  logo: string;
  industry: string;
  matchedAt: string;
  status: "active" | "pending";
  lastMessage: string;
};

export type Campaign = {
  id: string;
  name: string;
  status: "live" | "draft" | "paused";
  budget: string;
  influencersMatched: number;
  startDate: string;
};

export const mockInfluencers: InfluencerCard[] = [
  {
    id: "1",
    name: "Maya Chen",
    handle: "@mayacreates",
    niche: "Lifestyle & wellness",
    followers: "128K",
    engagement: "4.2%",
    location: "Los Angeles, CA",
    bio: "Morning routines, sustainable living, and honest product reviews.",
    tags: ["UGC", "Reels", "Skincare"],
  },
  {
    id: "2",
    name: "Jordan Ellis",
    handle: "@jordanontherun",
    niche: "Fitness & mobility",
    followers: "84K",
    engagement: "5.1%",
    location: "Austin, TX",
    bio: "Former PT. I test gear so your audience doesn't have to.",
    tags: ["YouTube", "Shorts", "Tech"],
  },
  {
    id: "3",
    name: "Sam Rivera",
    handle: "@samshots",
    niche: "Photography & travel",
    followers: "210K",
    engagement: "3.8%",
    location: "Mexico City",
    bio: "Cinematic travel stories and brand-friendly adventure content.",
    tags: ["Stories", "TikTok", "Travel"],
  },
  {
    id: "4",
    name: "Alex Kim",
    handle: "@alexbuilds",
    niche: "Tech & productivity",
    followers: "56K",
    engagement: "6.0%",
    location: "Seattle, WA",
    bio: "Desk setups, apps, and workflows for creative professionals.",
    tags: ["Long-form", "Twitter/X", "B2B"],
  },
];

export const mockMatches: MatchPartner[] = [
  {
    id: "m1",
    name: "Northwind Apparel",
    logo: "NW",
    industry: "Fashion",
    matchedAt: "Mar 28, 2026",
    status: "active",
    lastMessage: "Love the spring palette — can we lock March deliverables?",
  },
  {
    id: "m2",
    name: "Glow Labs",
    logo: "GL",
    industry: "Beauty",
    matchedAt: "Mar 22, 2026",
    status: "pending",
    lastMessage: "Sent the brief PDF. Let us know if timeline works.",
  },
  {
    id: "m3",
    name: "Stride Running Co.",
    logo: "SR",
    industry: "Sport",
    matchedAt: "Mar 15, 2026",
    status: "active",
    lastMessage: "Campaign live — tracking link in your inbox.",
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: "c1",
    name: "Spring launch — creators",
    status: "live",
    budget: "$24K",
    influencersMatched: 6,
    startDate: "Mar 1, 2026",
  },
  {
    id: "c2",
    name: "UGC sprint (Q2)",
    status: "draft",
    budget: "$12K",
    influencersMatched: 0,
    startDate: "Apr 15, 2026",
  },
  {
    id: "c3",
    name: "Product education series",
    status: "paused",
    budget: "$8K",
    influencersMatched: 3,
    startDate: "Jan 10, 2026",
  },
];

export const mockBrandProfile = {
  name: "Lumen Beverages",
  tagline: "Sparkling botanical drinks",
  website: "lumenbev.co",
  industry: "CPG / Beverage",
  teamEmail: "partners@lumenbev.co",
};

export const mockCreatorProfile = {
  name: "Maya Chen",
  handle: "@mayacreates",
  niche: "Lifestyle & wellness",
  followers: "128K",
  engagement: "4.2%",
  location: "Los Angeles, CA",
  bio: "Morning routines, sustainable living, and honest product reviews.",
};
