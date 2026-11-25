"use client";

import { useState } from "react";

import { EditorHome } from "@/components/editor/editor-home";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { useProjectDialogs } from "@/hooks/use-project-dialogs";
import { MOCK_PROJECTS } from "@/lib/mock-projects";
import type { Project } from "@/types/project";

export function EditorWorkspace() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Mock, in-memory project list — no API calls or persistence yet.
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const dialogs = useProjectDialogs({
    existingSlugs: projects.map((project) => project.slug),
    onCreate: ({ name, slug }) => {
      setProjects((current) => [
        { id: crypto.randomUUID(), name, slug, role: "owner" },
        ...current,
      ]);
    },
    onRename: (project, name) => {
      setProjects((current) =>
        current.map((item) =>
          item.id === project.id ? { ...item, name } : item
        )
      );
    },
    onDelete: (project) => {
      setProjects((current) =>
        current.filter((item) => item.id !== project.id)
      );
    },
  });

  return (
    <div className="flex h-screen flex-col bg-base">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <ProjectSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projects={projects}
        onNewProject={dialogs.openCreate}
        onRenameProject={dialogs.openRename}
        onDeleteProject={dialogs.openDelete}
      />
      <main className="flex-1">
        <EditorHome onNewProject={dialogs.openCreate} />
      </main>
      <ProjectDialogs controller={dialogs} />
    </div>
  );
}
