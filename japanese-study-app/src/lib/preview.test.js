import test from 'node:test';
import assert from 'node:assert/strict';
import { formatLessonSummary } from './preview.js';

test('formatLessonSummary returns readable lesson lines', () => {
  const summary = formatLessonSummary([
    { id: '1', kanji: '今日', reading: 'きょう', english: 'today', jlptLevel: 'N5' },
    { id: '2', reading: 'あした', english: 'tomorrow', jlptLevel: 'N5' },
  ]);

  assert.deepEqual(summary, [
    '1. 今日 [きょう] — today (N5)',
    '2. あした [あした] — tomorrow (N5)',
  ]);
});
