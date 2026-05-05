import test from 'node:test';
import assert from 'node:assert/strict';
import { nextReviewDays } from './review.js';

test('nextReviewDays returns configured spacing', () => {
  assert.equal(nextReviewDays('hard'), 2);
  assert.equal(nextReviewDays('medium'), 5);
  assert.equal(nextReviewDays('easy'), 12);
  assert.equal(nextReviewDays('unknown'), 5);
});
