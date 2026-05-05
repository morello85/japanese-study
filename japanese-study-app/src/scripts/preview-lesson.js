import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { previewLesson, formatLessonSummary } from '../lib/preview.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(dirname(__dirname));
const words = JSON.parse(readFileSync(join(root, 'data', 'jlpt-sample.json'), 'utf8'));

const lesson = previewLesson(words, 3);
console.log(JSON.stringify(lesson, null, 2));
console.log('\nSummary:');
for (const line of formatLessonSummary(lesson)) {
  console.log(line);
}
