"use client";

import { FolderOpen, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onNewProject?: () => void;
  onRenameProject?: (project: Project) => void;
  onDeleteProject?: (project: Project) => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-10 text-center">
      <Icon className="h-8 w-8 text-copy-faint" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-copy-secondary">{title}</p>
        <p className="text-xs text-copy-muted">{description}</p>
      </div>
    </div>
  );
}

interface ProjectItemProps {
  project: Project;
  onRename?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

function ProjectItem({ project, onRename, onDelete }: ProjectItemProps) {
  const isOwner = project.role === "owner";

  return (
    <li className="group flex items-center gap-1 rounded-xl px-2 py-1.5 hover:bg-subtle">
      <span className="min-w-0 flex-1 truncate text-sm text-copy-secondary group-hover:text-copy-primary">
        {project.name}
      </span>
      {isOwner ? (
        <div className="flex shrink-0 items-center gap-0.5 md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onRename?.(project)}
            aria-label={`Rename ${project.name}`}
            className="rounded-lg text-copy-muted hover:text-copy-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete?.(project)}
            aria-label={`Delete ${project.name}`}
            className="rounded-lg text-copy-muted hover:text-error"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null}
    </li>
  );
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  onNewProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const ownedProjects = projects.filter((project) => project.role === "owner");
  const sharedProjects = projects.filter(
    (project) => project.role === "collaborator"
  );

  return (
    <>
      {/* Mobile-only scrim: tapping outside the sidebar closes it. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-base/60 backdrop-blur-xs transition-opacity duration-200 md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        aria-label="Projects"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "fixed top-16 bottom-2 left-2 z-40 flex w-72 flex-col rounded-2xl border border-surface-border bg-surface/90 shadow-2xl backdrop-blur-md transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-[calc(100%+1rem)]"
        )}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <h2 className="text-sm font-semibold text-copy-primary">Projects</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-xl text-copy-muted hover:text-copy-primary"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="my-projects" className="min-h-0 flex-1 px-4">
          <TabsList className="w-full">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
          <TabsContent value="my-projects" className="flex min-h-0">
            {ownedProjects.length > 0 ? (
              <ul className="flex w-full flex-col gap-0.5 overflow-y-auto py-2">
                {ownedProjects.map((project) => (
                  <ProjectItem
                    key={project.id}
                    project={project}
                    onRename={onRenameProject}
                    onDelete={onDeleteProject}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={FolderOpen}
                title="No projects yet"
                description="Projects you create will appear here."
              />
            )}
          </TabsContent>
          <TabsContent value="shared" className="flex min-h-0">
            {sharedProjects.length > 0 ? (
              <ul className="flex w-full flex-col gap-0.5 overflow-y-auto py-2">
                {sharedProjects.map((project) => (
                  <ProjectItem key={project.id} project={project} />
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Users}
                title="Nothing shared yet"
                description="Projects shared with you will appear here."
              />
            )}
          </TabsContent>
        </Tabs>

        <div className="border-t border-surface-border p-4">
          <Button onClick={onNewProject} className="h-9 w-full rounded-xl">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}
