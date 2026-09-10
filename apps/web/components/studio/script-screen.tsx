"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Pencil, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckList, FlowSteps, StudioPage } from "./shared";
import { useStudioPreview } from "./preview-provider";
import { PREVIEW_JOB_ID, timestamp } from "@/lib/studio-preview";
import { plainStatus } from "@/lib/plain";

export function ScriptScreen({ base }: { base: string }) {
  const { state, payload, dispatch } = useStudioPreview();
  const [draftsOpen, setDraftsOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const router = useRouter();
  const edited = state.lines.some(
    (line, index) => line.text !== payload.lines[index].text,
  );
  const valid = state.lines.every((line) => line.text.trim().length > 0);
  function approve() {
    if (!valid) return;
    dispatch({ type: "approve-script" });
    router.push(`${base}/jobs/${PREVIEW_JOB_ID}/scenes`);
  }
  return (
    <StudioPage>
      <FlowSteps base={base} active={1} />
      <div className="script-grid">
        <div className="min-w-0">
          <header className="script-heading">
            <h1>
              Here’s your script.
              <br />
              Approve the words first.
            </h1>
            <p>
              Read it out loud. If it sounds like a person from your company,
              it’s ready. Tap any line to change it.
            </p>
            <span className="free-chip">Free to redo</span>
          </header>
          <div className="script-lines">
            {state.lines.map((line, index) => (
              <section
                className={`script-line ${editing === index ? "editing" : ""}`}
                key={line.label}
              >
                <div className="script-line-top">
                  <label
                    htmlFor={`line-${index}`}
                    className="eyebrow text-cobalt"
                  >
                    {line.label}
                  </label>
                  <span className="tnum">
                    {timestamp(line.start)}–{timestamp(line.end)}
                  </span>
                </div>
                {editing === index ? (
                  <>
                    <textarea
                      id={`line-${index}`}
                      autoFocus
                      rows={3}
                      maxLength={600}
                      value={line.text}
                      onChange={(event) =>
                        dispatch({
                          type: "line",
                          index,
                          value: event.target.value,
                        })
                      }
                      className="line-editor"
                    />
                    <div className="mt-2 flex justify-between gap-2">
                      <span className="text-xs text-meta">
                        {line.text.length}/600 characters
                      </span>
                      <Button
                        size="md"
                        variant="outline"
                        onClick={() => setEditing(null)}
                      >
                        Done editing
                      </Button>
                    </div>
                  </>
                ) : (
                  <button
                    id={`line-${index}`}
                    className="line-edit-button"
                    onClick={() => setEditing(index)}
                    aria-label={`Edit ${line.label}`}
                  >
                    <span>{line.text || "Add this line..."}</span>
                    <Pencil size={14} aria-hidden />
                  </button>
                )}
              </section>
            ))}
          </div>
          {!valid && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              Add words to every line before continuing.
            </p>
          )}
          <div className="screen-actions">
            <Button size="xl" onClick={approve} disabled={!valid}>
              Approve, continue to scenes <ArrowRight size={16} aria-hidden />
            </Button>
            <Button
              size="md"
              variant="outline"
              onClick={() => setVoiceOpen(true)}
            >
              Hear Marcus read it
            </Button>
            <Button
              size="md"
              variant="outline"
              onClick={() => setDraftsOpen(true)}
            >
              Try a different angle
            </Button>
          </div>
        </div>
        <aside className="surface-panel script-checks">
          <h2>
            {edited
              ? "Your changes need a fresh look"
              : `${plainStatus("ready_for_approval")} before you saw it`}
          </h2>
          {edited ? (
            <>
              <p className="text-secondary-ink">
                You’ve changed the sample script. Its original checks no longer
                apply.
              </p>
              <p className="text-sm text-meta">
                You can continue the visual walkthrough. Live timing and offer
                checks will run when writing is connected.
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={() =>
                  payload.lines.forEach((line, index) =>
                    dispatch({ type: "line", index, value: line.text }),
                  )
                }
              >
                <RotateCcw size={15} aria-hidden />
                Restore sample words
              </Button>
            </>
          ) : (
            <>
              <CheckList
                items={[
                  "No repeated words or phrases",
                  "Each thought hands off to the next",
                  "Sounds like Northline: plain talk from the crew",
                  "Offer wording matches the sample October deal",
                ]}
              />
              <p className="text-sm text-meta">
                Sample review notes from the approved design. Timing and claims
                have not been checked by a live service.
              </p>
            </>
          )}
          <button
            className="text-left text-cobalt"
            onClick={() => setDraftsOpen(true)}
          >
            See the other drafts{" "}
            <ArrowRight size={14} className="inline" aria-hidden />
          </button>
        </aside>
      </div>
      <Dialog open={draftsOpen} onOpenChange={setDraftsOpen}>
        <DialogContent className="studio-dialog">
          <DialogHeader>
            <DialogTitle>Try another opening</DialogTitle>
            <DialogDescription>
              Five sample angles. Your other three lines stay as you wrote them.
            </DialogDescription>
          </DialogHeader>
          {payload.drafts.map((draft) => (
            <button
              key={draft.title}
              className="draft-option"
              onClick={() => {
                dispatch({ type: "line", index: 0, value: draft.opening });
                setDraftsOpen(false);
              }}
            >
              <strong>{draft.title}</strong>
              <span>{draft.opening}</span>
              <ArrowRight size={16} aria-hidden />
            </button>
          ))}
        </DialogContent>
      </Dialog>
      <Dialog open={voiceOpen} onOpenChange={setVoiceOpen}>
        <DialogContent className="studio-dialog">
          <DialogHeader>
            <DialogTitle>Marcus’s voice preview</DialogTitle>
            <DialogDescription>
              A voice recording isn’t attached to this sample yet.
            </DialogDescription>
          </DialogHeader>
          <p>
            For this review, read the four lines out loud. The finished app will
            use Marcus’s approved voice from the brand room.
          </p>
          <p className="text-sm text-meta">No audio has been generated.</p>
        </DialogContent>
      </Dialog>
    </StudioPage>
  );
}
