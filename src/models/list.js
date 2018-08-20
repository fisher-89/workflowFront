import * as c from '../services/start';
import * as a from '../services/approve';

// import defaultReducers from './reducers/default';
const initDatas = {
  page: 1,
  totalpage: 1,
  data: [],
};
const initLists = {
  '/approvelist_all': {
    type: 'all',
    url: {
      type: 'all',
      page: 1,
      // totalpage: 10,
    },
    datas: { ...initDatas },
  },
  '/approvelist_processing': {
    type: 'processing',
    url: {
      type: 'processing',
      page: 1,
      // totalpage: 10,
    },
    datas: { ...initDatas },
  },
  '/approvelist_approved': {
    type: 'approved',
    url: {
      type: 'approved',
      page: 1,
      // totalpage: 10,
    },
    datas: { ...initDatas },
  },
  '/approvelist_deliver': {
    type: 'deliver',
    url: {
      type: 'deliver',
      page: 1,
      // totalpage: 10,
    },
    datas: { ...initDatas },
  },
  '/approvelist_rejected': {
    type: 'rejected',
    url: {
      type: 'rejected',
      page: 1,
      // totalpage: 10,
    },
    datas: { ...initDatas },
  },
  '/start_list_all': {
    type: 'all',
    url: {
      type: 'all',
      page: 1,
      // totalpage: 10,
    },
    datas: { ...initDatas },
  },
  '/start_list_rejected': {
    type: 'rejected',
    url: {
      type: 'rejected',
      page: 1,
      // totalpage: 10,
    },
    datas: { ...initDatas },
  },
  '/start_list_withdraw': {
    type: 'withdraw',
    url: {
      type: 'withdraw',
      page: 1,
      // totalpage: 10,
    },
    datas: { ...initDatas },
  },

  '/start_list_finished': {
    type: 'finished',
    url: {
      type: 'finished',
      page: 1,
      // totalpage: 10,
    },
    datas: { ...initDatas },
  },
  '/start_list_processing': {
    type: 'processing',
    url: {
      type: 'processing',
      page: 1,
      // totalpage: 10,
    },
    datas: { ...initDatas },
  },
};
export default {
  namespace: 'list',
  state: {
    lists: { ...initLists },
  },

  subscriptions: {

  },

  effects: {
    * getStartList({ payload }, { call, put }) {
      const data = yield call(c.getStartList, payload.parms);
      if (data && !data.error) {
        yield put({
          type: 'saveList',
          payload: {
            data,
            type: payload.parms.type,
            path: payload.path,
          },
        });
      }
    },
    * getApproList({ payload }, { call, put }) {
      const data = yield call(a.getApproList, payload.parms);
      if (data && !data.error) {
        yield put({
          type: 'saveList',
          payload: {
            data,
            type: payload.parms.type,
            path: payload.path,
          },
        });
      }
    },

  },

  reducers: {
    // ...defaultReducers,
    updateLists(state, action) {
      const { data, start, end } = action.payload;
      const { lists } = state;
      const fromA = lists[start];
      const datasA = fromA.datas;
      const dataA = datasA.data;
      const fromB = lists[end];
      const datasB = fromB.datas;
      const dataB = datasB.data;
      const newDataA = dataA.filter(item => `${item.id}` !== `${data.id}`);
      dataB.push(data);
      return {
        ...state,
        lists: {
          ...lists,
          [start]: { ...fromA, datas: { ...datasA, data: newDataA } },
          [end]: { ...fromB, datas: { ...datasB, data: dataB } },
        },

      };
    },
    saveList(state, action) {
      const current = action.payload;
      const { data, type, path } = current;
      const { lists } = state;
      const lastObj = lists[`${path}_${type}`];
      const { datas, url } = lastObj;
      const { page, totalpage } = data;
      const currentList = data.data;
      const lastList = datas.data || [];
      const newDatas = {
        page, totalpage,
      };
      let newList = [];
      if (page !== 1) {
        newList = [...lastList.concat(currentList)];
      } else {
        newList = [...currentList];
      }
      newDatas.data = [...newList];
      const newObj = {
        type,
        url,
        datas: newDatas,
      };
      return {
        ...state,
        lists: {
          ...lists,
          [`${path}_${type}`]: newObj,
        },
      };
    },
    resetModal(state) {
      return {
        ...state,
        lists: { ...initLists },
      };
    },
    saveFilterTerm(state, action) {
      const { payload } = action;
      const { key, value } = payload;
      const { lists } = state;
      const current = { ...lists[key] };
      current.url = value;
      return {
        ...state,
        lists: {
          ...lists,
          [key]: current,
        },
      };
    },
  },

};
