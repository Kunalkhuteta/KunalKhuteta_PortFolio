<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project structure

- Portfolio section copy lives in `src/data/*.ts`; sections render from that data via components in `src/components/portfolio/`. Keep content edits in `src/data/` — the components read from it.
- Section headers use a framer-motion mask reveal where `whileInView` observes the un-transformed mask wrapper and variants drive the inner text; observing the translated text directly never fires its in-view check.
