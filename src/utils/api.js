import axios from 'axios';
import queryString from 'query-string';

const trimmedBaseURL = (process.env.VUE_APP_API_ADDRESS || '').replace(/\/$/, '');
const authProvider = process.env.VUE_APP_AUTH_PROVIDER;

const sendRequest = async (endpoint, type, data = {}) => {
  let promise;
  switch (type) {
    case 'POST':
      promise = axios.post(trimmedBaseURL + endpoint, data);
      break;
    case 'GET': {
      let qs = queryString.stringify(data);
      promise = axios.get(trimmedBaseURL + endpoint + (qs ? `?${qs}` : ''));
      break;
    }
    case 'PUT':
      promise = axios.put(trimmedBaseURL + endpoint, data);
      break;
    default:
      throw new Error(`Unknown request type "${type}"`)
  }

  // TODO: Inject x-access-token here

  try {
    const result = await promise;

    return {
      success: true,
      status: result.status,
      data: result.data
    }
  } catch (e) {
    if (e.response) {
      return {
        success: false,
        status: e.response.status,
        data: `Error ${e.response.status || 500}: ${e.response.data
        || 'Unknown Error Occurred'}`
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
export const getApplicationEnums = async () => sendRequest('/api/action/applicationEnums', 'GET');
export const uploadResume = async () => sendRequest('/api/action/updateResume', 'PUT'); // TODO: Implement this
export const updateApplication = async (application, submit) => sendRequest('/api/action/updateapp', 'POST', {
  submit: submit,
  application: application
});
