## 2026-08-02

### What I worked on

- Code cleanup.
- UI improvements.

### What I did

- Moved Theme and Flyout types into dedicated `.types.ts` files.
- Extracted Flyout helper logic into `flyoutHelpers.ts`.
- Added unit tests for the helper.
- Replaced the emoji theme toggle with an accessible switch using `aria-pressed`.
- Redesigned the Flyout:
  - Floating pill layout
  - Thumbnail previews
  - Maximum of 4 thumbnails
  - `+N` indicator for additional selected items

### Where I got stuck

- The original Flyout looked too large and didn't clearly show selected items.

### How I worked through it

- Added thumbnail previews and redesigned the Flyout into a compact floating capsule.

### Decisions made

- Kept Zustand subscriptions inside the components (`Card`, `Flyout`) to avoid prop drilling.

### Open questions

- None.

### Time spent

**2h**
