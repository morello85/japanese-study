import { createAppState } from './lib/state.js';

const state = createAppState();
console.log(JSON.stringify({ app: 'Japanese Study App', state }, null, 2));
