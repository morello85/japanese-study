import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createAppState } from './lib/state.js';
import { createEmptyProgress, loadProgress, saveProgress } from './lib/storage.js';
import { loadCorpus } from './lib/corpus.js';
import { createLesson, getLessonForDate, hasLessonForDate } from './lib/lesson.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);
const dataPath = join(root, 'data', 'jlpt-sample.json');
const progressPath = join(root, 'data', 'progress.json');

const state = createAppState();
const progress = loadProgress(progressPath);
const words = loadCorpus(JSON.parse(readFileSync(dataPath, 'utf8')));
const today = new Date().toISOString().slice(0, 10);
const lessonSize = progress.settings?.lessonSize ?? state.defaultLessonSize;

let lesson = getLessonForDate(progress, today);
const nextProgress = progress.lessons?.length ? progress : createEmptyProgress();

if (!lesson) {
  lesson = createLesson(words, lessonSize, today);
  if (!hasLessonForDate(nextProgress, today)) {
    nextProgress.lessons = [...(nextProgress.lessons ?? []), lesson];
  }
}

nextProgress.settings = {
  ...nextProgress.settings,
  lessonSize,
};

saveProgress(progressPath, nextProgress);

console.log(JSON.stringify({ app: 'Japanese Study App', state, progress: nextProgress, lesson }, null, 2));
