import {
  // department,
  getStaff,
  firstDepartment,
  // serachStaff,
} from '../services/formStaff';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util';

export default {
  namespace: 'formSearchStaff',
  state: {
    department: [],
    staff: [],
    finalStaff: [],
    searStaff: {
      page: '',
      totalpage: '',
      data: [],
    },
    breadCrumb: [],
    pageInfo: {
      page: '',
      totalpage: '',
    },
    currentKey: {

    },

  },
  effects: {
    * fetchSearchStaff({ payload }, { put, call }) {
      const { reqData, breadCrumb } = payload;
      const params = makerFilters(reqData);
      const response = yield call(firstDepartment, params);
      const { children, staff } = response;
      yield put({
        type: 'save',
        payload: {
          store: 'staff',
          data: staff,
        },
      });
      yield put({
        type: 'save',
        payload: {
          store: 'breadCrumb',
          data: breadCrumb,
        },
      });
      yield put({
        type: 'save',
        payload: {
          store: 'department',
          data: children,
        },
      });
    },
    * fetchSelfDepStaff({ payload }, { put, call }) { // 自己部门员工列表
      const { departmentId } = payload;
      yield put({
        type: 'save',
        payload: {
          store: 'breadCrumb',
          data: [],
        },
      });
      yield put({
        type: 'save',
        payload: {
          store: 'department',
          data: [],
        },
      });
      const response = yield call(getStaff, departmentId);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'staff',
            data: response || [],
          },
        });
      }
    },
    * fetchFirstDepartment({ payload }, { put, call }) { // 一级部门列表
      const { breadCrumb, reqData } = payload;
      const params = makerFilters(reqData);
      const response = yield call(firstDepartment, params);
      if (response && !response.error) {
        const { data, type } = response;
        let department = [];
        let staffs = [];
        if (type === 'staff') {
          staffs = data;
        } else {
          const { children, staff } = data;
          department = children;
          staffs = staff;
        }
        yield put({
          type: 'save',
          payload: {
            store: 'department',
            data: department,
          },
        });
        yield put({
          type: 'save',
          payload: {
            store: 'staff',
            data: staffs,
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
    * serachStaff({ payload }, { put, call, select }) {
      const { searStaff } = yield select(_ => _.formSearchStaff);
      const params = makerFilters(payload);
      const response = yield call(firstDepartment, params);
      if (response && !response.error) {
        const res = response.data;
        const { page, totalpage, data } = res;
        let newStaff = null;
        if (`${page}` !== '1') {
          const oldData = searStaff.data;
          const newData = oldData.concat(data);
          newStaff = { data: newData, page, totalpage };
        } else {
          newStaff = { ...res };
        }
        console.log('newStaff', newStaff);
        yield put({
          type: 'save',
          payload: {
            store: 'searStaff',
            data: newStaff,
          },
        });
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

    saveSelectStaff(state, action) {
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
