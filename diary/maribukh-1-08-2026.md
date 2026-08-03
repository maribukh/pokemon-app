## 2026-08-01

### What I worked on

- Built the **Flyout** component.
- Implemented **CSV export**.
- Added **theme switching** with Context API.

### What I did

- Flyout reads `selectedItems` directly from the Zustand store.
- Added:
  - Selected items count
  - **Unselect all** button
  - **Download CSV** button
- Implemented CSV export using:
  - `Blob`
  - `URL.createObjectURL`
  - Temporary anchor element
- Created `ThemeContext`.
- Added light/dark theme toggle.
- Applied the theme using the `data-theme` attribute on the document root.

### Where I got stuck

- Unsure whether to use `position: sticky` or `position: fixed`.

### How I worked through it

- Chose `position: fixed` because it guarantees the Flyout always remains visible.

### Decisions made

- Replaced the OS-based theme with an explicit `data-theme`.
- Moved CSV generation into a separate `csv.ts` utility.

### Open questions

- Improve the Flyout and theme toggle design.

### Time spent

**4h**
