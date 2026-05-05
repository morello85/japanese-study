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

export function normalizeProgress(progress) {
  return {
    lessons: [...(progress.lessons ?? [])].sort((a, b) => String(a.date).localeCompare(String(b.date))),
    reviews: [...(progress.reviews ?? [])].sort((a, b) => String(a.date ?? '').localeCompare(String(b.date ?? ''))),
    settings: {
      ...createEmptyProgress().settings,
      ...(progress.settings ?? {}),
    },
  };
}

export function loadProgress(filePath) {
  try {
    const text = readFileSync(filePath, 'utf8');
    return normalizeProgress(JSON.parse(text));
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(filePath, progress) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(normalizeProgress(progress), null, 2));
}
