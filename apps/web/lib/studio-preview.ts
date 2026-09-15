import { SCRIPT_LABELS } from "./plain.ts";

export const PREVIEW_JOB_ID = "heating-outdoors";
export const REDO_REASONS = [
  "Wrong gear or product",
  "Too salesy",
  "Too long",
  "Don't like the opening",
  "Wrong price",
  "Not our style",
  "Say it my way",
] as const;
export type RedoReason = (typeof REDO_REASONS)[number];

export type PhotoRegion = {
  source:
    | "01-approval-queue"
    | "03-create-from-deal"
    | "05-storyboard"
    | "06-brand-room";
  x: number;
  y: number;
  width: number;
  height: number;
  alt: string;
};
// Regions refer only to photographic content in the supplied 2048-wide design.
// The original files are served unchanged. Replace these with real kit assets.
export const PHOTOS: Record<string, PhotoRegion> = {
  presenter: {
    source: "01-approval-queue",
    x: 728,
    y: 410,
    width: 287,
    height: 337,
    alt: "Marcus with a coffee outside a brick home",
  },
  window: {
    source: "03-create-from-deal",
    x: 1528,
    y: 431,
    width: 371,
    height: 433,
    alt: "An installer checking a white window at a brick home",
  },
  curb: {
    source: "05-storyboard",
    x: 65,
    y: 375,
    width: 357,
    height: 293,
    alt: "Marcus beside a new window",
  },
  pane: {
    source: "05-storyboard",
    x: 458,
    y: 375,
    width: 353,
    height: 293,
    alt: "Close view of condensation in an old window",
  },
  street: {
    source: "05-storyboard",
    x: 850,
    y: 375,
    width: 354,
    height: 293,
    alt: "A company truck parked on a residential street",
  },
  reveal: {
    source: "05-storyboard",
    x: 1240,
    y: 375,
    width: 354,
    height: 293,
    alt: "A homeowner beside a sunlit window",
  },
  cast: {
    source: "06-brand-room",
    x: 350,
    y: 410,
    width: 384,
    height: 188,
    alt: "The four people in Northline's sample cast",
  },
  wardrobe: {
    source: "06-brand-room",
    x: 793,
    y: 411,
    width: 382,
    height: 226,
    alt: "A sales polo, install shirt, and work jacket",
  },
  product: {
    source: "06-brand-room",
    x: 1236,
    y: 412,
    width: 381,
    height: 194,
    alt: "White double-hung window from the sample product book",
  },
  fleet: {
    source: "06-brand-room",
    x: 352,
    y: 805,
    width: 380,
    height: 195,
    alt: "A white work truck outside a job site",
  },
  world: {
    source: "06-brand-room",
    x: 796,
    y: 805,
    width: 376,
    height: 196,
    alt: "A brick neighborhood in autumn",
  },
};

export type ScriptLine = {
  label: (typeof SCRIPT_LABELS)[number];
  text: string;
  start: number;
  end: number;
};
export type Scene = {
  id: string;
  name: string;
  photo: string | null;
  who: string;
  speaks: string;
  shows: string;
  camera: string;
  method: string;
  start: number;
  end: number;
};
export type BrandBook = {
  id: string;
  title: string;
  photo: string | null;
  description: string;
  details: string[];
  source: string;
};
export type PreviewPayload = {
  brief: string;
  lines: ScriptLine[];
  drafts: { title: string; opening: string }[];
  scenes: Scene[];
  books: BrandBook[];
  approvals: {
    id: string;
    title: string;
    description: string;
    photo: string;
  }[];
};

