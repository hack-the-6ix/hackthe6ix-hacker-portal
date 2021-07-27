import { Vue as VueIntegration } from '@sentry/integrations';
import * as Sentry from '@sentry/vue';
import { createStore } from 'vuex';
import { createApp } from 'vue';

import userStore from './store/userStore';
import router from './router';
import App from './App.vue';

import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

const app = createApp(App);

app.use(
  createStore({
    ...userStore,
  }),
);

if (process.env.VUE_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    integrations: [new VueIntegration({
      Vue: app
    })],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

app.use(router).use(VueLoading).mount('#app');
