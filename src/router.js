import queryString from "query-string";
import { createRouter, createWebHistory } from 'vue-router';
import { getLoginRedirectURL } from "./utils/api";
import {
  initRefreshService,
  isAuthenticated,
  login
} from "./utils/SessionController";

const routes = [
  {
    path: '/',
    component: () => import(/* webpackChunkName: "Application" */ './views/Application'),
  },
  {
    path: "/:catchAll(.*)",
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
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

    return false;
  }

  return true;
};

router.beforeEach(async (to, from, next) => {
  const toHref = window.location.origin + to.fullPath;

  if (!isAuthenticated() && !await login()) {
    // oops we need to go to SSO page to get our tokens
    window.location.href = getLoginRedirectURL(toHref);
  }

  if (stripTokenFromAddress()) {
    if (isAuthenticated()) {
      await initRefreshService();
    }
  }

  next();
});
export default router
