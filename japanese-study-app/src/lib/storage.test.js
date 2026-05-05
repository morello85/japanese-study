import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProgress } from './storage.js';

test('normalizeProgress sorts lessons and fills settings defaults', () => {
  const normalized = normalizeProgress({
    lessons: [{ date: '2026-05-06' }, { date: '2026-05-05' }],
    reviews: [{ date: '2026-05-07' }, { date: '2026-05-01' }],
    settings: { lessonSize: 5 },
  });

  assert.deepEqual(normalized.lessons.map((lesson) => lesson.date), ['2026-05-05', '2026-05-06']);
  assert.deepEqual(normalized.reviews.map((review) => review.date), ['2026-05-01', '2026-05-07']);
  assert.deepEqual(normalized.settings, {
    lessonSize: 5,
    timezone: 'Europe/London',
    notificationTime: '09:00',
  });
});
