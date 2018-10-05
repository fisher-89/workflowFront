import {
  getApiDataSource,
} from '../services/formStaff';
import defaultReducers from './reducers/default';

export default {
  namespace: 'formSearchApi',
  state: {
    apiSource: [],
    currentKey: {
    },
  },
  effects: {
    * getApiDataSource({ payload }, { put, call }) { // 一级部门列表
      const { cb, id } = payload;
      const response = yield call(getApiDataSource, id);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'apiSource',
            data: response,
          },
        });
        if (cb) {
          cb(response);
        }
      }
    },
  },
  reducers: {
    ...defaultReducers,
    saveCback(state, action) {
      const { cb, key } = action.payload;
      const { currentKey } = state;
      const current = { ...currentKey[key] || {} };
      current.cb = cb;
      return {
        ...state,
        currentKey: { ...currentKey, [key]: current },
      };
    },
    saveFetch(state, action) {
      const { fetch, key } = action.payload;
      const { currentKey } = state;
      const current = { ...currentKey[key] || {} };
      current.fetch = fetch;
      return {
        ...state,
        currentKey: { ...currentKey, [key]: current },
      };
    },

    saveSelectData(state, action) {
      const { value, key } = action.payload;
      const { currentKey } = state;
      const current = { ...currentKey[key] || {} };
      current.data = value;
      return {
        ...state,
        currentKey: { ...currentKey, [key]: current },
      };
    },

  },
};
