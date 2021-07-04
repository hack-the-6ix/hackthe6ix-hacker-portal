import axios from 'axios';
import queryString from 'query-string';
import { getToken, isAuthenticated, logout } from "./SessionController";

const trimmedBaseURL = (process.env.VUE_APP_API_ADDRESS || '').replace(/\/$/,
    '');
const authProvider = process.env.VUE_APP_AUTH_PROVIDER;

const sendRequest = async (endpoint, type, data = {}) => {
  // Inject access token if available
  const config = {headers: {}};
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
      promise = axios.get(trimmedBaseURL + endpoint + (qs ? `?${qs}` : ''),
          config);
      break;
    }
    case 'PUT':
      promise = axios.put(trimmedBaseURL + endpoint, data, config);
      break;
    default:
      throw new Error(`Unknown request type "${type}"`)
  }

  try {
    const result = await promise;

    return {
      success: true,
      status: result.status,
      data: result.data.message
    }
  } catch (e) {
    if (e.response) {
      const responseData = e.response.data;

      // We don't want an infinite recursive loop, so we'll only logout the user if they aren't already trying to do so
      if (e.response.status === 401 && isAuthenticated() && !endpoint.includes('logout')) {
         await logout();
      }

      return {
        success: false,
        status: e.response.status,
        data: `Error ${e.response.status || 500}: ${responseData.message
        || responseData || 'Unknown Error Occurred'}${responseData.error ? ' - '
            + responseData.error : ''}`
      }
    }

    return {
      success: false,
      status: 400,
      data: 'Error 400: A network error occurred'
    }
  }
};

export const getLoginRedirectURL = (nextPage) => `${trimmedBaseURL}/auth/${authProvider}/login?redirectTo=${nextPage}`;
export const getProfile = async () => sendRequest('/api/action/profile', 'GET');
export const getApplicationEnums = async () => sendRequest(
    '/api/action/applicationEnums', 'GET');
export const uploadResume = async () => sendRequest('/api/action/updateResume',
    'PUT'); // TODO: Implement this
export const updateApplication = async (application, submit) => sendRequest(
    '/api/action/updateapp', 'POST', {
      submit: submit,
      application: application
    });
