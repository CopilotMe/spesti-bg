# Spesti.app — Project Memory

- When making changes to the app, ALWAYS update `/release-notes` page with a new version entry before committing
- When work is complete and build passes, ALWAYS commit and push without asking — the user expects autonomous workflow
- Release notes file: `src/app/release-notes/page.tsx` — add new entries at the TOP of the `releases[]` array
- Versioning: increment minor version (0.x.0) for new features/pages, patch (0.x.y) for fixes
