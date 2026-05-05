import words from '../../data/jlpt-sample.json' assert { type: 'json' };
import { previewLesson } from '../lib/preview.js';

const lesson = previewLesson(words, 3);
console.log(JSON.stringify(lesson, null, 2));
