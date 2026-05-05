import test from 'node:test';
import assert from 'node:assert/strict';
import { renderLessonPage } from './web.js';

test('renderLessonPage includes the lesson title and Japanese text', () => {
  const html = renderLessonPage({
    lesson: { words: [{ id: '1', kanji: '今日', reading: 'きょう', english: 'today', jlptLevel: 'N5', examples: ['今日は忙しいです。'] }] },
    summary: ['1. 今日 [きょう] — today (N5)'],
    state: { defaultLessonSize: 3 },
  });

  assert.match(html, /Japanese Study App/);
  assert.match(html, /今日/);
  assert.match(html, /today/);
  assert.match(html, /Summary/);
});