/** A single typed fixture. No requests, database writes, or generation occur. */
export async function getStudioPreview(): Promise<PreviewPayload> {
  return {
    brief:
      "Cold open: installer at the curb of a brick two-story, breath visible. He taps the glass of a new double-hung and says most homes here are heating the street.",
    lines: [
      {
        label: SCRIPT_LABELS[0],
        start: 0,
        end: 4,
        text: "See that? Brand-new window, and my coffee's still hot. Your house shouldn't be heating the street.",
      },
      {
        label: SCRIPT_LABELS[1],
        start: 4,
        end: 10,
        text: "If your windows went in back in the nineties, you're paying to heat air that leaves.",
      },
      {
        label: SCRIPT_LABELS[2],
        start: 10,
        end: 16,
        text: "We swapped fifteen windows on this street last month. Here's the one we finished this morning.",
      },
      {
        label: SCRIPT_LABELS[3],
        start: 16,
        end: 24,
        text: "Through October it's five hundred off a full replacement, with eighteen months to pay it.",
      },
    ],
    drafts: [
      {
        title: "Heating the outdoors",
        opening:
          "See that? Brand-new window, and my coffee's still hot. Your house shouldn't be heating the street.",
      },
      {
        title: "The quiet room",
        opening:
          "Hear that? Neither do I. That's what a new window sounds like.",
      },
      {
        title: "The morning check",
        opening:
          "Feel around that old frame. If the morning air's coming in, your heat's going out.",
      },
      {
        title: "Your street, our crew",
        opening:
          "We were on your street last week. Your neighbor finally got rid of that draft.",
      },
      {
        title: "Ready for winter",
        opening:
          "Before you turn the heat up again, take a look at your windows.",
      },
    ],
    scenes: [
      {
        id: "curb",
        name: "Curb",
        photo: "curb",
        who: "Marcus",
        speaks: "Marcus",
        shows: "Curb, new window",
        camera: "Locked, eye level. He moves, the window stays still.",
        method: "Locked camera",
        start: 0,
        end: 4,
      },
      {
        id: "pane",
        name: "Old pane",
        photo: "pane",
        who: "Marcus",
        speaks: "Marcus, off screen",
        shows: "Close-up of a failed seal",
        camera: "Locked, close-up",
        method: "Locked camera",
        start: 4,
        end: 10,
      },
      {
        id: "street",
        name: "Street",
        photo: "street",
        who: "Marcus",
        speaks: "Marcus, off screen",
        shows: "Street, company truck",
        camera: "As filmed. The truck's lettering stays untouched.",
        method: "Real footage",
        start: 10,
        end: 16,
      },
      {
        id: "reveal",
        name: "Reveal",
        photo: "reveal",
        who: "Homeowner",
        speaks: "Marcus, off screen",
        shows: "A warmer, brighter room",
        camera: "Locked, eye level",
        method: "Locked camera",
        start: 16,
        end: 21,
      },
      {
        id: "offer",
        name: "Offer card",
        photo: null,
        who: "Northline Windows",
        speaks: "Marcus, off screen",
        shows: "$500 off + 18-month financing",
        camera: "Still card. The offer stays easy to read.",
        method: "Offer card",
        start: 21,
        end: 24,
      },
    ],
    books: [
      {
        id: "cast",
        title: "Cast",
        photo: "cast",
        description:
          "6 angles each, dressed in real Northline gear. Each with a locked voice.",
        details: [
          "Four approved cast members",
          "Six reference angles per person",
          "Each person keeps the same voice across ads",
        ],
        source: "Cast reference kit · Oct 3",
      },
      {
        id: "wardrobe",
        title: "Wardrobe",
        photo: "wardrobe",
        description: "Sales polo · Install shirt · Work jacket and hat",
        details: [
          "Sales polo for estimates",
          "Gray twill shirt for installs",
          "Approved logo placement on every outfit",
        ],
        source: "uniform-photos · IMG_0413",
      },
      {
        id: "products",
        title: "Products",
        photo: "product",
        description:
          "Colonial 6-lite grille. Sash lock left · 6 angles + close-ups.",
        details: [
          "White double-hung window",
          "Colonial six-lite grille",
          "Keep the sash lock on the left",
          "The camera stays still whenever the product is visible",
        ],
        source: "Product photography and specification sheet",
      },
      {
        id: "fleet",
        title: "Fleet and site",
        photo: "fleet",
        description: "Your real truck and lettering, kept exactly as they are.",
        details: [
          "Use supplied truck photography or real footage",
          "Preserve every letter in the wrap",
          "Keep the camera still for placed artwork",
        ],
        source: "Fleet artwork and job-site photos",
      },
      {
        id: "world",
        title: "World",
        photo: "world",
        description:
          "Handheld, eye level. Brick streets, real homes, familiar places.",
        details: [
          "Neighborhoods with brick two-story homes",
          "Natural light and eye-level framing",
          "No palm trees or stucco",
          "A still camera whenever a product is on screen",
        ],
        source: "Location reference kit",
      },
      {
        id: "voice",
        title: "Voice and proof",
        photo: null,
        description: "Plain talk from the crew, never salesy.",
        details: [
          "Talk like a person from the crew",
          "Use only claims from the approved offer",
          "Say the price and terms exactly as supplied",
        ],
        source: "Founder voice note · Sep 12",
      },
    ],
    approvals: Array.from({ length: 12 }, (_, index) => ({
      id: `sample-${index + 1}`,
      title: [
        "Heating the outdoors",
        "The morning check",
        "Your street, our crew",
        "Ready for winter",
      ][index % 4],
      description:
        "Marcus at the curb, a foggy old pane, the truck on Maple St, then the October deal.",
      photo: ["presenter", "curb", "street", "reveal"][index % 4],
    })),
  };
}

