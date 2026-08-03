## 2026-08-03

### What I worked on

- Fixed the dark theme bug.

### What I did

- Found duplicate `:root` variables in `App.css`.
- Removed duplicate theme variables.
- Consolidated all theme variables into `index.css`.
- Added:
  - `--bg-rgb`
  - `--surface-rgb`
- Updated the overlay gradient to react to theme changes.
- Improved the dark color palette.
- Added smooth transitions for:
  - Background
  - Text
  - Border colors

### Where I got stuck

- React state worked correctly, but the UI never changed.

### How I worked through it

- Compared `App.css` and `index.css`.
- Found duplicate `:root` declarations overriding the theme variables.

### Decisions made

- Keep all theme variables in `index.css`.
- Component CSS files should only consume variables.
- Add smooth transitions when switching themes.

### Open questions

- None.

### Time spent

**2h**
