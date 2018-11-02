import * as c from '../services/approve';
import defaultReducers from './reducers/default';
import flowReducers from './reducers/flow';

export default {

  namespace: 'ccperson',

  state: {
    startflow: null, // 发起需要的数据
    formdata: [], // 表单的数据
    gridformdata: [], // 列表控件里表单的数据
    gridfieldDefault: {}, // 列表控件默认值
    form_data: null, // 表单默认值
    startDetail: null,
    gridDefault: [],
    flowChart: [],
  },

  subscriptions: {

  },

  effects: {
    * getCCDetail({ payload }, { call, put }) {
      const { id, cb } = payload;
      yield put({
        type: 'resetStart',
      });
      const data = yield call(c.getCCDetail, id);
      if (data && !data.error) {
        yield put({
          type: 'saveFlow',
          payload: {
            ...data,
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
    ...flowReducers,
    resetStart(state) {
      return {
        ...state,
        startflow: null, // 发起需要的数据
        formdata: [], // 表单的数据
        gridformdata: [], // 列表控件里表单的数据
        form_data: null, // 表单默认值
        steps: [],
        preStepData: {}, // 预提交的数据
        otherInfo: { remark: '', cc_person: [] }, // 抄送人和备注
      };
    },
  },

};
