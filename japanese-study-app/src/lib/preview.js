import { loadCorpus } from './corpus.js';
import { chooseDailyWords } from './scheduler.js';

export function previewLesson(rawWords, lessonSize = 3) {
  const words = loadCorpus(rawWords);
  return chooseDailyWords(words, lessonSize);
}
