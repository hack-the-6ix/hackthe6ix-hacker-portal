import axios from 'axios';
import queryString from 'query-string';
import { getToken, isAuthenticated, runLogout } from './SessionController';

const trimmedBaseURL = (process.env.VUE_APP_API_ADDRESS || '').replace(
  /\/$/,
  '',
);
const authProvider = process.env.VUE_APP_AUTH_PROVIDER;

const sendRequest = async (endpoint, type, data = {}, headers) => {
  // Inject access token if available
  const config = {
    headers: {
      ...(headers || {}),
    },
  };

  if (isAuthenticated()) {
    config.headers['x-access-token'] = getToken();
  }

  let promise;
  switch (type) {
    case 'POST':
      promise = axios.post(trimmedBaseURL + endpoint, data, config);
      break;
    case 'GET': {
      let qs = queryString.stringify(data);
      promise = axios.get(
        trimmedBaseURL + endpoint + (qs ? `?${qs}` : ''),
        config,
      );
      break;
    }
    case 'PUT':
      promise = axios.put(trimmedBaseURL + endpoint, data, config);
      break;
    default:
      throw new Error(`Unknown request type "${type}"`);
  }

  try {
    const result = await promise;

    return {
      success: true,
      status: result.status,
      data: result.data.message,
    };
  } catch (e) {
    if (e.response) {
      const responseData = e.response.data;

      // We don't want an infinite recursive loop, so we'll only logout the user if they aren't already trying to do so
      if (e.response.status === 401 && !endpoint.includes('logout')) {
        await runLogout(true);
      }

      return {
        success: false,
        status: e.response.status,
        data: `Error ${e.response.status || 500}: ${
          responseData.message || responseData || 'Unknown Error Occurred'
        }${responseData.error ? ' - ' + responseData.error : ''}`,
        error: responseData.error,
        message: responseData.message,
      };
    }

    return {
      success: false,
      status: 400,
      data: 'Error 400: A network error occurred',
    };
  }
};

export const getLoginRedirectURL = async (redirectTo) =>
  sendRequest(`/auth/${authProvider}/login`, 'POST', {
    callbackURL: `${location.origin}/callback`,
    redirectTo: redirectTo,
  });
export const authCallback = async (state, code) =>
  sendRequest(`/auth/${authProvider}/callback`, 'POST', {
    state: state,
    code: code,
  });
export const refreshToken = async (refreshToken) =>
  sendRequest(`/auth/${authProvider}/refresh`, 'POST', {
    refreshToken: refreshToken,
  });
export const logout = async (refreshToken) =>
  sendRequest(`/auth/${authProvider}/logout`, 'POST', {
    refreshToken: refreshToken,
  });

export const getProfile = async () => sendRequest('/api/action/profile', 'GET');
export const getApplicationEnums = async () =>
  sendRequest('/api/action/applicationEnums', 'GET');
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  return sendRequest('/api/action/updateResume', 'PUT', formData, {
    'Content-Type': 'multipart/form-data',
  });
};
export const updateApplication = async (application, submit) =>
  sendRequest('/api/action/updateapp', 'POST', {
    submit: submit,
    application: application,
  });

export const getTeam = async () => sendRequest('/api/action/getTeam', 'GET');
export const joinTeam = async (teamCode) =>
  sendRequest('/api/action/joinTeam', 'POST', { teamCode: teamCode });
export const leaveTeam = async () =>
  sendRequest('/api/action/leaveTeam', 'POST');
export const createTeam = async () =>
  sendRequest('/api/action/createTeam', 'POST');
