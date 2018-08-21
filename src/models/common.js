import { Toast } from 'antd-mobile';
import * as c from '../services/start';

export default {
  namespace: 'common',
  state: {
    flowList: [], // 可发起的列表
    footStyle: {},
    userInfo: {},
  },

  subscriptions: {

  },

  effects: {

    * getFlowList(payload, {
      call,
      put, select,
    }) {
      const { flowList } = yield select(_ => _.common);
      if (flowList && flowList.length) {
        return;
      }
      const data = yield call(c.getFlowList);
      if (data && !data.error) {
        const newFlowlist = [...data];
        localStorage.flowList = JSON.stringify(data);
        yield put({
          type: 'save',
          payload: {
            key: 'flowList',
            value: newFlowlist,
          },
        });
      }
    },
    *getUserInfo(_, { call, put }) {
      if (localStorage.userInfo) {
        return;
      }
      const response = yield call(c.getUserInfo);
      if (response && !response.error) {
        localStorage.userInfo = JSON.stringify(response);
        yield put({
          type: 'save',
          payload: {
            store: 'userInfo',
            data: response,
          },
        });
      } else {
        Toast.fail(response.message);
      }
    },
  },

  reducers: {

    save(state, action) {
      const newState = { ...state };
      newState[action.payload.key] = action.payload.value;
      return {
        ...state, ...newState,

      };
    },
    refreshModal(state) {
      return {
        ...state,
      };
    },

  },

};
