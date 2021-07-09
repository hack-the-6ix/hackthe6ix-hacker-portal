import jwt_decode from 'jwt-decode';
import queryString from 'query-string';
import swal from 'sweetalert';
import { authCallback, getLoginRedirectURL, logout, refreshToken } from './api';

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
  await redirectToLogin(location.origin);
};

/**
 * Fetches the OpenID callback from params and trades it with JWT token from the server
 * @return {Promise<void>}
 */
export const handleCallback = async () => {
  const params = queryString.parse(location.search);

  if (params.state && params.code) {
    const result = await authCallback(params.state, params.code);

    if (result.success && result.data?.token && result.data?.refreshToken) {
      setToken(result.data?.token);
      setRefreshToken(result.data?.refreshToken);

      location.replace(result.data?.redirectTo || '/');
    } else {
      swal(
        'Error',
        `Unable to retrieve token\n\nPlease click "OK" to try again, and contact us if you are still experiencing issues\n\nError: ${JSON.stringify(
          result.data,
        )}`,
        'error',
      ).then(() => {
        location.href = location.origin;
      });
    }
  } else {
    swal(
      'Error',
      'Unable to retrieve state and code from callback\n\nPlease click "OK" to try again, and contact us if you are still experiencing issues',
      'error',
    ).then(() => {
      location.href = location.origin;
    });
  }
};

/**
 * Fetches the login URL from the API and attempts to redirect the user to the SSO page
 *
 * @param redirectTo - path that will be sent to the callback endpoint on this app
 *                     we'll redirect the user there once the token has been retrieved
 * @return {Promise<void>}
 */
export const redirectToLogin = async (redirectTo) => {
  sessionStorage.lastAttemptedRedirect = new Date().getTime();

  const result = await getLoginRedirectURL(redirectTo);

  if (result.success && result.data?.url) {
    window.location.href = result.data?.url;
  } else {
    swal(
      'Error',
      'Unable to fetch login URL 😕\n\nPlease click "OK" to reload the page, and contact us if you are still experiencing issues',
    ).then(() => {
      location.reload();
    });
  }
};

var refreshServiceStarted = false;

export const initRefreshService = async () => {
  // Do not do anything if we've already started the service
  if (!refreshServiceStarted) {
    refreshServiceStarted = true;

    const runRefreshToken = async () => {
      const response = await refreshToken(getRefreshToken());

      // If we last redirected the user less than 5 seconds ago, we will halt and assume that the user is stuck in a refresh loop.
      const lastAttemptedTokenRefresh = parseInt(
        sessionStorage.lastAttemptedTokenRefresh,
      );
      const diff = new Date() - lastAttemptedTokenRefresh;
      const isRefreshLoop = !isNaN(lastAttemptedTokenRefresh) && diff < 5000;

      if (!isRefreshLoop) {
        if (
          response.success &&
          response.data.token &&
          response.data.refreshToken
        ) {
          setToken(response.data.token);
          setRefreshToken(response.data.refreshToken);

          const parsedToken = jwt_decode(response.data.token);
          const parsedRefreshToken = jwt_decode(response.data.refreshToken);

          let timeRemaining =
            Math.min(parsedToken.exp, parsedRefreshToken.exp) * 1000 -
            new Date().getTime();
          timeRemaining = Math.max(timeRemaining - 5 * 60 * 1000, 0);

          console.log(
            `Next token refresh: ${new Date(
              timeRemaining + new Date().getTime(),
            )}`,
          );

          setTimeout(runRefreshToken, timeRemaining);
          return true;
        } else {
          sessionStorage.lastAttemptedTokenRefresh = new Date().getTime();
          await runLogout(true);
          return false;
        }
      } else {
        swal(
          'Something went wrong',
          `It looks like you're stuck in a token refresh loop 😕\n\nPlease click "OK" to reload the page, and contact us if you are still experiencing issues\n\n(We last tried to refresh your token ${
            diff / 1000
          } seconds ago)`,
          'error',
        ).then(() => {
          clearTokens();
          sessionStorage.clear();
          location.reload();
        });
      }
    };

    console.log('Started token refresh service');
    return await runRefreshToken();
  }

  return true;
};

export const isAuthenticated = () => !!getToken();
