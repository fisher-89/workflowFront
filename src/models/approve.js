import { Toast } from 'antd-mobile';
import {
  routerRedux,
} from 'dva/router';
import * as s from '../services/start';
import * as a from '../services/approve';

export default {

  namespace: 'approve',

  state: {
    flowList: [],
    startflow: null,
    formdata: [],
    gridformdata: [],
    form_data: null, // 要提交的数据,
    statusData: { // 审批各状态下数据
      all: {
        data: [],
        current_page: 1,
      },
      processing: {
        data: [],
        current_page: 1,
      },
      approved: {
        data: [],
        current_page: 1,
      },
      deliver: {
        data: [],
        current_page: 1,
      },
      rejected: {
        data: [],
        current_page: 1,
      },
    },
    form: {
      1: {},
    },
    delever: [],
  },

  subscriptions: {
  },

  effects: {
    * doDeliver({ payload }, {
      call,
      put,
    }) {
      const data = yield call(a.doDeliver, payload);
      if (data && !data.error) {
        yield put(routerRedux.goBack(-2));
        // Toast.success('转交成功');
      }
    },
    * doReject({ payload }, {
      call,
      put,
    }) {
      const data = yield call(a.doReject, payload);
      if (data && !data.error) {
        yield put(routerRedux.goBack(-1));
        Toast.success('操作成功');
      }
    },
    * getFlowList(payload, {
      call,
      put,
    }) {
      const data = yield call(s.getFlowList);
      if (data && !data.error) {
        yield put({
          type: 'save',
          payload: {
            key: 'flowList',
            value: data,
          },
        });
      }
    },
    * getApproList({
      payload,
    }, {
      call,
      put,
    }) {
      const data = yield call(a.getApproList, payload.parms);
      if (data && !data.error) {
        yield put({
          type: 'saveApproList',
          payload: {
            data,
            type: payload.parms.type,
            refresh: payload.refresh,
          },
        });
      }
    },
    * getStartFlow({
      payload,
    }, {
      call,
      put,
      select,
    }) {
      const data = yield call(a.getStartFlow, payload);
      const {
        startflow,
      } = yield select(_ => _.approve);
      // if (gridformdata && gridformdata.length)//填写了列表控件信息而返回的
      //   return;
      // }
      if (JSON.stringify(startflow) === JSON.stringify(data)) {
        return;
      }
      if (data && !data.error) {
        yield put({
          type: 'saveFlow',
          payload: {
            ...data,
          },
        });
      }
    },
    * fileUpload({
      payload,
    }, {
      call,
    }) {
      const data = yield call(s.fileUpload, payload.data);
      if (data && !data.error) {
        payload.cb(data);
      }
    },
    * getThrough({
      payload,
    }, {
      call,
      put,
    }) {
      const data = yield call(a.getThrough, payload);
      if (data && !data.error) {
        // yield put(routerRedux.push('/approvelist'));
        yield put({
          type: 'resetStart',
        });
        Toast.success('操作成功');
        payload.cb();
      }
    },
    // 预提交
    * preSet({
      payload,
    }, {
      call,
      put,
    }) {
      const data = yield call(s.preSet, payload);
      if (data && !data.error) {
        yield put({
          type: 'save',
          payload: {
            key: 'preStepData',
            value: data,
          },
        });
        // yield put({
        //   type: 'resetStart', //重置发起表单
        // })
        // if (payload.cb) {
        //   payload.cb()
        // }
      }
    },

    *saveStaff({ payload }, { put }) {
      const { value } = payload;
      const { flowId } = localStorage;
      const newStaff = value.map((item) => {
        const obj = {};
        obj.approver_sn = item.staff_sn;
        obj.approver_name = item.realname || item.staff_name;
        return obj;
      });
      yield put({
        type: 'doDeliver',
        payload: {
          step_run_id: flowId,
          deliver: newStaff,
        },
      });
    },
  },

  reducers: {
    resetStart(state) {
      return {
        ...state,
        startflow: null, // 发起需要的数据
        formdata: [], // 表单的数据
        gridformdata: [], // 列表控件里表单的数据
        form_data: null, // 表单默认值
      };
    },
    saveApproList(state, action) {
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
          approved: {
            data: [],
            current_page: 1,
          },
          deliver: {
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
    save(state, action) {
      const newState = { ...state };
      newState[action.payload.key] = action.payload.value;
      return {
        ...state, ...newState,

      };
    },
    saveFlow(state, action) {
      const formData = {
        ...action.payload.form_data,
      };
      const grid = [...action.payload.fields.grid];
      const gridformdata = grid.map((item) => { // 最外层key
        const gridItem = formData[item.key];
        const obj = {
          key: item.key,
        };
        // let fields = []
        const fields = gridItem.map((its) => { // 最外层key所对应的数组值，值是一个数组
          const keyArr = Object.keys(its); // 数组由对象构成
          const newArr = keyArr.map((it) => {
            const newObj = {};
            newObj.key = it;
            newObj.value = its[it];
            newObj.msg = '';
            return newObj;
          });
          return newArr;
        });
        obj.fields = [...fields];
        return obj;
      });
      return {
        ...state,
        startflow: {
          ...action.payload,
        },
        form_data: action.payload.form_data,
        gridformdata: [...gridformdata],
      };
    },
    refreshModal(state) {
      return {
        ...state,
      };
    },
  },

};
