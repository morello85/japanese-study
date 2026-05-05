import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createAppState } from './lib/state.js';
import { createEmptyProgress, loadProgress, saveProgress } from './lib/storage.js';
import { loadCorpus } from './lib/corpus.js';
import { createLesson, getLessonForDate, hasLessonForDate } from './lib/lesson.js';
import { previewLesson, formatLessonSummary } from './lib/preview.js';
import { renderLessonPage, renderJsonPage } from './lib/web.js';

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

const lessonSummary = formatLessonSummary(lesson.words);
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/lesson') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ app: 'Japanese Study App', state, progress: nextProgress, lesson, summary: lessonSummary }, null, 2));
    return;
  }

  if (url.pathname === '/api/json') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    res.end(renderJsonPage({ app: 'Japanese Study App', state, progress: nextProgress, lesson, summary: lessonSummary }));
    return;
  }

  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(renderLessonPage({ lesson, summary: lessonSummary, state }));
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => {
  console.log(`Japanese Study App running at http://localhost:${port}`);
});
