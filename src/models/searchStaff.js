import {
  department,
  getStaff,
  getSomeStaffs,
  getFinalStaff,
} from '../services/department';
import defaultReducers from './reducers/default';

export default {
  namespace: 'searchStaff',
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
    currentKey: {

    },
  },
  effects: {
    * getFinalStaff(payload, { select, put, call }) { // 自己部门员工列表
      const finalStaff = yield select(state => state.searchStaff.finalStaff);
      if (finalStaff.length > 0) {
        return;
      }
      const response = yield call(getFinalStaff);
      if (response && !response.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'staff',
            data: response || [],
          },
        });
        yield put({
          type: 'save',
          payload: {
            store: 'finalStaff',
            data: response || [],
          },
        });
      }
    },
    * fetchSearchStaff({ payload }, { put, call }) {
      const { parentId, breadCrumb } = payload;
      const response = yield call(department, parentId);
      if (response && !response.error) {
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
            store: 'department',
            data: children,
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
      const { breadCrumb, search } = payload;
      const response = yield call(getSomeStaffs, search);
      if (response && !response.error) {
        const { children, staff } = response;
        yield put({
          type: 'save',
          payload: {
            store: 'department',
            data: children || [],
          },
        });
        yield put({
          type: 'save',
          payload: {
            store: 'staff',
            data: staff || [],
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
    * serachStaff({ payload }, { put, call, select }) { // 搜索列表
      const { searStaff } = yield select(_ => _.searchStaff);
      const response = yield call(getSomeStaffs, payload);
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
    // saveSelectStaff(state, action) {
    //   const newState = { ...state };
    //   newState[action.payload.key] = action.payload.value;
    //   return {
    //     ...state, ...newState,
    //   };
    // },

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
