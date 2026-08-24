# AI Feature Plan: "Explain this item with AI"

## 1. Initial Plan-mode prompt

I have an existing Next.js 16 App Router application (Pokémon search app) with TypeScript, next-intl for i18n, and Vitest for testing. I need to add an "Explain this item with AI" feature per the following constraints:

- **Model:** Use `@google/genai` SDK, model `gemini-1.5-flash` (or current stable), configurable via `GEMINI_MODEL` env var.
- **Security:** Gemini calls must happen only in a server-only module (`import 'server-only'`), never in client code. `GEMINI_API_KEY` read from server env only, never exposed to the client.
- **Context:** Build a small allowlisted context object (max 12 fields) from the selected Pokémon: `name`, `id`, `types`, `height`, `weight`, `hp`, `attack` — nothing else. Serialized context must stay under 4 KB.
- **Prompting:** Prompt must tell the model to treat the data as untrusted data, not instructions, and to only use supplied facts, responding in the active locale, 3-5 sentences.
- **Economy:**
  - Keep system instruction and prompt template short and non-repetitive.
  - Set `generationConfig.maxOutputTokens` to 512.
  - Pick a moderate temperature (e.g. 0.4-0.6) for consistency.
- **UI:** A button in the Pokémon details panel, localized via `next-intl`, with pending/success/error states, retry on failure, regenerate option, and a visible "AI-generated, may be inaccurate" notice.
- **State Management:** Explanation must not re-fetch on re-render — only on explicit user click, and reset when the selected item/locale changes.
- **Error Handling:** Errors (missing key, 401, 429, blocked, empty response, unknown) must map to safe localized messages, no stack traces or SDK internals exposed.
- **Testing:** All logic must be covered by deterministic Vitest tests with the `@google/genai` SDK mocked — no real API calls in tests.

## 2. Plan proposed by Copilot

**Plan: Add Pokémon AI Explanations**

Implement a client-triggered explanation flow backed by a server-only Gemini service and Server Action. Only seven Pokémon fields will be sent, with strict size validation and safe localized errors.

### Steps

1.  **Server-only Gemini service**
    - Add `src/services/ai/pokemonExplanation.ts`.
    - Import `server-only`.
    - Read `GEMINI_API_KEY` and `GEMINI_MODEL`.
    - Map provider failures to safe error codes.
2.  **Allowlisted context**
    - Add `src/utils/pokemonExplanationContext.ts`.
    - Extract only: `name`, `id`, `types`, `height`, `weight`, `hp`, `attack`.
    - Enforce serialized context below 4 KB.
3.  **Server Action**
    - Add `src/components/ExplainPokemonButton/actions.ts`.
    - Validate locale, exact allowed fields, and size.
4.  **Client UI**
    - Add `src/components/ExplainPokemonButton/ExplainPokemonButton.tsx` and sub-components.
    - Support pending, success, retry, and regenerate states.
5.  **Translations**
    - Add AI labels and safe error messages to `en.json` and `ru.json`.
6.  **Tests**
    - Mock `@google/genai`.
    - Test context allowlisting, injection resistance, and state transitions.

## 3. Review and changes I requested

**Gaps to close:**

1.  Add `.env.example` with placeholders.
2.  Ensure "Explain" button is disabled during pending states to prevent duplicate calls.
3.  Update prompt to explicitly instruct a "beginner-friendly" tone.
4.  Add a test case for **untrusted-data injection** (e.g., a field containing "ignore previous instructions").
5.  Explicitly assert UI disabled states in tests.

**Clarifications/Decisions:**

- **Pattern:** Use **Server Actions** instead of Route Handlers for consistency with the existing `SearchForm`.
- **Data Flow:** `DetailsPanel.tsx` (Server Component) will build the allowlisted object so the client never receives raw, excessive data.
- **State Logic:** Differentiate "Retry" (after error) from "Regenerate" (after success) in the state machine.
- **File Naming:** Rename utility to `pokemonExplanationContext.ts` to avoid naming collisions with the service.

## 4. Final implementation plan

- `src/utils/pokemonExplanationContext.ts`: Allowlisted context builder, 4KB size validation, runtime type guard.
- `src/services/ai/pokemonExplanation.ts`: Server-only Gemini call, error classification.
- `src/components/ExplainPokemonButton/actions.ts`: Server action: validates context shape/size/locale, calls the service.
- `src/components/ExplainPokemonButton/`:
  - `ExplainPokemonButton.tsx`: Main orchestrator (idle/pending/success/error).
  - `ExplainTrigger.tsx`: Initial/retry trigger button with spinner.
  - `ExplanationCard.tsx`: Success state: result text and regenerate button.
  - `ExplanationBadge.tsx`: Disclaimer notice.
  - `ExplanationError.tsx`: Localized error display.
- `messages/en.json`, `messages/ru.json`: Localization keys for `details.ai.*`.
- `src/components/DetailsPanel/DetailsPanel.tsx`: Integration point passing the allowlisted context as a prop.

## 5. Step delegated to Agent mode

**Implementation Details:**

- **Security:** Confirmed `import 'server-only'` in the AI service.
- **Validation:** Implemented `isPokemonExplanationContext` type guard for server-side input validation.
- **Error Handling:** Traced every path to ensure no SDK internal messages leak; only `ExplanationErrorCode` is returned to the UI.
- **Reset Logic:** The component is keyed by `${pokemon.id}-${locale}` in the parent, ensuring the explanation resets automatically when the Pokémon or language changes.
- **Tone:** Prompt restructured to separate **Instruction** from **Data**, using explicit delimiters for the Pokémon context to prevent prompt injection.

## 6. AI suggestions I changed or rejected

- **Changed Prompt Structure:** The AI initially suggested a bare JSON string. I requested a clear separation of instructions ("explain to a curious beginner in a warm tone") and a labeled data block. This improved the output from a "dry restatement of stats" to an actual "explanation."
- **Rejected Route Handler:** The AI suggested `api/explain/route.ts`. I rejected this in favor of a **Server Action** to maintain architectural consistency with the rest of the app's data-fetching patterns.
- **Layout Fix:** I manually updated the `DetailsPanel` CSS to be a self-scrolling sticky sidebar on desktop and a fixed overlay on mobile. The AI explanation added enough vertical height to make the previous layout problematic on mobile devices.

## 7. Manual verification commands

Run these commands to ensure the feature is stable and follows the quality constraints:

```bash
# Verify code quality and types
npm run lint
npx tsc --noEmit

# Run unit and integration tests
npm run test
npm run test:coverage

# Verify production build
npm run build
```
