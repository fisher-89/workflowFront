import {
  getShopList,
} from '../services/formStaff';
import defaultReducers from './reducers/default';
import { makerFilters } from '../utils/util';

export default {
  namespace: 'formSearchShop',
  state: {
    shop: {
      page: '',
      totalpage: '',
      data: [],
    },
    isConfig: false,
    currentKey: {},

  },
  effects: {
    * getShopList({ payload }, { put, call, select }) {
      const { shop } = yield select(_ => _.formSearchShop);
      const params = makerFilters(payload);
      const response = yield call(getShopList, params);
      if (response && !response.error) {
        const res = response.data;
        const isConfig = response.is_config;
        const { page, totalpage, data } = res;
        let newShop = null;
        if (`${page}` !== '1') {
          const oldData = shop.data;
          const newData = oldData.concat(data);
          newShop = { data: newData, page, totalpage };
        } else {
          newShop = { ...res };
        }
        yield put({
          type: 'save',
          payload: {
            store: 'shop',
            data: newShop,
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
    },

    // * getShopList({ payload }, { put, call }) { // 一级部门列表
    //   const { reqData } = payload;
    //   const params = makerFilters(reqData);
    //   const response = yield call(getShopList, params);
    //   if (response && !response.error) {
    //     const { data } = response;
    //     const isConfig = response.is_config;
    //     yield put({
    //       type: 'save',
    //       payload: {
    //         store: 'shop',
    //         data,
    //       },
    //     });
    //     yield put({
    //       type: 'save',
    //       payload: {
    //         store: 'isConfig',
    //         data: isConfig,
    //       },
    //     });
    //   }
    // },

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

    saveSelectShop(state, action) {
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
