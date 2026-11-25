"use client";

import { useState } from "react";

import { slugify, validateSlug } from "@/lib/slug";
import type { Project } from "@/types/project";

export type ProjectDialogType = "create" | "rename" | "delete";

interface ProjectDialogHandlers {
  /** Slugs already in use; a new project's slug must not match any of them. */
  existingSlugs: readonly string[];
  onCreate: (input: { name: string; slug: string }) => void | Promise<void>;
  onRename: (project: Project, name: string) => void | Promise<void>;
  onDelete: (project: Project) => void | Promise<void>;
}

/**
 * Owns the dialog, form, and loading state for the Create / Rename / Delete
 * project dialogs. Mutations are delegated to the supplied handlers.
 */
export function useProjectDialogs({
  existingSlugs,
  onCreate,
  onRename,
  onDelete,
}: ProjectDialogHandlers) {
  const [activeDialog, setActiveDialog] = useState<ProjectDialogType | null>(
    null
  );
  // Kept after closing so dialog content stays stable during the exit animation.
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedName = name.trim();
  const slug = slugify(name);
  // Only report an error once the user has typed something.
  const slugError =
    trimmedName.length > 0 ? validateSlug(slug, existingSlugs) : null;

  function openCreate() {
    setTargetProject(null);
    setName("");
    setActiveDialog("create");
  }

  function openRename(project: Project) {
    setTargetProject(project);
    setName(project.name);
    setActiveDialog("rename");
  }

  function openDelete(project: Project) {
    setTargetProject(project);
    setActiveDialog("delete");
  }

  function close() {
    if (isSubmitting) return;
    setActiveDialog(null);
  }

  async function run(action: () => void | Promise<void>) {
    setIsSubmitting(true);
    try {
      await action();
      setActiveDialog(null);
    } finally {
      setIsSubmitting(false);
    }
  }

  const canCreate =
    trimmedName.length > 0 && slugError === null && !isSubmitting;
  const canRename =
    targetProject !== null &&
    trimmedName.length > 0 &&
    trimmedName !== targetProject.name &&
    !isSubmitting;

  async function submitCreate() {
    if (!canCreate) return;
    await run(() => onCreate({ name: trimmedName, slug }));
  }

  async function submitRename() {
    if (!canRename || !targetProject) return;
    await run(() => onRename(targetProject, trimmedName));
  }

  async function submitDelete() {
    if (!targetProject || isSubmitting) return;
    await run(() => onDelete(targetProject));
  }

  return {
    activeDialog,
    targetProject,
    name,
    setName,
    slug,
    slugError,
    isSubmitting,
    canCreate,
    canRename,
    openCreate,
    openRename,
    openDelete,
    close,
    submitCreate,
    submitRename,
    submitDelete,
  };
}

export type ProjectDialogsController = ReturnType<typeof useProjectDialogs>;
