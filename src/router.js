import queryString from 'query-string';
import swal from 'sweetalert';
import { createRouter, createWebHistory } from 'vue-router';
import {
  clearTokens,
  initRefreshService,
  isAuthenticated,
  login,
  redirectToLogin,
} from './utils/SessionController';

const routes = [
  {
    path: '/',
    redirect: '/application',
  },
  {
    path: '/application',
    component: () =>
      import(/* webpackChunkName: "Application" */ './views/Application'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const stripTokenFromAddress = () => {
  // Remove token from URL if it's there
  // Update URL to exclude
  const params = queryString.parse(location.search);

  if (params.token || params.refreshToken) {
    const url = new URL(location.href);
    delete params.token;
    delete params.refreshToken;
    url.search = queryString.stringify(params);

    location.replace(url.href);

    return true;
  }

  return false;
};

router.beforeEach(async (to, from, next) => {
  const toHref = window.location.origin + to.fullPath;

  if (!isAuthenticated() && !(await login())) {
    // oops we need to go to SSO page to get our tokens

    // If we last redirected the user less than 5 seconds ago, we will halt and assume that the user is stuck in a login loop.
    const lastAttemptedRedirect = parseInt(
      sessionStorage.lastAttemptedRedirect,
    );
    const diff = new Date() - lastAttemptedRedirect;
    const isLoginLoop = !isNaN(lastAttemptedRedirect) && diff < 5000;

    if (!isLoginLoop) {
      redirectToLogin(toHref);
    } else {
      swal(
        'Something went wrong',
        `It looks like you're stuck in a login loop 😕\n\nPlease click "OK" to reload the page, and contact us if you are still experiencing issues\n\n(We last redirected you ${
          diff / 1000
        } seconds ago)`,
        'error',
      ).then(() => {
        clearTokens();
        sessionStorage.clear();
        location.reload();
      });
    }

    return next(false);
  }

  if (stripTokenFromAddress()) {
    return next(false);
  }

  if (isAuthenticated()) {
    await initRefreshService();
  }

  next();
});

export default router;
