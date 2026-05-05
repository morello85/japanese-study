import test from 'node:test';
import assert from 'node:assert/strict';
import { createLesson } from './lesson.js';

test('createLesson chooses new words first', () => {
  const lesson = createLesson([
    { id: '1', status: 'hard' },
    { id: '2', status: 'new' },
    { id: '3', status: 'new' },
  ], 2);
  assert.deepEqual(lesson.words.map((w) => w.id), ['2', '3']);
});
