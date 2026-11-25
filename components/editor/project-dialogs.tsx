"use client";

import { useRef } from "react";
import type { FormEvent } from "react";

import { EditorDialog } from "@/components/editor/editor-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectDialogsController } from "@/hooks/use-project-dialogs";

interface ProjectDialogsProps {
  controller: ProjectDialogsController;
}

const CREATE_FORM_ID = "create-project-form";
const RENAME_FORM_ID = "rename-project-form";

function handleOpenChange(controller: ProjectDialogsController) {
  return (open: boolean) => {
    if (!open) controller.close();
  };
}

function CancelButton({ controller }: ProjectDialogsProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={controller.close}
      disabled={controller.isSubmitting}
      className="rounded-xl"
    >
      Cancel
    </Button>
  );
}

function CreateProjectDialog({ controller }: ProjectDialogsProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void controller.submitCreate();
  }

  return (
    <EditorDialog
      open={controller.activeDialog === "create"}
      onOpenChange={handleOpenChange(controller)}
      title="Create project"
      description="Give your new architecture workspace a name."
      footer={
        <>
          <CancelButton controller={controller} />
          <Button
            type="submit"
            form={CREATE_FORM_ID}
            disabled={!controller.canCreate}
            className="rounded-xl"
          >
            {controller.isSubmitting ? "Creating…" : "Create project"}
          </Button>
        </>
      }
    >
      <form
        id={CREATE_FORM_ID}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
      >
        <label
          htmlFor="create-project-name"
          className="text-sm font-medium text-copy-secondary"
        >
          Project name
        </label>
        <Input
          id="create-project-name"
          value={controller.name}
          onChange={(event) => controller.setName(event.target.value)}
          placeholder="e.g. Payments Platform"
          autoComplete="off"
          disabled={controller.isSubmitting}
          aria-invalid={controller.slugError ? true : undefined}
          aria-describedby="create-project-slug"
          className="h-9 rounded-xl"
        />
        <div id="create-project-slug" aria-live="polite" className="flex flex-col gap-1">
          <p className="text-xs text-copy-muted">
            Slug:{" "}
            <span className="font-mono text-copy-secondary">
              {controller.slug || "—"}
            </span>
          </p>
          {controller.slugError ? (
            <p className="text-xs text-error">{controller.slugError}</p>
          ) : null}
        </div>
      </form>
    </EditorDialog>
  );
}

function RenameProjectDialog({ controller }: ProjectDialogsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const projectName = controller.targetProject?.name ?? "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void controller.submitRename();
  }

  return (
    <EditorDialog
      open={controller.activeDialog === "rename"}
      onOpenChange={handleOpenChange(controller)}
      initialFocus={inputRef}
      title="Rename project"
      description={
        <>
          Enter a new name for{" "}
          <span className="font-medium text-copy-secondary">
            {projectName}
          </span>
          .
        </>
      }
      footer={
        <>
          <CancelButton controller={controller} />
          <Button
            type="submit"
            form={RENAME_FORM_ID}
            disabled={!controller.canRename}
            className="rounded-xl"
          >
            {controller.isSubmitting ? "Saving…" : "Rename"}
          </Button>
        </>
      }
    >
      <form
        id={RENAME_FORM_ID}
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
      >
        <label
          htmlFor="rename-project-name"
          className="text-sm font-medium text-copy-secondary"
        >
          Project name
        </label>
        <Input
          ref={inputRef}
          id="rename-project-name"
          value={controller.name}
          onChange={(event) => controller.setName(event.target.value)}
          autoComplete="off"
          disabled={controller.isSubmitting}
          className="h-9 rounded-xl"
        />
      </form>
    </EditorDialog>
  );
}

function DeleteProjectDialog({ controller }: ProjectDialogsProps) {
  const projectName = controller.targetProject?.name ?? "";

  return (
    <EditorDialog
      open={controller.activeDialog === "delete"}
      onOpenChange={handleOpenChange(controller)}
      title="Delete project"
      description={
        <>
          <span className="font-medium text-copy-secondary">
            {projectName}
          </span>{" "}
          will be permanently deleted. This cannot be undone.
        </>
      }
      footer={
        <>
          <CancelButton controller={controller} />
          <Button
            type="button"
            variant="destructive"
            onClick={() => void controller.submitDelete()}
            disabled={controller.isSubmitting}
            className="rounded-xl"
          >
            {controller.isSubmitting ? "Deleting…" : "Delete project"}
          </Button>
        </>
      }
    />
  );
}

export function ProjectDialogs({ controller }: ProjectDialogsProps) {
  return (
    <>
      <CreateProjectDialog controller={controller} />
      <RenameProjectDialog controller={controller} />
      <DeleteProjectDialog controller={controller} />
    </>
  );
}
