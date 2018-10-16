import { getApiDataSource } from '../services/formStaff';
import defaultReducers from './reducers/default';

export default {
  namespace: 'api',
  state: {
    sourceDetails: {

    },
  },

  subscriptions: {

  },

  effects: {
    * fetchApi({ payload }, {
      call,
      put, select,
    }) {
      const { id, cb } = payload;
      const { sourceDetails } = yield select(_ => _.api);
      if (sourceDetails[id] && sourceDetails[id].length) {
        return;
      }
      const data = yield call(getApiDataSource, id);
      if (data && !data.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'source',
            id,
            data,
          },
        });
        if (cb) {
          cb(data);
        }
      }
    },

  },

  reducers: {
    ...defaultReducers,
  },

};
