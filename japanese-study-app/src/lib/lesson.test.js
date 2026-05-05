import test from 'node:test';
import assert from 'node:assert/strict';
import { createLesson, chooseLessonWords } from './lesson.js';

test('createLesson chooses new words first', () => {
  const lesson = createLesson([
    { id: '1', status: 'hard' },
    { id: '2', status: 'new' },
    { id: '3', status: 'new' },
  ], 2);
  assert.deepEqual(lesson.words.map((w) => w.id), ['2', '3']);
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
