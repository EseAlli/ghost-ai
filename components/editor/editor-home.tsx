import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EditorHomeProps {
  onNewProject: () => void;
}

export function EditorHome({ onNewProject }: EditorHomeProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-xl font-semibold text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the
          sidebar.
        </p>
      </div>
      <Button onClick={onNewProject} className="h-9 rounded-xl px-4">
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </div>
  );
}
