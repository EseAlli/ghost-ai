import { dark } from "@clerk/ui/themes";

/**
 * Clerk appearance: Clerk's `dark` theme as the base, with variables
 * pointed at the app's CSS custom properties from `globals.css`.
 */
export const clerkAppearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--bg-base)",
    colorBackground: "var(--bg-surface)",
    colorForeground: "var(--text-primary)",
    colorNeutral: "var(--text-primary)",
    colorMuted: "var(--bg-subtle)",
    colorMutedForeground: "var(--text-muted)",
    colorInput: "var(--bg-elevated)",
    colorInputForeground: "var(--text-primary)",
    colorBorder: "var(--border-default)",
    colorRing: "var(--accent-primary)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "0.9375rem",
    borderRadius: "var(--radius)",
  },
};
