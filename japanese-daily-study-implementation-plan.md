# Japanese Daily Study App — Implementation Plan

## Product summary
A mobile-friendly Japanese daily study web app that sends a short Telegram notification at 9am UK time and opens a lesson page with 3–5 new words plus review items. The app stores progress locally, uses a JLPT-based corpus, and lets the user rate each word as easy, medium, or hard.

## Assumptions
- Single user
- Web app is source of truth
- Telegram is notification-only
- Corpus is based on JLPT vocabulary
- One lesson per day only
- Optional AnkiConnect support can be added later

## Phase 1 — Corpus and data model
1. Choose a JLPT-based corpus source.
2. Define normalization rules for each word entry:
   - kanji
   - reading
   - hiragana
   - English meaning
   - example sentences
   - JLPT level
   - corpus metadata
3. Create a corpus import script.
4. Deduplicate and clean imported entries.
5. Persist words into the database.
6. Verify the corpus is large enough for daily conversation practice.

## Phase 2 — Database and core entities
1. Design tables for:
   - users
   - words
   - word_examples
   - lessons
   - lesson_words
   - reviews
   - settings
   - telegram accounts / chat mapping
2. Add migrations.
3. Add basic seed data.
4. Add indexes for lesson lookup and review scheduling.

## Phase 3 — Lesson generation
1. Implement daily lesson generation.
2. Ensure exactly one lesson is generated per day.
3. At 9am UK time, select:
   - 3–5 new words
   - overdue hard words
   - some medium-priority reviews
   - a few random older review words
4. Store the generated lesson in the database.
5. Make generation idempotent.
6. Allow manual regeneration in dev/admin mode.

## Phase 4 — Review and scheduling logic
1. Save user feedback for every word.
2. Define interval mapping:
   - easy → longer delay
   - medium → moderate delay
   - hard → short delay
3. Update next-review timestamps after each response.
4. Prefer hard items sooner in future lessons.
5. Prevent duplicate reviews on the same day unless intentional.

## Phase 5 — Web app UI
### Screens
1. Today page
2. Word detail page
3. History page
4. Settings page

### Today page
- Show today’s lesson
- Present each word with:
  - kanji
  - reading
  - hiragana
  - English translation
  - 3 example sentences
- Include easy / medium / hard buttons
- Show completion state

### Word detail page
- Full word information
- Review history
- Difficulty trend

### History page
- Past lessons
- Completed / incomplete status
- Hardest words list

### Settings page
- Daily lesson size preference: 3, 4, or 5
- Telegram connection status
- Timezone confirmation

## Phase 6 — Telegram integration
1. Create Telegram bot.
2. Store the user’s chat ID.
3. Send a short notification at 9am UK time.
4. Include a link to the web app.
5. Log send failures and retries.
6. Add a test-notification command.

## Phase 7 — Scheduler and background jobs
1. Add a scheduler for 9am UK time.
2. Handle UK daylight saving time correctly.
3. Trigger lesson generation and notification together.
4. Ensure jobs are idempotent.
5. Add monitoring/logging for job success and failure.

## Phase 8 — Optional AnkiConnect support
1. Add export of selected words to Anki.
2. Keep this separate from the core flow.
3. Do not make the app dependent on Anki.
4. Add import hooks only if needed later.

## Phase 9 — Testing
1. Corpus import tests.
2. Lesson generation tests.
3. Review scheduling tests.
4. Telegram send tests.
5. Mobile UI tests.
6. Timezone tests for UK local time.
7. Idempotency tests for daily jobs.

## Phase 10 — Deployment
1. Set environment variables.
2. Run migrations.
3. Deploy web app.
4. Deploy background worker / scheduler.
5. Connect Telegram bot.
6. Verify the 9am UK job.
7. Confirm the full user flow end to end.

## Suggested project structure
- `app/` — frontend pages and UI
- `app/api/` — backend endpoints
- `lib/` — lesson generation, scheduling, utilities
- `db/` — schema and migrations
- `scripts/` — corpus import and admin utilities
- `jobs/` — scheduled task handlers
- `integrations/telegram/` — Telegram bot code
- `integrations/anki/` — optional AnkiConnect helpers

## Build order
1. Pick the JLPT corpus source.
2. Build database schema.
3. Implement corpus import.
4. Implement lesson generation.
5. Build the Today page.
6. Add review feedback storage.
7. Add scheduling logic.
8. Add Telegram notifications.
9. Add history/settings pages.
10. Add tests.
11. Deploy.
12. Add AnkiConnect support later if needed.
