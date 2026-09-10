import { plainStatus, type JobStatus, type PlainStatus } from "./plain.ts";

export type Workspace = {
  slug: string;
  name: string;
  /** The agency that manages this workspace, shown on the allowance card. */
  orgName: string;
};

export type Viewer = {
  name: string;
  role: "owner" | "agency" | "enterprise";
  avatarPath: string | null;
};

export type Allowance = {
  monthLabel: string;
  used: number;
  total: number;
  resetsOn: string;
};

export type Offer = {
  title: string;
  runsThrough: string;
};

export type RecentRender = {
  id: string;
  title: string;
  /** Null for a still. */
  seconds: number | null;
  format: string;
  posterPath: string;
  status: JobStatus;
};

export type HomePayload = {
  workspace: Workspace;
  viewer: Viewer;
  allowance: Allowance;
  offer: Offer | null;
  readyCount: number;
  minutesToReview: number;
  recent: RecentRender[];
};

/**
 * The one card at the top of Home. Reviewing what is already checked beats
 * everything else, then stating the deal, then an honest quiet state.
 */
export type HomeState =
  | { kind: "ready"; count: number; minutes: number }
  | { kind: "needs_offer" }
  | { kind: "quiet" };

export function homeState(payload: HomePayload): HomeState {
  if (payload.readyCount > 0) {
    return {
      kind: "ready",
      count: payload.readyCount,
      minutes: payload.minutesToReview,
    };
  }
  if (!payload.offer) return { kind: "needs_offer" };
  return { kind: "quiet" };
}

export function renderMeta(render: RecentRender): string {
  const parts = render.seconds === null ? [] : [`${render.seconds}s`];
  parts.push(render.format);
  return parts.join(" · ");
}

export function renderStatusWord(render: RecentRender): PlainStatus {
  return plainStatus(render.status);
}

/*
 * ponytail: fixture payload, not a mock layer. Migration 0004 (jobs, renders,
 * approvals) is not written yet, so there is nothing to select. The shape below
 * is the shape the Supabase query returns, so swapping this function for that
 * query is the only change Home needs. Replace when 0004 lands.
 */
export async function getHomePayload(slug: string): Promise<HomePayload> {
  return {
    workspace: {
      slug,
      name: "Northline Windows",
      orgName: "Happy Dog Media",
    },
    viewer: {
      name: "Dana Keller",
      role: "owner",
      avatarPath: null,
    },
    allowance: {
      monthLabel: "October",
      used: 18,
      total: 30,
      resetsOn: "Nov 1",
    },
    offer: {
      title: "$500 off full window replacement + 18-month financing",
      runsThrough: "Oct 31",
    },
    readyCount: 12,
    minutesToReview: 10,
    recent: [
      {
        id: "r-fall-install",
        title: "Fall install story",
        seconds: 24,
        format: "9:16",
        posterPath: "/fixtures/fall-install-story.jpg",
        status: "ready_for_approval",
      },
      {
        id: "r-maple-st",
        title: "Before / after: Maple St",
        seconds: 12,
        format: "9:16",
        posterPath: "/fixtures/before-after-maple-st.jpg",
        status: "ready_for_approval",
      },
      {
        id: "r-crew-spotlight",
        title: "Crew spotlight",
        seconds: 18,
        format: "9:16",
        posterPath: "/fixtures/crew-spotlight.jpg",
        status: "ready_for_approval",
      },
      {
        id: "r-october-static",
        title: "October offer static",
        seconds: null,
        format: "1x1 · JPG",
        posterPath: "/fixtures/october-offer-static.jpg",
        status: "ready_for_approval",
      },
    ],
  };
}
