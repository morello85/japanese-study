import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createAppState } from './lib/state.js';
import { createEmptyProgress, loadProgress, saveProgress, saveReview } from './lib/storage.js';
import { loadCorpus } from './lib/corpus.js';
import { createLesson, getLessonForDate, hasLessonForDate } from './lib/lesson.js';
import { nextReviewDays } from './lib/review.js';
import { formatLessonSummary } from './lib/preview.js';
import { renderLessonPage, renderJsonPage } from './lib/web.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);
const dataPath = join(root, 'data', 'jlpt-sample.json');
const progressPath = join(root, 'data', 'progress.json');

const state = createAppState();
const words = loadCorpus(JSON.parse(readFileSync(dataPath, 'utf8')));
let progress = loadProgress(progressPath);
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

progress = nextProgress;
saveProgress(progressPath, progress);

function currentLesson() {
  return getLessonForDate(progress, today) ?? lesson;
}

function htmlResponse(res, body) {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(body);
}

function jsonResponse(res, body) {
  res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body, null, 2));
}

function redirectResponse(res, location) {
  res.writeHead(303, { location });
  res.end();
}

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const activeLesson = currentLesson();

  if (req.method === 'POST' && url.pathname === '/api/review') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const form = new URLSearchParams(body);
      const wordId = form.get('wordId');
      const rating = form.get('rating');
      const word = activeLesson.words.find((item) => item.id === wordId);

      if (!word || !['hard', 'medium', 'easy'].includes(rating)) {
        res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
        res.end('Invalid review payload');
        return;
      }

      const review = {
        date: today,
        wordId,
        rating,
        nextReviewDays: nextReviewDays(rating),
      };

      progress = saveReview(progress, review);
      saveProgress(progressPath, progress);
      redirectResponse(res, '/');
    });
    return;
  }

  if (url.pathname === '/api/lesson') {
    jsonResponse(res, { app: 'Japanese Study App', state, progress, lesson: activeLesson, summary: formatLessonSummary(activeLesson.words) });
    return;
  }

  if (url.pathname === '/api/json') {
    htmlResponse(res, renderJsonPage({ app: 'Japanese Study App', state, progress, lesson: activeLesson, summary: formatLessonSummary(activeLesson.words) }));
    return;
  }

  htmlResponse(res, renderLessonPage({ lesson: activeLesson, summary: formatLessonSummary(activeLesson.words), state, reviews: progress.reviews ?? [] }));
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => {
  console.log(`Japanese Study App running at http://localhost:${port}`);
});
