export function createLesson(words, lessonSize = 3) {
  const selected = chooseLessonWords(words, lessonSize);
  return {
    date: new Date().toISOString().slice(0, 10),
    words: selected,
  };
}

export function chooseLessonWords(words, lessonSize = 3) {
  const priorityOrder = { new: 4, hard: 3, medium: 2, easy: 1 };
  const sorted = [...words].sort((a, b) => {
    const diff = (priorityOrder[b.status] ?? 0) - (priorityOrder[a.status] ?? 0);
    if (diff !== 0) return diff;
    return String(a.id).localeCompare(String(b.id));
  });

  return sorted.slice(0, lessonSize);
}
