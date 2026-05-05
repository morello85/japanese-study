export function createAppState() {
  return {
    lessonSizeOptions: [3, 4, 5],
    defaultLessonSize: 3,
    timezone: 'Europe/London',
    notificationTime: '09:00',
    reviewRules: {
      hard: 2,
      medium: 5,
      easy: 12,
    },
  };
}
