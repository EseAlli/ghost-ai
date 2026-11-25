"use client";

import type { ComponentProps, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DialogRootProps = ComponentProps<typeof Dialog>;
type DialogContentProps = ComponentProps<typeof DialogContent>;

interface EditorDialogProps {
  open?: DialogRootProps["open"];
  onOpenChange?: DialogRootProps["onOpenChange"];
  /** Optional element that opens the dialog when clicked. */
  trigger?: ComponentProps<typeof DialogTrigger>["render"];
  title: ReactNode;
  description?: ReactNode;
  /** Footer action buttons, rendered right-aligned. */
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Element to focus when the dialog opens. */
  initialFocus?: DialogContentProps["initialFocus"];
}

/**
 * Shared dialog pattern for the editor: token-styled wrapper around the
 * shadcn Dialog primitives with a title, optional description, body, and
 * footer actions.
 */
export function EditorDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  footer,
  children,
  className,
  initialFocus,
}: EditorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger render={trigger} /> : null}
      <DialogContent
        initialFocus={initialFocus}
        className={cn(
          "gap-5 rounded-3xl border border-surface-border bg-elevated p-6 text-copy-primary ring-0 sm:max-w-md",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle className="text-copy-primary">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="text-copy-muted">
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {children}

        {footer ? (
          <DialogFooter className="-mx-6 -mb-6 rounded-b-3xl border-surface-border bg-surface px-6 py-4">
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
