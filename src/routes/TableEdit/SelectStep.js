import React, {
  Component,
} from 'react';
import { connect } from 'dva';
import { List, Toast, TextareaItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import moment from 'moment';
import { makeFieldValue, getUrlParams } from '../../utils/util';
import spin from '../../components/General/Loader';

import style from './index.less';
import styles from '../common.less';

@connect(({
  start,
  loading,
}) => ({
  start,
  loading: loading.global,
}))
class SelectStep extends Component {
  state = {
    steps: [],
    preStepData: null,
  }

  componentWillMount() {
    const { start } = this.props;
    const urlParams = getUrlParams();
    const { source } = urlParams;
    const { preStepData, steps } = start;
    let step = null;
    if (steps && !steps.length) { // 当steps还没有被初始化过，里面为[]
      step = (preStepData.available_steps || []).map((item) => {
        const obj = {
          id: item.id,
          name: item.name,
          checked: preStepData.concurrent_type === 2, // 是否被选择
          approvers: {},
        };
        return obj;
      });
    }
    this.setState({
      steps: step || steps,
      preStepData,
      source: source || '',
    });
  }
  componentDidMount() {
    const { start: { preType }, history, dispatch } = this.props;
    if (preType) {
      dispatch({
        type: 'start/updateModal',
      });
    } else {
      history.goBack(-1);
    }
  }

  getSteps = () => { // 生成步骤
    const { steps } = this.state;
    return steps.map((item, i) => {
      const idx = i;
      console.log(item);
      return (
        <div
          className={style.step}
          key={idx}
          onClick={() => this.choseItem(item)}
        >
          <span
            className={[style.step_item, item.checked ? style.step_active : null].join(' ')}
            onClick={() => this.choseItem(item)}
          />
          <div className={style.list_item}>
            <List.Item
              extra={item.approvers.realname ? item.approvers.realname : '请选择'}
              arrow="horizontal"
              onClick={() => this.choseApprover(item)}
            >
              <div
                style={{ padding: '7px 0' }}
                onClick={(e) => {
                  e.stopPropagation();
                  this.choseItem(item);
                }}
              >{item.name}
              </div>
            </List.Item>
          </div>
        </div>
      );
    });
  }

  choseCback = (el, id) => {
    const { dispatch, history } = this.props;
    const { steps } = this.state;
    const newSteps = steps.map((item) => {
      let obj = { ...item };
      if (`${id}` === `${item.id}`) {
        obj = {
          ...item,
          approvers: { ...el },
        };
      }
      return obj;
    });
    dispatch({
      type: 'start/save',
      payload: {
        store: 'steps',
        data: newSteps,
      },
    });
    history.goBack(-1);
  }

  choseApprover = (el) => { // 去选择审批人
    const { history, dispatch, start } = this.props;
    const {
      steps,
    } = this.state;
    dispatch({
      type: 'start/save',
      payload: {
        store: 'steps',
        data: steps,
      },
    });

    const { id } = el;

    const { preStepData } = start;
    const [step] = (preStepData.available_steps || []).filter(item => `${item.id}` === `${id}`);
    const approverType = step.approver_type;
    if (!approverType) {
      const key = `approver${moment.unix()}`;
      const obj = {
        key,
        type: 0, // 单选
      };
      const url = JSON.stringify(obj);
      dispatch({
        type: 'searchStaff/saveCback',
        payload: {
          key,
          cb: (source) => {
            this.choseCback(source, id);
            // const urlParams = JSON.stringify(source);
            // history.push(`/remark?params=${urlParams}`);
            const newData = makeFieldValue(source, { staff_sn: 'value', realname: 'text' }, false);
            dispatch({
              type: 'searchStaff/saveSelectStaff',
              payload: {
                key,
                value: newData,
              },
            });
          },
        },
      });
      history.push(`/sel_person?params=${url}`);
    } else {
      history.push(`/select_approver/${el.id}`);
    }
  }

  choseItem = (el) => { // 选择某项
    const { steps, preStepData } = this.state;
    let newSteps = [...steps];
    if (preStepData.concurrent_type === 0) {
      newSteps = steps.map((item) => {
        const obj = {
          ...item,
          checked: item.id === el.id ? !item.checked : false,
        };
        return obj;
      });
    } else if (preStepData.concurrent_type === 1) {
      newSteps = steps.map((item) => {
        const obj = {
          ...item,
          checked: item.id === el.id ? !item.checked : item.checked,
        };
        return obj;
      });
    }
    this.setState({
      steps: newSteps,
    });
  }

  submitStep = (e) => { // 提交步骤
    e.preventDefault();
    let v = '';
    this.props.form.validateFields((err, values) => {
      if (!err) {
        v = values.remark || '';
      }
    });
    const { dispatch, history, start: { preType },
    } = this.props;
    const { steps, preStepData, source } = this.state;
    const checkedSteps = steps.filter(item => item.checked);
    const errMsg = [];
    const nextSteps = checkedSteps.map((item) => {
      const obj = {};
      if (Object.keys(item.approvers).length) {
        obj.step_id = item.id;
        obj.approver_sn = item.approvers.staff_sn;
        obj.approver_name = item.approvers.realname;
        return obj;
      } else {
        errMsg.push(`请选择${item.name}的审批人`);
      }
      return obj;
    });
    if (errMsg.length) {
      errMsg.map((item, i) => {
        setTimeout(() => {
          Toast.fail(item, 1.5);
        }, (i) * 1000);
        return item;
      });
      return;
    }
    const params = {
      step_run_id: preStepData.step_run_id,
      timestamp: preStepData.timestamp,
      next_step: [...nextSteps],
      flow_id: preStepData.flow_id,
      host: `${window.location.origin}/approve?source=dingtalk`,
    };
    dispatch({
      type: 'start/save',
      payload: {
        store: 'steps',
        data: steps,
      },
    });
    if (preType === 'start') {
      dispatch({
        type: 'start/stepStart',
        payload: {
          data: {
            ...params,
          },
          cb: () => {
            dispatch({
              type: 'start/resetStart',
            });
            history.go(-2);
            setTimeout(() => {
              history.push('/start_list?type=processing&page=1');
            }, 1);
          },
        },
      });
    } else {
      dispatch({
        type: 'approve/getThrough',
        payload: {
          data: {
            ...params,
            remark: v,
          },
          id: preStepData.flow_id,
          cb: (data) => {
            dispatch({
              type: 'start/resetStart',
            });
            dispatch({
              type: 'list/updateLists',
              payload: {
                data,
                start: '/approvelist_processing',
                end: '/approvelist_approved',
              },
            });
            if (source === 'dingtalk') {
              history.go(-1);
              setTimeout(() => {
                history.replace('/approvelist?type=processing&page=1');
              }, 1);
            } else {
              history.go(-2);
            }
          },
        },
      });
    }
  }
  render() {
    const { preStepData } = this.state;
    const { start: { preType }, loading, form: { getFieldProps } } = this.props;
    const info = preStepData ? (preStepData.concurrent_type === 0 ? '（请任选一个步骤）' : preStepData.concurrent_type === 2 ? '（请选择全部步骤）' : '') : '';
    spin(loading);
    return (
      <div className={styles.con}>
        <div className={[styles.con_content, style.con_step].join(' ')} >
          {!((preStepData.step_end === 1 && preStepData.available_steps.length)
            || (preStepData.step_end === 0 && !preStepData.available_steps.length)) && (
              <List renderHeader={() => <span>执行步骤<a style={{ color: 'red' }}>{info}</a></span>}>
                {this.getSteps()}
              </List>
            )}
          <WhiteSpace size="md" />
          {preType === 'approve' && (
            <TextareaItem
              placeholder="请输入备注"
              rows={5}
              count={200}
              {...getFieldProps('remark', { initialValue: '' })}
            />
          )}

        </div>
        <div className={styles.footer}>
          <a onClick={this.submitStep}><span>提交</span></a>
        </div>
      </div>
    );
  }
}
export default createForm()(SelectStep);
