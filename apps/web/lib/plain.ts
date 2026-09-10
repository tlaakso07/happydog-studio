/**
 * Plain words for owners. Owners never see credits, tokens, model names, QA
 * jargon or retake counts, so every owner-facing component reads its status
 * label from here and nowhere else.
 */

export type JobStatus =
  | "briefed"
  | "scripting"
  | "script_ready"
  | "script_approved"
  | "storyboarding"
  | "scenes_ready"
  | "scenes_approved"
  | "rendering"
  | "checking"
  | "ready_for_approval"
  | "approved"
  | "redo_requested"
  | "skipped"
  | "failed"
  | "cancelled";

export type PlainStatus = "Checked" | "Being redone" | "In the studio" | "Approved";

const STATUS_WORDS: Record<JobStatus, PlainStatus> = {
  briefed: "In the studio",
  scripting: "In the studio",
  script_ready: "In the studio",
  script_approved: "In the studio",
  storyboarding: "In the studio",
  scenes_ready: "In the studio",
  scenes_approved: "In the studio",
  rendering: "In the studio",
  checking: "In the studio",
  ready_for_approval: "Checked",
  approved: "Approved",
  redo_requested: "Being redone",
  skipped: "Being redone",
  failed: "Being redone",
  cancelled: "Being redone",
};

export function plainStatus(status: JobStatus): PlainStatus {
  return STATUS_WORDS[status];
}

/** The four script blocks an owner approves, in order. */
export const SCRIPT_LABELS = [
  "Opening",
  "Why it matters",
  "Proof",
  "The deal",
] as const;
