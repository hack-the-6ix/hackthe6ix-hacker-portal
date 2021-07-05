import queryString from 'query-string';
import { getLoginRedirectURL, refreshToken } from "./api";
import jwt_decode from 'jwt-decode';

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

export const logout = async () => {
  // TODO: Implement this
  clearTokens();
  window.location.href = getLoginRedirectURL(location.origin);
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

/**
 * 1. User goes to dash
 * 2. If user has a valid session, continue to 5
 *      else: redirect to login endpoint
 * 3. If the user is not logged in already, redirect to login endpoint
 * 4. After authentication, the server will inject the token
 *      If the user has a token + refreshToken, save it to localStorage
 *      and clear the query string.
 *        continue to 5
 * 5. Start token refresh service in the background w/ a timer
 * 6. When the user signs out, destroy localStorage
 */

var refreshServiceStarted = false;

export const initRefreshService = () => {
  if (!refreshServiceStarted) {

    refreshServiceStarted = true;

    const runRefreshToken = async () => {
      const response = await refreshToken(getRefreshToken());

      if (response.success && response.data.token && response.data.refreshToken) {
        setToken(response.data.token);
        setRefreshToken(response.data.refreshToken);

        const parsedToken = jwt_decode(response.data.token);
        let timeRemaining = parsedToken.exp * 1000 - new Date().getTime();
        timeRemaining = Math.max(timeRemaining - 5 * 60 * 1000, 0);

        console.log(`Next token refresh: ${ new Date(timeRemaining + new Date().getTime()) }`);

        setTimeout(runRefreshToken, timeRemaining);
      } else {
        // TODO: Display a proper message
        alert('Unable to refresh token automatically. Please save your work and reload the page, or try to log out and back in again.');
      }
    };

    runRefreshToken().then(() => {
      console.log('Started token refresh service');
    });
  }
};

export const isAuthenticated = () => !!getToken();

