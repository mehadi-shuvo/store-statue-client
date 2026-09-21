import type { ReactNode } from "react";

export default function HomeSectionHeading({
  eyebrow,
  titleId,
  title,
  description,
  action,
  tone = "light",
}: {
  eyebrow: string;
  titleId?: string;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className={`text-xs font-black uppercase tracking-[0.18em] ${tone === "dark" ? "text-blue-300" : "text-blue-700"}`}>
          {eyebrow}
        </p>
        <h2 id={titleId} className={`mt-3 text-3xl font-black tracking-tight sm:text-4xl ${tone === "dark" ? "text-white" : "text-slate-950"}`}>
          {title}
        </h2>
        <p className={`mt-3 text-sm leading-7 sm:text-base ${tone === "dark" ? "text-slate-300" : "text-slate-600"}`}>
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
