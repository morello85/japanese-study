import { loadCorpus } from './corpus.js';
import { chooseDailyWords } from './scheduler.js';

export function previewLesson(rawWords, lessonSize = 3) {
  const words = loadCorpus(rawWords);
  return chooseDailyWords(words, lessonSize);
}

export function previewDailySession(rawWords, lessonSize = 3) {
  const lesson = previewLesson(rawWords, lessonSize);
  return {
    title: 'Japanese Study Daily Session',
    lessonSize,
    count: lesson.length,
    words: lesson,
  };
}

export function formatLessonSummary(lesson) {
  return lesson.map((word, index) => {
    const head = `${index + 1}. ${word.kanji || word.reading || word.id}`;
    const reading = word.reading ? ` [${word.reading}]` : '';
    const english = word.english ? ` — ${word.english}` : '';
    const level = word.jlptLevel ? ` (${word.jlptLevel})` : '';
    return `${head}${reading}${english}${level}`;
  });
}
