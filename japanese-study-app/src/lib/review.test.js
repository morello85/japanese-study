import test from 'node:test';
import assert from 'node:assert/strict';
import { nextReviewDays, applyReview } from './review.js';

test('nextReviewDays returns configured spacing', () => {
  assert.equal(nextReviewDays('hard'), 2);
  assert.equal(nextReviewDays('medium'), 5);
  assert.equal(nextReviewDays('easy'), 12);
  assert.equal(nextReviewDays('unknown'), 5);
});

test('applyReview updates the word status and next review spacing', () => {
  const updated = applyReview({ id: '1', status: 'new' }, 'hard');
  assert.equal(updated.status, 'hard');
  assert.equal(updated.nextReviewInDays, 2);
});
