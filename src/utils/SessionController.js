import queryString from 'query-string';
import { getLoginRedirectURL } from "./api";
import jwt_decode from 'jwt-decode';

export const getToken = () => {
  return localStorage.token
      ? jwt_decode(localStorage.token)
      : null;
};

export const getRefreshToken = () => {
  return localStorage.token
      ? jwt_decode(localStorage.token)
      : null;
};

export const setToken = (token) => {
  localStorage.token = JSON.stringify(token);
};

export const setRefreshToken = (refreshToken) => {
  localStorage.refreshToken = JSON.stringify(refreshToken);
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

    console.log(getToken())

    const refreshToken = () => {

    };

    refreshToken();
    setTimeout(refreshToken, 10000);

  }
};

export const isAuthenticated = () => true;// !!getToken();

