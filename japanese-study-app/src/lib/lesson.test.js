import test from 'node:test';
import assert from 'node:assert/strict';
import { createLesson, chooseLessonWords, hasLessonForDate, getLessonForDate } from './lesson.js';

test('createLesson chooses new words first', () => {
  const lesson = createLesson([
    { id: '1', status: 'hard' },
    { id: '2', status: 'new' },
    { id: '3', status: 'new' },
  ], 2, '2026-05-05');
  assert.deepEqual(lesson.words.map((w) => w.id), ['2', '3']);
  assert.equal(lesson.date, '2026-05-05');
});

test('chooseLessonWords prefers new words then harder review items', () => {
  const lesson = chooseLessonWords([
    { id: '1', status: 'easy' },
    { id: '2', status: 'medium' },
    { id: '3', status: 'hard' },
    { id: '4', status: 'new' },
  ], 3);

  assert.deepEqual(lesson.map((w) => w.id), ['4', '3', '2']);
});

test('hasLessonForDate and getLessonForDate find existing lessons', () => {
  const progress = { lessons: [{ date: '2026-05-05', words: [{ id: '1' }] }] };
  assert.equal(hasLessonForDate(progress, '2026-05-05'), true);
  assert.equal(hasLessonForDate(progress, '2026-05-06'), false);
  assert.deepEqual(getLessonForDate(progress, '2026-05-05'), { date: '2026-05-05', words: [{ id: '1' }] });
  assert.equal(getLessonForDate(progress, '2026-05-06'), null);
});
