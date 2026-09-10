"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FlowSteps, ReferencePhoto, StudioPage } from "./shared";
import { useStudioPreview } from "./preview-provider";
import { PREVIEW_JOB_ID, timestamp } from "@/lib/studio-preview";

export function StoryboardScreen({ base }: { base: string }) {
  const { state, dispatch } = useStudioPreview();
  const [swapId, setSwapId] = useState<string | null>(null);
  const [renderOpen, setRenderOpen] = useState(false);
  return (
    <StudioPage wide>
      <FlowSteps base={base} active={2} />
      <header className="storyboard-heading">
        <p className="eyebrow">Step 3 of 4 · The scenes</p>
        <h1>
          Every line gets its scene.
          <br className="sm:hidden" /> Nothing overlaps.
        </h1>
      </header>
      <div className="scene-timeline" aria-label="24-second scene timeline">
        {state.scenes.map((scene) => (
          <a
            key={scene.id}
            href={`#scene-${scene.id}`}
            style={{ flexGrow: scene.end - scene.start }}
          >
            <span className="tnum">{timestamp(scene.start)}</span>
            <span className="timeline-segment" />
          </a>
        ))}
        <span className="tnum timeline-end">0:24</span>
      </div>
      <div className="scene-grid">
        {state.scenes.map((scene, index) => (
          <article
            className="scene-card"
            key={scene.id}
            id={`scene-${scene.id}`}
          >
            {scene.photo ? (
              <ReferencePhoto name={scene.photo} className="scene-photo" />
            ) : (
              <div className="scene-offer-art">
                <span>Northline Windows</span>
                <strong>$500 off</strong>
                <p>
                  Full window replacement
                  <br />+ 18-month financing
                </p>
                <small>Through October 31</small>
              </div>
            )}
            <div className="scene-card-body">
              <div className="flex justify-between gap-2">
                <h2>
                  Scene {index + 1} <span>{scene.name}</span>
                </h2>
                <span className="tnum text-xs text-meta">
                  {scene.end - scene.start}s
                </span>
              </div>
              <dl>
                <div>
                  <dt>Who</dt>
                  <dd>{scene.who}</dd>
                </div>
                <div>
                  <dt>Speaks</dt>
                  <dd>{scene.speaks}</dd>
                </div>
                <div>
                  <dt>Shows</dt>
                  <dd>{scene.shows}</dd>
                </div>
                <div>
                  <dt>Camera</dt>
                  <dd>{scene.camera}</dd>
                </div>
              </dl>
              <span className="scene-method">{scene.method}</span>
              {scene.photo && (
                <button
                  className="mt-4 block text-sm text-cobalt"
                  onClick={() => setSwapId(scene.id)}
                >
                  Swap this image
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      <section className="storyboard-footer" id="render">
        <div>
          <span className="eyebrow">House rules</span>
          <p>
            One thought per scene. One camera move per shot, and none when the
            product is on screen. Real footage comes first whenever we have it.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3">
          {!state.scriptApproved && (
            <p className="text-sm text-secondary-ink">
              Review and approve the words before the scenes.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="md" asChild>
              <Link href={`${base}/jobs/${PREVIEW_JOB_ID}/script`}>
                Review the words
              </Link>
            </Button>
            <Button
              size="xl"
              disabled={!state.scriptApproved}
              onClick={() => {
                dispatch({ type: "approve-scenes" });
                setRenderOpen(true);
              }}
            >
              Approve scenes, preview next <ArrowRight size={16} aria-hidden />
            </Button>
          </div>
        </div>
      </section>
      <Dialog
        open={swapId !== null}
        onOpenChange={(open) => {
          if (!open) setSwapId(null);
        }}
      >
        <DialogContent className="studio-dialog">
          <DialogHeader>
            <DialogTitle>Choose a sample image</DialogTitle>
            <DialogDescription>
              This changes the visual only. The scene’s words, camera rule, and
              duration stay the same.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {["curb", "pane", "street", "reveal"].map((photo) => (
              <button
                key={photo}
                className="overflow-hidden rounded-lg border border-line text-left"
                onClick={() => {
                  if (swapId) dispatch({ type: "swap", id: swapId, photo });
                  setSwapId(null);
                }}
              >
                <ReferencePhoto name={photo} />
                <span className="block p-3 capitalize">
                  {photo === "pane" ? "Old window" : photo}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={renderOpen} onOpenChange={setRenderOpen}>
        <DialogContent className="studio-dialog">
          <DialogHeader>
            <DialogTitle>Your preview scenes are approved</DialogTitle>
            <DialogDescription>
              This completes the sample creation walkthrough.
            </DialogDescription>
          </DialogHeader>
          <p className="flex items-center gap-2">
            <Check size={18} className="text-checked-ink" aria-hidden />
            Words and scenes reviewed
          </p>
          <p>
            No video has been generated and your October allowance has not
            changed. The next screen shows the sample finished-ad review.
          </p>
          <Button asChild size="xl">
            <Link href={`${base}/approvals`}>
              Explore the approval queue <ArrowRight size={16} aria-hidden />
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </StudioPage>
  );
}
