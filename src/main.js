import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import * as Sentry from "@sentry/vue";
import { Vue as VueIntegration } from "@sentry/integrations";
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

const app = createApp(App);

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
