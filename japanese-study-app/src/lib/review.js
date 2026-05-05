export function nextReviewDays(rating) {
  const rules = { hard: 2, medium: 5, easy: 12 };
  return rules[rating] ?? rules.medium;
}
