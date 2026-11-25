import { auth } from "@clerk/nextjs/server";

import { EditorWorkspace } from "@/components/editor/editor-workspace";

export default async function EditorPage() {
  await auth.protect();

  return <EditorWorkspace />;
}
