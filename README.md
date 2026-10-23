# TheSpiffyOne portfolio

A responsive, static portfolio. No framework or runtime dependencies; works on GitHub Pages and any static host.

## Preview and build

- `npm run dev` serves the repository at http://localhost:4173.
- `npm run check` checks JavaScript syntax.
- `npm run build` creates the deployable `dist/` folder.

The root `index.html` also works directly on GitHub Pages. Keep asset paths relative so the `/Portfolio-web/` base path continues to work.

## Update your work

Edit `js/projects.js`. Each project has a unique `id`, category (`uiux` or `logos`), cover, English/Russian descriptions, toolkit, and an `images` array with captions. Add images to `images/` and reference their paths. Projects appear automatically in the filters and galleries. `featured: true` gives a project the full-width treatment in the All work view. `personal: true` uses the custom personal-brand cover.

Links such as `#project/rising-dawn` open a project directly. Images open in an accessible full-screen viewer with previous/next buttons, arrow keys, and Escape to close. The original SVG logo is used throughout. The brand colors are `#e9023e` and `#af0161` in `styles/site.css`.

## Content and language

Homepage content is in `index.html`. Russian translations are in `js/app.js`; project translations are in `js/projects.js`. The language preference is stored in the visitor's browser. Contact and social links use the original portfolio destinations.

Fonts are self-hosted. Manrope is licensed under the SIL Open Font License (see `fonts/Manrope-OFL.txt`). The original portfolio fonts and assets are retained.
