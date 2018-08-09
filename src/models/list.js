import * as c from '../services/start';
// import defaultReducers from './reducers/default';

export default {
  namespace: 'list',
  state: {
    lists: {
      start_list2_all: {
        type: 'all',
        url: 'type=all',
        datas: {

        },
      },
      start_list2_finished: {
        type: 'finished',
        url: 'type=finished',
        datas: {

        },
      },
    },
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
  },

  reducers: {
    // ...defaultReducers,
    saveList(state, action) {
      const current = action.payload;
      const { data, type, path } = current;
      const { lists } = state;
      const lastObj = lists[`${path}_${type}`];
      const { datas } = lastObj;
      const page = data.current_page;
      const totalpage = data.last_page;
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
        path,
        datas: newDatas,
      };
      console.log('newDatas', newDatas, newObj);
      return {
        ...state,
        lists: {
          ...lists,
          [`${path}_${type}`]: newObj,
        },
      };
    },
  },

};
