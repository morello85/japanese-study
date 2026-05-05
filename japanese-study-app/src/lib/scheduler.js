export function chooseDailyWords(words, lessonSize = 3) {
  const sorted = [...words].sort((a, b) => priority(b) - priority(a));
  return sorted.slice(0, lessonSize);
}

function priority(word) {
  if (word.status === 'hard') return 3;
  if (word.status === 'medium') return 2;
  if (word.status === 'easy') return 1;
  return 4;
}
