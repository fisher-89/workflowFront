import {
  getAccessToken,
} from '../services/oauth';

export default {
  namespace: 'oauth',

  state: {
    accessToken: '',
  },

  effects: {
    * getAccessTokenByAuthCode({
      payload,
    }, {
      call,
      put,
    }) {
      const params = {
        grant_type: 'authorization_code',
        client_id: `${OA_CLIENT_ID}`,
        client_secret: `${OA_CLIENT_SECRET}`,
        ...payload,
      };
      const response = yield call(getAccessToken, params);
      if (response && !response.error) {
        yield put({
          type: 'saveAccessToken',
          payload: response,
        });
        // payload.cb ? payload.cb() : ''
      }
    },
    * refreshAccessToken({
      payload,
    }, {
      call,
      put,
    }) {
      const params = {
        grant_type: 'refresh_token',
        refresh_token: localStorage.getItem('OA_refresh_token'),
        client_id: `${OA_CLIENT_ID}`,
        client_secret: `${OA_CLIENT_SECRET}`,
        scope: '',
        ...payload,
      };

      const response = yield call(getAccessToken, params);
      if (response && !response.error) {
        yield put({
          type: 'saveAccessToken',
          payload: response,
        });
      }
    },
  },

  reducers: {
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
    saveAccessToken(state, action) {
      localStorage.setItem('OA_access_token', action.payload.access_token);
      localStorage.setItem('OA_access_token_expires_in', new Date().getTime() + ((action.payload.expires_in - 10) * 1000));
      localStorage.setItem('OA_refresh_token', action.payload.refresh_token);
      return {
        ...state,
        accessToken: action.payload.access_token,
      };
    },
  },
};
