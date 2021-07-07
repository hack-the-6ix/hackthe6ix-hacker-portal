import jwt_decode from 'jwt-decode';
import queryString from 'query-string';
import swal from "sweetalert";
import { getLoginRedirectURL, logout, refreshToken } from "./api";

export const getToken = () => localStorage.token;

export const getRefreshToken = () => localStorage.refreshToken;

export const setToken = (token) => {
  localStorage.token = token;
};

export const setRefreshToken = (refreshToken) => {
  localStorage.refreshToken = refreshToken;
};

export const clearTokens = () => {
  localStorage.clear();
};

/**
 * @param noRevokeToken - if true, we won't communicate with the server that the client has signed out
 * @return {Promise<void>}
 */
export const runLogout = async (noRevokeToken) => {
  // We don't really care about the outcome of this, as long as we tried
  if (!noRevokeToken && !!getRefreshToken()) {
    await logout(getRefreshToken());
  }

  clearTokens();
  redirectToLogin(location.origin);
};

export const redirectToLogin = (to) => {
  sessionStorage.lastAttemptedRedirect = new Date().getTime();
  window.location.href = getLoginRedirectURL(to);
};

/**
 * If user is ready to login, save their tokens and return true. Otherwise,
 * return false to indicate the user must be redirected to the sign on page.
 *
 * @return {Promise<boolean>}
 */
export const login = async () => {
  const params = queryString.parse(location.search);

  if (params.token && params.refreshToken) {
    // Save token
    setToken(params.token);
    setRefreshToken(params.refreshToken);

    return true;
  }

  return false;
};

var refreshServiceStarted = false;

export const initRefreshService = async () => {
  if (!refreshServiceStarted) {

    refreshServiceStarted = true;

    const runRefreshToken = async () => {
      const response = await refreshToken(getRefreshToken());

      // If we last redirected the user less than 5 seconds ago, we will halt and assume that the user is stuck in a refresh loop.
      const lastAttemptedTokenRefresh = parseInt(
          sessionStorage.lastAttemptedTokenRefresh);
      const diff = new Date() - lastAttemptedTokenRefresh;
      const isRefreshLoop = !isNaN(lastAttemptedTokenRefresh) && diff < 5000;

      if (!isRefreshLoop) {
        if (response.success && response.data.token
            && response.data.refreshToken) {
          setToken(response.data.token);
          setRefreshToken(response.data.refreshToken);

          const parsedToken = jwt_decode(response.data.token);
          const parsedRefreshToken = jwt_decode(response.data.refreshToken);

          let timeRemaining = Math.min(parsedToken.exp, parsedRefreshToken.exp)
              * 1000 - new Date().getTime();
          timeRemaining = Math.max(timeRemaining - 5 * 60 * 1000, 0);

          console.log(`Next token refresh: ${new Date(
              timeRemaining + new Date().getTime())}`);

          setTimeout(runRefreshToken, timeRemaining);
        } else {
          sessionStorage.lastAttemptedTokenRefresh = new Date().getTime();
          await runLogout(true);
        }
      } else {
        swal('Something went wrong',
            `It looks like you're stuck in a token refresh loop 😕\n\nPlease click "OK" to reload the page, and contact us if you are still experiencing issues\n\n(We last tried to refresh your token ${diff
            / 1000} seconds ago)`, 'error')
        .then(() => {
          clearTokens();
          sessionStorage.clear();
          location.reload();
        });
      }
    };

    await runRefreshToken();
    console.log('Started token refresh service');
  }
};

export const isAuthenticated = () => !!getToken();

