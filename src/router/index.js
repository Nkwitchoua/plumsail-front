import { createMemoryHistory, createRouter } from 'vue-router';

import routes from './router';

const router = createRouter({
  history: createMemoryHistory(),
  routes: routes
});

export default router;