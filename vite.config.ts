// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Automatically choose the ideal Nitro deployment preset for Vercel, Render, or custom environments
// while allowing Lovable's sandbox build to override seamlessly.
const detectedPreset =
  process.env["NITRO_PRESET"] ||
  (process.env["VERCEL"] ? "vercel" : process.env["RENDER"] ? "node-server" : "node-server");

export default defineConfig({
  nitro: {
    preset: detectedPreset,
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
