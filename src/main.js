import { Vue as VueIntegration } from '@sentry/integrations';
import * as Sentry from '@sentry/vue';
import { createApp } from 'vue';
import 'vue-loading-overlay/dist/vue-loading.css';
import { createStore } from 'vuex';
import App from './App.vue';
import router from './router';

import userStore from './store/userStore';

const app = createApp(App);

app.use(
  createStore({
    ...userStore,
  }),
);

if (process.env.VUE_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [
      new VueIntegration({
        Vue: app,
      }),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

app.use(router).mount('#app');
