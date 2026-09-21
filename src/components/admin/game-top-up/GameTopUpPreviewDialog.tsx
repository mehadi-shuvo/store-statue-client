"use client";

import GameTopUpCard from "@/components/GameTopUpCard";
import { toCustomerTopUpCardData } from "@/lib/game-top-up";
import type { GameTopUp } from "@/types/game-top-up";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface GameTopUpPreviewDialogProps {
  game: GameTopUp | null;
  open: boolean;
  onClose: () => void;
}

export default function GameTopUpPreviewDialog({
  game,
  open,
  onClose,
}: GameTopUpPreviewDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;

      const focusable = [
        ...(dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        ) ?? []),
      ];
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      previous?.focus();
    };
  }, [onClose, open]);

  if (!open || !game) return null;

  return (
    <div
      className="fixed inset-0 z-[130] overflow-y-auto bg-slate-950/70 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-preview-title"
      onMouseDown={onClose}
    >
      <div
        ref={dialogRef}
        className="mx-auto max-w-xl rounded-3xl bg-white p-5 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="game-preview-title" className="text-xl font-black">
              Customer Card Preview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Uses the real customer card with the currently loaded game and package data.
            </p>
          </div>
          <button
            autoFocus
            aria-label="Close preview"
            onClick={onClose}
            className="rounded-xl border p-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mx-auto max-w-md">
          <GameTopUpCard topUpDataObject={toCustomerTopUpCardData(game)} />
        </div>
      </div>
    </div>
  );
}
