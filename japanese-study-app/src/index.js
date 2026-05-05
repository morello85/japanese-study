import { createAppState } from './lib/state.js';
import { createEmptyProgress } from './lib/storage.js';

const state = createAppState();
const progress = createEmptyProgress();

console.log(JSON.stringify({ app: 'Japanese Study App', state, progress }, null, 2));
