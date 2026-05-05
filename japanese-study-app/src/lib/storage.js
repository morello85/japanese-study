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
