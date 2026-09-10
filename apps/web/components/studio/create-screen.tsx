"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStudioPreview } from "./preview-provider";
import { CheckList, FlowSteps, ReferencePhoto, StudioPage } from "./shared";
import { PREVIEW_JOB_ID } from "@/lib/studio-preview";

export function CreateScreen({ base }: { base: string }) {
  const { state, dispatch, payload } = useStudioPreview();
  const [advanced, setAdvanced] = useState(false);
  const [concepts, setConcepts] = useState(false);
  const [ratio, setRatio] = useState("9:16");
  const [notice, setNotice] = useState("");
  const [offerOpen, setOfferOpen] = useState(false);
  const scriptHref = `${base}/jobs/${PREVIEW_JOB_ID}/script`;
  return (
    <StudioPage>
      <header className="screen-heading">
        <h1>New video ad</h1>
        <Link href={`${base}/brand`} className="text-sm text-secondary-ink">
          Northline Windows
        </Link>
      </header>
      <div className="create-grid">
        <div className="min-w-0">
          <FlowSteps base={base} active={0} />
          <div className="brand-assurance">
            <ShieldCheck size={20} aria-hidden />
            <p>
              <strong>Brand system is on.</strong> Cast, uniforms, products and
              voice stay true to your brand room.
            </p>
          </div>
          <button
            type="button"
            className="attached-offer"
            onClick={() => setOfferOpen(true)}
          >
            <span className="offer-label">
              October deal <span> · Attached</span>
            </span>
            <span>$500 off full window replacement + 18-month financing</span>
            <ArrowRight size={18} aria-hidden />
          </button>
          <section
            className="surface-panel brief-panel"
            aria-labelledby="brief-title"
          >
            <div className="flex items-center justify-between gap-3">
              <label id="brief-title" htmlFor="ad-brief" className="eyebrow">
                Tell us what you have in mind
              </label>
              <span className="text-xs text-meta">
                Your words, your starting point
              </span>
            </div>
            <textarea
              id="ad-brief"
              value={state.brief}
              maxLength={3000}
              onChange={(event) =>
                dispatch({ type: "brief", value: event.target.value })
              }
              className="brief-editor"
              placeholder="A job you just finished, a question customers ask, or a reason to choose your crew..."
            />
            <div className="flex flex-wrap gap-2">
              <Button
                size="md"
                disabled={!state.brief.trim()}
                onClick={() =>
                  setNotice(
                    "Your brief is ready. Open the sample script to explore the next step; writing a new script will be connected later.",
                  )
                }
              >
                Write my script and shot list
              </Button>
              <Button
                size="md"
                variant="outline"
                onClick={() => setConcepts(true)}
              >
                Explore 5 sample concepts
              </Button>
            </div>
            {notice && (
              <p role="status" className="inline-notice">
                {notice}{" "}
                <Link className="text-cobalt underline" href={scriptHref}>
                  Open sample script
                </Link>
              </p>
            )}
            <div className="brief-settings">
              <p>
                Made for your brand<span> · 24 seconds</span>
              </p>
              <button
                onClick={() => setAdvanced(!advanced)}
                aria-expanded={advanced}
                aria-controls="ad-settings"
                className="text-sm text-secondary-ink underline underline-offset-4"
              >
                Look and format{" "}
                <ChevronDown size={14} className="inline" aria-hidden />
              </button>
            </div>
            {advanced && (
              <div id="ad-settings" className="settings-content">
                <fieldset>
                  <legend className="eyebrow mb-3">
                    Where will this ad live?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {["9:16", "4:5", "1:1"].map((value) => (
                      <label
                        key={value}
                        className={`choice-pill ${ratio === value ? "selected" : ""}`}
                      >
                        <input
                          type="radio"
                          name="ratio"
                          value={value}
                          checked={ratio === value}
                          onChange={() => setRatio(value)}
                          className="sr-only"
                        />
                        {value} ·{" "}
                        {value === "9:16"
                          ? "Reels"
                          : value === "4:5"
                            ? "Feed"
                            : "Square"}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <p className="mt-3 text-sm text-meta">
                  Format selection is for this preview. The sample script and
                  scenes are 24 seconds.
                </p>
              </div>
            )}
          </section>
        </div>
        <aside className="create-preview" aria-label="Sample ad preview">
          <div
            className={`phone-preview ${ratio === "1:1" ? "phone-square" : ratio === "4:5" ? "phone-feed" : ""}`}
          >
            <ReferencePhoto name="window" />
            <div className="phone-copy">
              <span className="text-xs">Northline Windows · Sponsored</span>
              <h2>Your house is heating the outdoors.</h2>
              <span className="phone-cta">Get quote</span>
            </div>
            <span className="photo-caption">Sample still · {ratio}</span>
          </div>
          <CheckList
            items={[
              "Cast and uniforms from your brand room",
              "Your real product in every window shot",
              "Offer wording from your October deal",
            ]}
          />
          <Button asChild size="xl" className="w-full">
            <Link href={scriptHref}>
              Preview the words <ArrowRight size={16} aria-hidden />
            </Link>
          </Button>
          <p className="text-center text-xs text-meta">
            No ad is created or counted in this preview.
          </p>
        </aside>
      </div>
      <Dialog open={concepts} onOpenChange={setConcepts}>
        <DialogContent className="studio-dialog">
          <DialogHeader>
            <DialogTitle>Five ways into the same deal</DialogTitle>
            <DialogDescription>
              Sample concepts for the walkthrough. Choose one to replace the
              opening.
            </DialogDescription>
          </DialogHeader>
          <div className="divide-y divide-line">
            {payload.drafts.map((draft) => (
              <button
                key={draft.title}
                className="draft-option"
                onClick={() => {
                  dispatch({ type: "line", index: 0, value: draft.opening });
                  setConcepts(false);
                  setNotice(
                    `“${draft.title}” is selected for your sample script.`,
                  );
                }}
              >
                <strong>{draft.title}</strong>
                <span>{draft.opening}</span>
                <ArrowRight size={16} aria-hidden />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={offerOpen} onOpenChange={setOfferOpen}>
        <DialogContent className="studio-dialog">
          <DialogHeader>
            <DialogTitle>Your October deal</DialogTitle>
            <DialogDescription>
              The approved offer attached to this sample ad.
            </DialogDescription>
          </DialogHeader>
          <h2 className="text-2xl">$500 off full window replacement</h2>
          <p>Plus 18-month financing. Runs through October 31.</p>
          <p className="flex items-center gap-2 text-checked-ink">
            <Check size={17} aria-hidden />
            The same offer follows the words and scenes.
          </p>
          <p className="text-sm text-meta">
            Offer editing will be connected with the live workspace.
          </p>
        </DialogContent>
      </Dialog>
    </StudioPage>
  );
}
