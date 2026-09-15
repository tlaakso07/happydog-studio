"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudioPreview } from "./preview-provider";
import { BackToHome, ReferencePhoto, StudioPage } from "./shared";
import { REDO_REASONS, type RedoReason } from "@/lib/studio-preview";
import { plainStatus } from "@/lib/plain";

export function ApprovalScreen({ base }: { base: string }) {
  const { state, payload, dispatch } = useStudioPreview();
  const [redo, setRedo] = useState(false);
  const [reasons, setReasons] = useState<RedoReason[]>([]);
  const [note, setNote] = useState("");
  const [position, setPosition] = useState(0);
  const [feedback, setFeedback] = useState("");
  const pending = payload.approvals.filter((ad) => !state.decisions[ad.id]);
  const index = Math.min(position, Math.max(0, pending.length - 1));
  const ad = pending[index];
  const completed = payload.approvals.length - pending.length;
  const skipped = Object.values(state.decisions).filter(
    (decision) => decision.decision === "skip",
  ).length;
  function decide(decision: "approve" | "redo" | "skip") {
    if (!ad || (decision === "redo" && reasons.length === 0)) return;
    dispatch({ type: "decide", id: ad.id, decision, reasons, note });
    setFeedback(
      decision === "approve"
        ? "Sample approved."
        : decision === "redo"
          ? "Sample redo request recorded for this preview."
          : "Sample set aside for now.",
    );
    setRedo(false);
    setReasons([]);
    setNote("");
  }
  // One listener; actions use the latest queue and ignore typing and controls.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat)
        return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "input, textarea, select, button, a, [contenteditable], [role=dialog]",
        )
      )
        return;
      if (!ad) return;
      const key = event.key.toLowerCase();
      if (key === "a" && !redo) {
        event.preventDefault();
        decide("approve");
      } else if (key === "s" && !redo) {
        event.preventDefault();
        decide("skip");
      } else if (key === "r") {
        event.preventDefault();
        setRedo(true);
      } else if (event.key === "Escape") {
        setRedo(false);
      } else if (event.key === "Enter" && redo && reasons.length) {
        event.preventDefault();
        decide("redo");
      } else if (event.key === "ArrowRight" && !redo) {
        event.preventDefault();
        setPosition(Math.min(index + 1, pending.length - 1));
      } else if (event.key === "ArrowLeft" && !redo) {
        event.preventDefault();
        setPosition(Math.max(index - 1, 0));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  return (
    <StudioPage>
      {!ad ? (
        <section className="queue-complete">
          <span className="completion-icon">
            <Check size={30} aria-hidden />
          </span>
          <h1>That’s everything.</h1>
          <p>
            You’ve reviewed all {payload.approvals.length} sample ads.
            {skipped > 0 && ` ${skipped} set aside for later.`}
          </p>
          <p className="text-meta">
            These decisions are part of the preview. Nothing was sent to your
            team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="xl"
              variant="outline"
              onClick={() => {
                dispatch({ type: "reset-decisions" });
                setPosition(0);
                setFeedback("");
              }}
            >
              Restart sample queue
            </Button>
            <BackToHome base={base} />
          </div>
        </section>
      ) : (
        <>
          <header className="approval-heading">
            <h1>
              {pending.length === 1
                ? "One ad is ready."
                : `${pending.length} ads are ready.`}
              <br />
              Every one already checked.
            </h1>
            <div className="approval-progress">
              <p className="tnum">
                {completed + 1} of {payload.approvals.length} · About{" "}
                {Math.max(1, Math.ceil((pending.length * 40) / 60))} minutes
                left
              </p>
              <div className="flex gap-2">
                <Button
                  size="md"
                  variant="outline"
                  aria-label="Previous ad"
                  disabled={index === 0 || redo}
                  onClick={() => setPosition(index - 1)}
                >
                  <ArrowLeft size={15} aria-hidden />
                </Button>
                <Button
                  size="md"
                  variant="outline"
                  aria-label="Next ad"
                  disabled={index === pending.length - 1 || redo}
                  onClick={() => setPosition(index + 1)}
                >
                  <ArrowRight size={15} aria-hidden />
                </Button>
              </div>
            </div>
            <progress
              max={payload.approvals.length}
              value={completed}
              aria-label="Sample ads reviewed"
              className="queue-progress"
            />
          </header>
          <div className="approval-grid">
            <div className="video-well">
              <div className="approval-still">
                <ReferencePhoto name={ad.photo} />
                <span className="still-caption">
                  Your house shouldn’t be
                  <br />
                  heating the street.
                </span>
              </div>
              <p>Sample still · Video playback isn’t connected yet</p>
            </div>
            <div>
              <section className="surface-panel approval-detail">
                <h2>{ad.title}</h2>
                <p>{ad.description}</p>
                <div className="what-it-says">
                  <h3 className="eyebrow">What it says</h3>
                  {payload.lines.map((line) => (
                    <div className="spoken-line" key={line.label}>
                      <span>{line.label}</span>
                      <p>{line.text}</p>
                    </div>
                  ))}
                </div>
                <div className="checks-row">
                  <span className="eyebrow">
                    {plainStatus("ready_for_approval")}
                  </span>
                  {["Gear", "Logo", "Colors", "Product"].map((check) => (
                    <span className="checked-chip" key={check}>
                      <Check size={13} aria-hidden />
                      {check}
                    </span>
                  ))}
                </div>
              </section>
              <p className="redo-allowance">
                Redos never count against your October ads.
              </p>
            </div>
          </div>
          <section
            className="approval-actions"
            aria-label="Review this sample ad"
          >
            <div className="flex flex-wrap gap-2">
              <Button
                size="xl"
                disabled={redo}
                onClick={() => decide("approve")}
              >
                Approve <kbd>A</kbd>
              </Button>
              <Button
                size="xl"
                variant="outline"
                aria-pressed={redo}
                onClick={() => setRedo(!redo)}
              >
                <RotateCcw size={16} aria-hidden />
                Redo <kbd>R</kbd>
              </Button>
              <Button
                size="md"
                variant="ghost"
                disabled={redo}
                onClick={() => decide("skip")}
              >
                Skip for now <kbd>S</kbd>
              </Button>
            </div>
            <fieldset className="redo-reasons">
              <legend className="eyebrow">If redo, what’s off?</legend>
              <div className="flex flex-wrap gap-2">
                {REDO_REASONS.map((reason) => (
                  <button
                    className={`reason-pill ${reasons.includes(reason) ? "selected" : ""}`}
                    key={reason}
                    aria-pressed={reasons.includes(reason)}
                    onClick={() => {
                      setRedo(true);
                      setReasons((old) =>
                        old.includes(reason)
                          ? old.filter((item) => item !== reason)
                          : [...old, reason],
                      );
                    }}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>
          {redo && (
            <section className="surface-panel redo-note">
              <label className="eyebrow" htmlFor="redo-note">
                Anything else?{" "}
                <span className="text-meta normal-case">Optional</span>
              </label>
              <textarea
                id="redo-note"
                className="line-editor mt-3"
                value={note}
                maxLength={1000}
                rows={3}
                placeholder="Tell us what you’d like to change..."
                onChange={(event) => setNote(event.target.value)}
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button
                  size="md"
                  disabled={reasons.length === 0}
                  onClick={() => decide("redo")}
                >
                  Confirm sample redo
                </Button>
                <Button
                  size="md"
                  variant="ghost"
                  onClick={() => {
                    setRedo(false);
                    setReasons([]);
                  }}
                >
                  Cancel
                </Button>
                {reasons.length === 0 && (
                  <p className="text-sm text-meta">
                    Choose at least one reason.
                  </p>
                )}
              </div>
            </section>
          )}
        </>
      )}
      <p role="status" className="sr-only">
        {feedback}
      </p>
    </StudioPage>
  );
}
