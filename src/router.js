import { createRouter, createWebHistory } from 'vue-router';
import { getLoginRedirectURL } from "./utils/api";
import { isAuthenticated, login } from "./utils/sessionController";

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "Application" */ './views/Application'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const toHref = window.location.origin + to.fullPath;

  // TODO: Delete token from query string

  if (!isAuthenticated() && !await login()) {
    // oops we need to go to SSO page to get our tokens
    window.location.href = getLoginRedirectURL(toHref);
  }

  next();
});
export default router