export type PreviewState = {
  brief: string;
  lines: ScriptLine[];
  scenes: Scene[];
  decisions: Record<
    string,
    {
      decision: "approve" | "redo" | "skip";
      reasons: RedoReason[];
      note: string;
    }
  >;
  scriptApproved: boolean;
  scenesApproved: boolean;
};
export type PreviewAction =
  | { type: "brief"; value: string }
  | { type: "line"; index: number; value: string }
  | { type: "approve-script" }
  | { type: "approve-scenes" }
  | { type: "swap"; id: string; photo: string }
  | {
      type: "decide";
      id: string;
      decision: "approve" | "redo" | "skip";
      reasons: RedoReason[];
      note: string;
    }
  | { type: "reset-decisions" };

export function initialPreview(payload: PreviewPayload): PreviewState {
  return {
    brief: payload.brief,
    lines: payload.lines,
    scenes: payload.scenes,
    decisions: {},
    scriptApproved: false,
    scenesApproved: false,
  };
}

export function previewReducer(
  state: PreviewState,
  action: PreviewAction,
): PreviewState {
  switch (action.type) {
    case "brief":
      return {
        ...state,
        brief: action.value,
        scriptApproved: false,
        scenesApproved: false,
      };
    case "line":
      return {
        ...state,
        lines: state.lines.map((line, index) =>
          index === action.index ? { ...line, text: action.value } : line,
        ),
        scriptApproved: false,
        scenesApproved: false,
      };
    case "approve-script":
      return state.lines.every((line) => line.text.trim())
        ? { ...state, scriptApproved: true }
        : state;
    case "approve-scenes":
      return state.scriptApproved ? { ...state, scenesApproved: true } : state;
    case "swap":
      return {
        ...state,
        scenes: state.scenes.map((scene) =>
          scene.id === action.id && scene.photo !== null
            ? { ...scene, photo: action.photo }
            : scene,
        ),
        scenesApproved: false,
      };
    case "decide": {
      if (
        state.decisions[action.id] ||
        (action.decision === "redo" && action.reasons.length === 0)
      )
        return state;
      return {
        ...state,
        decisions: {
          ...state.decisions,
          [action.id]: {
            decision: action.decision,
            reasons: action.reasons,
            note: action.note,
          },
        },
      };
    }
    case "reset-decisions":
      return { ...state, decisions: {} };
  }
}

export function timestamp(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
