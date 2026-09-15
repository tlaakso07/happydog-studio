"use client";

import { useState } from "react";
import { ArrowUpRight, LockKeyhole, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStudioPreview } from "./preview-provider";
import { ReferencePhoto, StudioPage, CheckList } from "./shared";
import { plainStatus } from "@/lib/plain";

export function BrandScreen() {
  const { payload } = useStudioPreview();
  const [bookId, setBookId] = useState<string | null>(null);
  const [changeOpen, setChangeOpen] = useState(false);
  const [change, setChange] = useState("");
  const [saved, setSaved] = useState(false);
  const book = payload.books.find((item) => item.id === bookId);
  return (
    <StudioPage wide>
      <header className="brand-heading">
        <h1>Brand room</h1>
        <div>
          <p>
            Northline’s locked system. Every ad is built from what lives here,
            nothing else.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="brand-lock">
              <LockKeyhole size={14} aria-hidden />
              {plainStatus("approved")} and locked · v2 · Oct 3
            </span>
            <Button
              size="md"
              variant="outline"
              onClick={() => {
                setChangeOpen(true);
                setSaved(false);
              }}
            >
              Request a change
            </Button>
          </div>
        </div>
      </header>
      <div className="brand-layout">
        <div className="brand-books">
          {payload.books.map((item, index) => (
            <button
              key={item.id}
              className={`brand-book ${item.id === "voice" ? "voice-book" : ""}`}
              onClick={() => setBookId(item.id)}
              aria-label={`Open ${item.title} book`}
            >
              <div className="brand-book-heading">
                <div>
                  <span className="eyebrow">
                    {index === 5 ? "Book" : "Lockbook"}{" "}
                    <span className="book-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <h2>{item.title}</h2>
                </div>
                <ArrowUpRight size={17} aria-hidden />
              </div>
              {item.photo ? (
                <>
                  <ReferencePhoto name={item.photo} />
                  <p>{item.description}</p>
                </>
              ) : (
                <blockquote>
                  “Plain talk from
                  <br />
                  the crew, never
                  <br />
                  salesy.”
                </blockquote>
              )}
            </button>
          ))}
        </div>
        <aside className="surface-panel provenance">
          <h2>Where every rule came from</h2>
          <ul>
            <li>
              <strong>Navy #16345E as primary</strong>
              <span>From brand-standards.pdf p.4</span>
            </li>
            <li>
              <strong>Install shirt, gray twill</strong>
              <span>From uniform-photos IMG_0413</span>
            </li>
            <li>
              <strong>“Plain talk” voice rule</strong>
              <span>From founder voice note · Sep 12</span>
            </li>
          </ul>
          <p>Signed off by Dana Keller · Oct 3</p>
          <p className="provenance-note">
            Sample sources from the design. Original files aren’t attached to
            this preview.
          </p>
        </aside>
      </div>
      <Dialog
        open={Boolean(book)}
        onOpenChange={(open) => {
          if (!open) setBookId(null);
        }}
      >
        <DialogContent className="studio-dialog">
          {book && (
            <>
              <DialogHeader>
                <DialogTitle>{book.title}</DialogTitle>
                <DialogDescription>
                  Northline Windows · Brand system v2
                </DialogDescription>
              </DialogHeader>
              {book.photo && (
                <ReferencePhoto
                  name={book.photo}
                  className="brand-detail-photo"
                />
              )}
              <CheckList items={book.details} />
              <div className="border-t border-line pt-4">
                <p className="eyebrow">Source</p>
                <p className="mt-2 text-sm text-secondary-ink">{book.source}</p>
                <p className="mt-2 text-xs text-meta">
                  Sample book for visual review. No source file has been
                  uploaded.
                </p>
              </div>
              <Button
                size="md"
                variant="outline"
                onClick={() => {
                  setBookId(null);
                  setChangeOpen(true);
                  setSaved(false);
                }}
              >
                Request a change
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={changeOpen} onOpenChange={setChangeOpen}>
        <DialogContent className="studio-dialog">
          <DialogHeader>
            <DialogTitle>
              {saved
                ? "Your sample request is ready"
                : "What should we change?"}
            </DialogTitle>
            <DialogDescription>
              {saved
                ? "Saved in this open preview only. It hasn’t been sent to anyone."
                : "The brand room stays locked while your team reviews a change. This preview won’t send a request."}
            </DialogDescription>
          </DialogHeader>
          {saved ? (
            <>
              <p className="flex items-start gap-2">
                <Check
                  className="shrink-0 text-checked-ink"
                  size={18}
                  aria-hidden
                />
                <span className="whitespace-pre-wrap">{change}</span>
              </p>
              <Button
                size="md"
                variant="outline"
                onClick={() => setChangeOpen(false)}
              >
                Done
              </Button>
            </>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (change.trim()) setSaved(true);
              }}
            >
              <label className="eyebrow" htmlFor="brand-change">
                Your change
              </label>
              <textarea
                className="line-editor mt-3"
                id="brand-change"
                maxLength={2000}
                required
                rows={5}
                value={change}
                onChange={(event) => setChange(event.target.value)}
                placeholder="New work shirts, an updated product, a different voice..."
              />
              <Button
                className="mt-4"
                size="xl"
                type="submit"
                disabled={!change.trim()}
              >
                Save sample request
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </StudioPage>
  );
}
