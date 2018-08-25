import {
  department,
  getStaff,
  firstDepartment,
  serachStaff,
} from '../services/department';
import defaultReducers from './reducers/default';

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
    selectStaff: {
      first: [],
      final: [],
      participants: [],
      copy: [],
      workingStaff: {
        0: [],
      },
    },

  },
  effects: {
    * fetchSearchStaff({ payload }, { put, call }) {
      const { parentId, breadCrumb } = payload;
      const response = yield call(department, parentId);
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
      const { breadCrumb } = payload;
      const response = yield call(firstDepartment);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'department',
            data: response || [],
          },
        });
        yield put({
          type: 'save',
          payload: {
            store: 'staff',
            data: [],
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
    * serachStaff({ payload }, { put, call, select }) { // 一级部门列表
      const { searStaff } = yield select(_ => _.searchStaff);
      const response = yield call(serachStaff, payload);
      if (response && !response.error) {
        const { data, page, totalpage } = response;
        let newStaff = null;
        if (page !== 1) {
          const oldData = searStaff.data;
          const newData = oldData.concat(data);
          newStaff = { data: newData, page, totalpage };
        } else {
          newStaff = { ...response };
        }
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
      const current = state[key] || {};
      return {
        ...state,
        [key]: { ...current, cb },
      };
    },
    saveFetch(state, action) {
      const { fetch, key } = action.payload;
      const current = state[key] || {};
      return {
        ...state,
        [key]: { ...current, fetch },
      };
    },

    saveSelectStaff(state, action) {
      const { value, key } = action.payload;
      const current = state[key] || {};
      console.log(value);
      return {
        ...state,
        [key]: { ...current, data: value },
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
