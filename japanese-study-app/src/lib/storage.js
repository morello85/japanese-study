import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function createEmptyProgress() {
  return {
    lessons: [],
    reviews: [],
    settings: {
      lessonSize: 3,
      timezone: 'Europe/London',
      notificationTime: '09:00',
    },
  };
}

export function loadProgress(filePath) {
  try {
    const text = readFileSync(filePath, 'utf8');
    return JSON.parse(text);
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(filePath, progress) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(progress, null, 2));
}
