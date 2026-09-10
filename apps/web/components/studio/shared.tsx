import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PHOTOS, PREVIEW_JOB_ID } from "@/lib/studio-preview";
import { plainStatus } from "@/lib/plain";
import type { ReactNode } from "react";

export function PreviewNote() {
  return (
    <p className="preview-note">
      <span className="preview-dot" />
      Design preview<span className="hidden sm:inline"> · Sample content</span>
      <span className="ml-auto">Changes reset on reload</span>
    </p>
  );
}

export function StudioPage({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`studio-page${wide ? " studio-page-wide" : ""}`}>
      <PreviewNote />
      {children}
    </div>
  );
}

export function ReferencePhoto({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const photo = PHOTOS[name];
  return (
    <div
      role="img"
      aria-label={photo.alt}
      className={`reference-photo ${className}`}
      style={{ aspectRatio: `${photo.width}/${photo.height}` }}
    >
      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        viewBox={`${photo.x} ${photo.y} ${photo.width} ${photo.height}`}
        preserveAspectRatio={name === "curb" ? "xMaxYMid slice" : "xMidYMid slice"}
        className="absolute inset-0"
      >
        <image
          href={`/fixtures/reference/${photo.source}.png`}
          width="2048"
          height={(1536 * 2048) / 2720}
        />
      </svg>
    </div>
  );
}

export function FlowSteps({ base, active }: { base: string; active: number }) {
  const steps = [
    { label: "The brief", href: `${base}/create` },
    { label: "The words", href: `${base}/jobs/${PREVIEW_JOB_ID}/script` },
    { label: "The scenes", href: `${base}/jobs/${PREVIEW_JOB_ID}/scenes` },
    { label: "Generate", href: `${base}/jobs/${PREVIEW_JOB_ID}/scenes#render` },
  ];
  return (
    <nav aria-label="Ad creation progress" className="flow-steps">
      {steps.map((step, index) => (
        <Link
          key={step.label}
          href={step.href}
          aria-current={index === active ? "step" : undefined}
          className={index === active ? "flow-step active" : "flow-step"}
        >
          <span className="flow-number">
            {index < active ? <Check size={15} aria-hidden /> : index + 1}
          </span>
          <span>{step.label}</span>
          {index < 3 && <span className="flow-connector" />}
        </Link>
      ))}
    </nav>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <Check size={17} aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CheckedChip() {
  return (
    <span className="checked-chip">
      <Check size={13} aria-hidden />
      {plainStatus("ready_for_approval")}
    </span>
  );
}

export function BackToHome({ base }: { base: string }) {
  return (
    <Link
      href={base}
      className="inline-flex items-center gap-2 text-sm text-cobalt"
    >
      Back to home <ArrowRight size={15} aria-hidden />
    </Link>
  );
}
