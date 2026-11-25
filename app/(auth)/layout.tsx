import { FileText, Ghost, Share2, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: "AI Architecture Generation",
    description: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    description: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: FileText,
    title: "Instant Spec Generation",
    description: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
];

async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen flex-1 bg-base font-sans lg:grid-cols-2">
      <aside className="hidden flex-col justify-between border-r border-surface-border bg-surface p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-base">
            <Ghost className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold text-copy-primary">Ghost AI</span>
        </div>

        <div className="max-w-xl space-y-12">
          <div className="space-y-5">
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-copy-primary">
              Design systems at the
              <br />
              speed of thought.
            </h1>
            <p className="text-lg leading-relaxed text-copy-muted">
              Describe your architecture in plain English. Ghost AI maps it to a
              shared canvas your whole team can refine in real time.
            </p>
          </div>

          <ul className="space-y-8">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-brand-dim text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="space-y-1">
                  <p className="text-base font-medium text-copy-primary">{title}</p>
                  <p className="text-sm text-copy-muted">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-copy-faint">
          © <CopyrightYear /> Ghost AI. All rights reserved.
        </p>
      </aside>

      <main className="flex items-center justify-center p-6">{children}</main>
    </div>
  );
}
