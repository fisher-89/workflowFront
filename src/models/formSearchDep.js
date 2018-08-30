import {
  getDepartment,
} from '../services/formStaff';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util';

export default {
  namespace: 'formSearchDep',
  state: {
    department: [],
    isConfig: true,
    breadCrumb: [],
    currentKey: {
    },
  },
  effects: {
    * fetchFirstDepartment({ payload }, { put, call }) { // 一级部门列表
      const { breadCrumb, reqData } = payload;
      const params = makerFilters(reqData);
      const response = yield call(getDepartment, params);
      if (response && !response.error) {
        const { data } = response;
        const isConfig = response.is_config;
        yield put({
          type: 'save',
          payload: {
            store: 'department',
            data,
          },
        });
        yield put({
          type: 'save',
          payload: {
            store: 'isConfig',
            data: isConfig,
          },
        });
      }
      yield put({
        type: 'save',
        payload: {
          store: 'breadCrumb',
          data: breadCrumb,
        },
      });
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

    saveSelectDepartment(state, action) {
      const { value, key } = action.payload;
      const { currentKey } = state;
      const current = { ...currentKey[key] || {} };
      current.data = value;
      return {
        ...state,
        currentKey: { ...currentKey, [key]: current },
      };
    },
    clearSelectStaff(state) {
      const newState = {
        selectStaff: {
          first: [],
          final: [],
          participants: [],
          copy: [],
        },
      };
      return {
        ...state,
        ...newState,
      };
    },
  },
};
