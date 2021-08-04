import swal from 'sweetalert';
import { createRouter, createWebHistory } from 'vue-router';
import {
  clearTokens,
  handleCallback,
  initRefreshService,
  isAuthenticated,
  redirectToLogin,
} from './utils/SessionController';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/application',
    component: () =>
      import(/* webpackChunkName: "Application" */ './views/Application'),
  },
  {
    path: '/prompt',
    component: () =>
      import(/* webpackChunkName: "Acceptance" */ './views/Acceptance'),
  },
  {
    path: '/dashboard',
    component: () =>
      import(/* webpackChunkName: "Dashboard" */ './views/Dashboard'),
    meta: {
      noAuth: process.env.NODE_ENV === 'development',
    },
  },
  {
    path: '/callback',
    component: handleCallback,
    meta: {
      noAuth: true,
    },
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

router.beforeEach(async (to, from, next) => {
  // Do not intercept this
  if (to?.meta?.noAuth) {
    return next();
  }

  if (!isAuthenticated()) {
    // oops we need to go to SSO page to get our tokens

    // Ensure that our redirect is never back to the callback again (prevent infinite loops)
    console.log(to.fullPath);
    const redirectTo = to.path === '/callback' ? '/' : to.fullPath;

    // If we last redirected the user less than 5 seconds ago, we will halt and assume that the user is stuck in a login loop.
    const lastAttemptedRedirect = parseInt(
      sessionStorage.lastAttemptedRedirect,
    );
    const diff = new Date() - lastAttemptedRedirect;
    const isLoginLoop = !isNaN(lastAttemptedRedirect) && diff < 5000;

    if (!isLoginLoop) {
      await redirectToLogin(redirectTo);
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
  } else {
    // we are authenticated!
    if (!(await initRefreshService())) {
      // If the token refresh failed, do not proceed
      return next(false);
    }
  }

  next();
});

export default router;
