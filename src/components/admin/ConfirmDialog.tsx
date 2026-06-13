"use client";

import { AdminModal } from "@/components/admin/AdminModal";
import { Button } from "@/components/common/Button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  /** Use a destructive accent for irreversible actions like delete. */
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

// Lightweight confirmation dialog reused for destructive admin actions.
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  destructive = false,
  busy = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <AdminModal
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button className="sm:w-auto" disabled={busy} onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            className={destructive ? "bg-error text-white hover:brightness-95 sm:w-auto" : "sm:w-auto"}
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? "Working..." : confirmLabel}
          </Button>
        </div>
      }
      onClose={onClose}
      open={open}
      size="md"
      title={title}
    >
      <p className="text-sm leading-6 text-muted-foreground">{message}</p>
    </AdminModal>
  );
}
