export function createLesson(words, lessonSize = 3) {
  const newWords = words.filter((w) => w.status === 'new').slice(0, lessonSize);
  return {
    date: new Date().toISOString().slice(0, 10),
    words: newWords,
  };
}
