import {
  // department,
  getStaff,
  firstDepartment,
  // serachStaff,
} from '../services/formStaff';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util';

const departments = [
  {
    id: 1,
    name: '工作类事件',
    parent_id: null,
    sort: 1,
    created_at: null,
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 15,
    name: '开支',
    parent_id: 8,
    sort: 1,
    created_at: '2018-07-05 11:18:40',
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 4,
    name: '特卖财务',
    parent_id: 1,
    sort: 1,
    created_at: null,
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 14,
    name: '日常行为',
    parent_id: 13,
    sort: 1,
    created_at: '2018-07-02 20:50:17',
    updated_at: '2018-08-14 16:40:19',
    deleted_at: null,
  },
  {
    id: 6,
    name: '杰尼一部',
    parent_id: 5,
    sort: 1,
    created_at: null,
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 11,
    name: '人事专员',
    parent_id: 9,
    sort: 1,
    created_at: '2018-07-02 20:44:49',
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 17,
    name: '收入',
    parent_id: 8,
    sort: 2,
    created_at: '2018-07-05 11:19:05',
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 13,
    name: '行政类事件',
    parent_id: null,
    sort: 2,
    created_at: '2018-07-02 20:47:31',
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 12,
    name: '招聘专员',
    parent_id: 9,
    sort: 2,
    created_at: '2018-07-02 20:45:06',
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 2,
    name: '违纪行为',
    parent_id: 13,
    sort: 2,
    created_at: null,
    updated_at: '2018-08-14 16:52:10',
    deleted_at: null,
  },
  {
    id: 7,
    name: '杰尼二部',
    parent_id: 5,
    sort: 2,
    created_at: null,
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 5,
    name: '专卖财务',
    parent_id: 1,
    sort: 2,
    created_at: null,
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 19,
    name: '创新类事件',
    parent_id: null,
    sort: 3,
    created_at: '2018-07-19 10:24:18',
    updated_at: '2018-07-19 10:24:18',
    deleted_at: null,
  },
  {
    id: 9,
    name: '专卖人事',
    parent_id: 1,
    sort: 3,
    created_at: null,
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 16,
    name: '每日',
    parent_id: 8,
    sort: 3,
    created_at: '2018-07-05 11:18:52',
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 3,
    name: '出勤',
    parent_id: 13,
    sort: 3,
    created_at: null,
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 8,
    name: '杰尼三部',
    parent_id: 5,
    sort: 3,
    created_at: null,
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 18,
    name: '月初',
    parent_id: 8,
    sort: 4,
    created_at: '2018-07-05 11:19:18',
    updated_at: '2018-07-05 11:19:28',
    deleted_at: null,
  },
  {
    id: 20,
    name: '其他类事件',
    parent_id: null,
    sort: 4,
    created_at: '2018-07-19 10:25:23',
    updated_at: '2018-07-19 10:25:23',
    deleted_at: null,
  },
  {
    id: 21,
    name: '卫生',
    parent_id: 13,
    sort: 4,
    created_at: '2018-08-14 16:32:13',
    updated_at: '2018-08-14 16:32:13',
    deleted_at: null,
  },
  {
    id: 22,
    name: '会议',
    parent_id: 13,
    sort: 5,
    created_at: '2018-08-14 16:41:59',
    updated_at: '2018-08-14 16:41:59',
    deleted_at: null,
  },
];


export default {
  namespace: 'formSearchDep',
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
    * fetchFirstDepartment({ payload }, { put }) { // 一级部门列表
      const { breadCrumb, reqData } = payload;
      const params = makerFilters(reqData);
      console.log(params);
      // const response = yield call(firstDepartment, params);
      // if (response && !response.error) {
      // const { data, type } = response;
      // let department = [];
      // let staffs = [];
      // if (type === 'staff') {
      //   staffs = data;
      // } else {
      //   const { children, staff } = data;
      //   department = children;
      //   staffs = staff;
      // }
      yield put({
        type: 'save',
        payload: {
          store: 'department',
          data: departments,
        },
      });
      // }
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
