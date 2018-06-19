import * as c from '../services/start';

export default {

  namespace: 'common',

  state: {
    flowList: [], // 可发起的列表
    footStyle: {},
  },

  subscriptions: {

  },

  effects: {

    * getFlowList(payload, {
      call,
      put,
      select,
    }) {
      const {
        flowList,
      } = yield select(_ => _.common);
      if (flowList && flowList.length) {
        return;
      }
      const data = yield call(c.getFlowList);
      if (data && !data.error) {
        const newFlowlist = [...data];
        yield put({
          type: 'save',
          payload: {
            key: 'flowList',
            value: newFlowlist,
          },
        });
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
