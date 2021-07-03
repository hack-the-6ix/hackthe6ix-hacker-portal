import queryString from 'query-string';

export const getToken = () => {
  return localStorage.token
      ? JSON.parse(localStorage.token)
      : null;
};

export const getRefreshToken = () => {
  return localStorage.token
      ? JSON.parse(localStorage.token)
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

    console.log('Tokens saved');
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

export const initRefreshService = () => {

  //const refresh = () => {
  //};

  // TODO: Set a timer here and refresh every so often

};

export const isAuthenticated = () => !!getToken();
