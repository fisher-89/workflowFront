
// 预提交之后的页面，选步骤
import React, {
  Component,
} from 'react';
import { connect } from 'dva';
import { List, Toast, TextareaItem, WhiteSpace, Button } from 'antd-mobile';
import { createForm } from 'rc-form';
import { makeFieldValue, getUrlParams, setNavTitle } from '../../utils/util';
import spin from '../../components/General/Loader';
import { PersonAdd, PersonIcon } from '../../components';

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
    otherInfo: {
      remark: '',
      cc_person: [],
    },
  }

  componentWillMount() {
    const { start, start: { preType } } = this.props;
    const urlParams = getUrlParams();
    setNavTitle(preType === 'start' ? '执行步骤' : '审批');
    const { source } = urlParams;
    const { preStepData, steps, otherInfo } = start;
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
      // preStepData,
      source: source || '',
      otherInfo,
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

  componentWillReceiveProps(props) {
    const { start: { steps, otherInfo } } = props;
    if (JSON.stringify(steps) !== JSON.stringify(this.props.start.steps)) {
      this.setState({
        steps,
      });
    }
    if (JSON.stringify(otherInfo) !== JSON.stringify(this.props.start.otherInfo)) {
      this.setState({
        otherInfo,
      });
    }
  }

  handleDelClick = (id) => {
    const { start: { preStepData: { timestamp } } } = this.props;
    const key = `approver_${id}${timestamp}`;
    this.saveSelectStaff(key, {});
    this.saveStepApprover({}, id);
  }

  choseCback = (el, id) => {
    this.saveStepApprover(el, id);
    history.go(-1);
  }

  saveStepApprover = (el, id) => {
    const { steps } = this.state;
    const newSteps = steps.map((item) => {
      let obj = { ...item };
      if (`${id}` === `${item.id}`) {
        obj = {
          ...item,
          approvers: el,
        };
      }
      return obj;
    });
    this.modalSave('steps', newSteps);
  }

  modalSave = (store, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'start/save',
      payload: {
        store,
        data,
      },
    });
  }

  saveFormData = () => {
    let remark = '';
    const { otherInfo } = this.state;
    this.props.form.validateFields((err, values) => {
      remark = values.remark || '';
      this.modalSave('otherInfo', { remark, cc_person: otherInfo.cc_person });
    });
  }

  saveSelectStaff = (key, data) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'searchStaff/saveSelectStaff',
      payload: {
        key,
        value: data,
      },
    });
  }

  choseApprover = (el) => { // 去选择审批人
    const { history, dispatch, start } = this.props;
    const {
      steps,
    } = this.state;
    this.modalSave('steps', steps);
    this.saveFormData();
    const { id } = el;
    const { preStepData } = start;
    const { timestamp } = preStepData;
    const [step] = (preStepData.available_steps || []).filter(item => `${item.id}` === `${id}`);
    const approverType = step.approver_type;
    const key = `approver_${id}${timestamp}`;
    const obj = {
      key,
      type: 0, // 单选
    };
    dispatch({
      type: 'searchStaff/saveCback',
      payload: {
        key,
        cb: (source) => {
          this.choseCback(source, id);
          const newData = makeFieldValue(source, { staff_sn: 'value', realname: 'text' }, false);
          this.saveSelectStaff(key, newData);
        },
      },
    });
    if (!approverType) {
      const url = JSON.stringify(obj);
      history.push(`/sel_person?params=${url}`);
    } else {
      const dataSource = step ? step.approvers : [];
      obj.dataSource = dataSource;
      const url = JSON.stringify(obj);
      history.push(`/sel_local_person?params=${url}`);
      // history.push(`/select_approver/${el.id}`);
    }
  }

  choseItem = (el) => { // 选择某项
    const { steps } = this.state;
    const { start: { preStepData } } = this.props;
    let newSteps = [...steps];
    if (preStepData.concurrent_type === 0) { // 单选
      newSteps = steps.map((item) => {
        const obj = {
          ...item,
          checked: `${item.id}` === `${el.id}`,
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
    const { dispatch, history, start: { preType, preStepData },
    } = this.props;
    const stepEnd = preStepData.step_end;
    const availableSteps = preStepData.available_steps || [];
    const hasStep = !!(availableSteps.length && stepEnd === 0);
    const { steps, source, otherInfo } = this.state;
    const ccPerson = otherInfo.cc_person;
    const checkedSteps = steps.filter(item => item.checked);
    const errMsg = [];
    if (hasStep && !checkedSteps.length) {
      errMsg.push('请选择步骤');
    }
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
    const cchost = `${window.location.origin}/cc_detail?source=dingtalk`;
    const params = {
      step_run_id: preStepData.step_run_id,
      timestamp: preStepData.timestamp,
      next_step: [...nextSteps],
      flow_id: preStepData.flow_id,
      host: `${window.location.origin}/approve?source=dingtalk`,
    };
    const cc = preStepData.cc_person.concat(makeFieldValue(ccPerson, { realname: 'staff_name', staff_sn: 'staff_sn' }, true));
    // this.modalSave('steps', steps);
    if (preType === 'start') {
      dispatch({
        type: 'start/stepStart',
        payload: {
          data: {
            ...params,
            cc_person: cc || [],
            cc_host: cchost,
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
            cc_person: cc || [],
            cc_host: cchost,
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

  handleDelCC = (i) => {
    const { otherInfo } = this.state;
    const cc = otherInfo.cc_person;
    let remark = '';
    this.props.form.validateFields((err, values) => {
      if (!err) {
        remark = values.remark || '';
      }
    });
    cc.splice(i, 1);
    this.modalSave('otherInfo', { cc_person: cc, remark });
    this.saveSelectStaff('cc_person', cc);
  }

  selectCCback = (source) => {
    const { history, start: { otherInfo: { remark } } } = this.props;
    this.modalSave('otherInfo', { cc_person: source, remark });
    history.go(-1);
  }

  addCC = () => {
    const { dispatch, history, start: { preStepData: { timestamp } } } = this.props;
    const { steps } = this.state;
    this.modalSave('steps', steps);
    this.saveFormData();
    const key = `cc_person${timestamp}`;
    dispatch({
      type: 'searchStaff/saveCback',
      payload: {
        key,
        cb: (source) => {
          this.selectCCback(source);
          const newData = makeFieldValue(source, { staff_sn: 'value', realname: 'text' }, true);
          this.saveSelectStaff(key, newData);
        },
      },
    });
    const obj = {
      key,
      type: 1, // 单选
    };
    const url = JSON.stringify(obj);
    setTimeout(() => {
      history.push(`/sel_person?params=${url}`);
    }, 50);
  }

  renderSteps = () => { // 生成步骤
    const { steps } = this.state;
    const { start: { preStepData } } = this.props;
    const concurrentType = preStepData.concurrent_type;
    return steps.map((item, i) => {
      const idx = i;
      const stepClassName = [style.step,
        item.checked ?
          (concurrentType === 0 ?
            style.step_singelchecked : (concurrentType === 1 ?
              style.step_checked : style.step_disabed_checked)) : null,
      ].join(' ');
      return (
        <React.Fragment key={idx}>
          <div className={style.step_item} key={idx}>
            <div
              className={stepClassName}
              onClick={() => this.choseItem(item)}
            >{item.name}
            </div>
            {item.checked && (
              <div className={style.approver} style={{ borderTop: '1px solid #d8d8d8 ' }}>
                <div className={style.aside_approver}>审批人：</div>
                <div>
                  {item.approvers && Object.keys(item.approvers).length ? (
                    <PersonIcon
                      nameKey="realname"
                      value={item.approvers}
                      handleDelClick={() => this.handleDelClick(item.id)}
                    />
                  ) :
                    <PersonAdd handleClick={() => this.choseApprover(item)} />}
                </div>
              </div>
            )}
          </div>
          {i !== steps.length - 1 && <WhiteSpace size="md" />}
        </React.Fragment>
      );
    });
  }

  render() {
    const { loading, form: { getFieldProps },
      start: { otherInfo, preStepData, preType } } = this.props;
    const stepEnd = preStepData.step_end;
    const isCC = preStepData.is_cc;
    const availableSteps = preStepData.available_steps || [];
    const cc = otherInfo.cc_person;
    const defaultCC = preStepData.cc_person;
    const { remark } = otherInfo;
    spin(loading);
    return (
      <div className={styles.con}>
        <div className={[styles.con_content, style.con_step].join(' ')} >
          {!!(availableSteps.length && stepEnd === 0) && (
            <List renderHeader={() => <span>执行步骤</span>}>
              {this.renderSteps()}
            </List>
          )}
          {isCC === '1' && (
            <List renderHeader={() => <span>抄送人</span>}>
              <div className={style.step_item}>
                <div className={style.approver}>
                  {(defaultCC || []).map((c, i) => {
                    const idx = i;
                    return (
                      <PersonIcon
                        key={idx}
                        nameKey="staff_name"
                        value={c}
                      />
                    );
                  })}
                  {(cc || []).map((c, i) => {
                    const idx = i;
                    return (
                      <PersonIcon
                        key={idx}
                        nameKey="realname"
                        value={c}
                        handleDelClick={() => this.handleDelCC(idx)}
                      />
                    );
                  })}
                  <PersonAdd handleClick={this.addCC} />
                </div>
              </div>
            </List>
          )}

          <WhiteSpace size="md" />
          {preType !== 'start' && (
            <TextareaItem
              placeholder="请输入备注"
              rows={5}
              count={200}
              {...getFieldProps('remark', { initialValue: remark })}
            />
          )}

        </div>
        <div style={{ padding: '10px' }}>
          <Button
            type="primary"
            onClick={this.submitStep}
          >{preType !== 'start' ? '通过' : '确定'}
          </Button>
        </div>
      </div>

    );
  }
}
export default createForm()(SelectStep);
