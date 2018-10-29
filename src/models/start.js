import { routerRedux } from 'dva/router';
import * as c from '../services/start';
import * as a from '../services/approve';
import defaultReducers from './reducers/default';
import flowReducers from './reducers/flow';

export default {

  namespace: 'start',

  state: {
    startflow: null, // 发起需要的数据
    formdata: [], // 表单的数据
    gridformdata: [], // 列表控件里表单的数据
    gridfieldDefault: {}, // 列表控件默认值
    form_data: null, // 表单默认值
    steps: [],
    preType: '', // 预提交的类型，是审批的还是发起的
    statusData: { // 审批各状态下数据
      all: {
        data: [],
        current_page: 1,
      },
      finished: {
        data: [],
        current_page: 1,
      },
      processing: {
        data: [],
        current_page: 1,
      },
      withdraw: {
        data: [],
        current_page: 1,
      },
      rejected: {
        data: [],
        current_page: 1,
      },
    },
    otherInfo: { remark: '', cc_person: [] },
    preStepData: {

    }, // 提交是数据之后的步骤
    startDetail: null,
    gridDefault: [],
    flowChart: [],
  },

  subscriptions: {

  },

  effects: {
    * getFlowChart({ payload }, { call, put }) {
      const { id } = payload;
      const data = yield call(a.getFlowChart, id);
      if (data && !data.error) {
        yield put({
          type: 'save',
          payload: {
            store: 'flowChart',
            data,
          },
        });
      }
    },

    * getStartList({ payload }, { call, put }) {
      const data = yield call(c.getStartList, payload.parms);
      if (data && !data.error) {
        yield put({
          type: 'saveStartList',
          payload: {
            data,
            type: payload.parms.type,
            refresh: payload.refresh,
          },
        });
      }
    },
    /*
     * 请求获取发起数据
     */
    * getStartFlow({ payload }, { call, put, select }) {
      const {
        gridformdata,
        startflow,
      } = yield select(_ => _.start);
      if ((gridformdata && gridformdata.length) || (startflow && `${startflow.step.flow_id}` === `${payload}`)) {
        return;
      }
      yield put({
        type: 'resetStart',
      });
      const data = yield call(c.getStartFlow, payload);

      if (data && !data.error) {
        yield put({
          type: 'saveFlow',
          payload: {
            ...data,
          },
        });
      }
    },

    * fileUpload({ payload }, { call }) {
      const data = yield call(c.fileUpload, payload.data);
      if (data && !data.error) {
        payload.cb(data);
      } else {
        // Toast.info(data.message, 1.5);
      }
    },
    // 预提交
    * preSet({ payload }, { call, put }) {
      const data = yield call(c.preSet, payload.data);
      if (data && !data.error) {
        // if ((data.step_end === 1 && data.available_steps.length)
        //   || (data.step_end === 0 && !data.available_steps.length)) {
        //   Toast.info('后台配置错误');
        //   return;
        // }
        yield put({
          type: 'save',
          payload: {
            store: 'preStepData',
            data,
          },
        });
        yield put({
          type: 'save',
          payload: {
            store: 'preType',
            data: payload.preType,
          },
        });
        // yield put({
        //   type: 'resetStart', // 重置发起表单
        // });
        if (payload.cb) {
          payload.cb(data);
        }
      }
    },
    * stepStart({ payload }, { call }) {
      const data = yield call(c.stepStart, payload.data);
      if (data && !data.error) {
        payload.cb();
      }
    },
    * getStartDetail({ payload }, { call, put }) {
      const { id, cb } = payload;
      yield put({
        type: 'resetStart',
      });
      const data = yield call(c.startDetail, id);
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
    * doWithDraw({ payload }, { call, put }) {
      const data = yield call(c.doWithdraw, payload);
      if (data && !data.error) {
        yield put(routerRedux.replace('/start_list?type=withdraw&page=1'));
      }
    },

  },

  reducers: {
    ...defaultReducers,
    ...flowReducers,
    saveStartList(state, action) {
      // 先判断是否是更新
      const newRefresh = action.payload.refresh;
      let statusData = {
        ...state.statusData,
      };
      if (newRefresh) { // 更新
        statusData = { // 审批各状态下数据
          all: {
            data: [],
            current_page: 1,
          },
          processing: {
            data: [],
            current_page: 1,
          },
          withdraw: {
            data: [],
            current_page: 1,
          },
          finished: {
            data: [],
            current_page: 1,
          },
          rejected: {
            data: [],
            current_page: 1,
          },
        };
        statusData[action.payload.type] = {
          ...action.payload.data,
        };
      } else {
        const list = statusData[action.payload.type].data.concat(action.payload.data.data);
        statusData[action.payload.type] = {
          ...action.payload.data,
          data: list,
        };
      }

      return {
        ...state,
        statusData: {
          ...statusData,
        },
      };
    },

    resetStart(state) {
      return {
        ...state,
        startflow: null, // 发起需要的数据
        formdata: [], // 表单的数据
        gridformdata: [], // 列表控件里表单的数据
        form_data: null, // 表单默认值
        steps: [],
        preStepData: {},
      };
    },
    // save(state, action) {
    //   const newState = { ...state };
    //   newState[action.payload.key] = action.payload.value;
    //   return {
    //     ...state, ...newState,
    //   };
    // },
    /*
    * 保存请求时获取的流程数据
     */
    //   saveFlow(state, action) {
    //     const newFormData = {
    //       ...action.payload.form_data,
    //     };
    //     const gridDefault = [];
    //     const grid = [...action.payload.fields.grid];
    //     const gridformdata = grid.map((item) => { // 最外层key
    //       const gridItem = newFormData[item.key];
    //       const fieldDefault = item.field_default_value;
    //       const obj = {
    //         key: item.key,
    //       };
    //       gridDefault.push({ ...obj, fieldDefault });
    //       // let fields = []
    //       const fields = gridItem.map((its) => { // 最外层key所对应的数组值，值是一个数组
    //         const keyArr = Object.keys(its); // 数组由对象构成
    //         const newArr = keyArr.map((it) => {
    //           const newObj = {};
    //           newObj.key = it;
    //           newObj.value = its[it];
    //           newObj.msg = '';
    //           return newObj;
    //         });
    //         return newArr;
    //       });
    //       obj.fields = [...fields];
    //       return obj;
    //     });
    //     return {
    //       ...state,
    //       startflow: action.payload,
    //       form_data: action.payload.form_data,
    //       gridformdata: [...gridformdata],
    //       gridDefault,
    //     };
    //   },

    //   refreshModal(state) {
    //     return {
    //       ...state,
    //     };
    //   },
  },

};
