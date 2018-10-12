// 审批的表单
import React, { Component } from 'react';
import { Modal, SwipeAction } from 'antd-mobile';
import { connect } from 'dva';
import { CreateForm, FormDetail } from '../../components';
import { initFormdata, isableSubmit, dealGridData, judgeGridSubmit, makeGridItemData, makeFieldValue } from '../../utils/util';
import spin from '../../components/General/Loader';
import style from '../TableEdit/index.less';
import styles from '../common.less';

const { prompt } = Modal;
class ApproveDetail extends Component {
  state = {
    flowId: '',
    formdata: [],
    griddata: [],
  }
  componentWillMount() {
    const { approve: { gridformdata, startflow, formdata }, dispatch,
      match: { params } } = this.props;
    const { id } = params;
    localStorage.stepRunId = id;
    let griddata = [];
    if (startflow) {
      griddata = dealGridData(gridformdata);
    }
    this.setState({
      griddata,
      formdata,
      flowId: id,
    });
    dispatch({
      type: 'approve/getStartFlow',
      payload: id,
    });
  }

  componentWillReceiveProps(props) {
    const { approve: { startflow, gridformdata } } = props;
    const oldstartflow = this.props.approve.startflow;
    if (startflow && JSON.stringify(startflow) !== JSON.stringify(oldstartflow)) {
      const formData = startflow.form_data;
      const { fields: { form } } = startflow;
      // 可编辑的form
      const editableForm = form.filter(item =>
        startflow.step.editable_fields.indexOf(item.key) !== -1);
      const formdata = initFormdata(formData, editableForm);
      const griddata = dealGridData(gridformdata);
      this.setState({
        formdata,
        griddata,
      });
    }
  }

  getGridItem = (key, ableAdd) => {
    const { approve: { gridformdata, startflow } } = this.props;
    const { fields: { grid } } = startflow;
    const [gridItem] = (grid || []).filter(item => `${item.key}` === `${key}`);
    // const gridFields = gridItem.fields;
    const [currentGridData] = (gridformdata || []).filter(item => `${item.key}` === `${key}`);
    const dataList = makeGridItemData(currentGridData, gridItem);
    const extra = ableAdd ? [
      {
        text: '删除',
        style: { backgroundColor: 'rgb(218,81,85)', minWidth: '1.6rem', color: 'white', fontSize: '12px', borderTopRightRadius: '2px' },
        onPress: 'deleteItem',
      },
    ] : [];
    return dataList.map((item, i) => {
      const idx = i;
      const newExtra = extra.map((_) => {
        const obj = { ..._ };
        obj.onPress = e => this[_.onPress](e, key, i);
        return obj;
      });
      return (
        <SwipeAction
          right={newExtra}
          autoClose={false}
          key={idx}
        >
          <div
            className={style.grid_list_item}
            key={idx}
            onClick={() => this.toEditGrid(key, idx)}
          >
            {item.value_0 && <div className={style.main_info}>{item.value_0}</div>}
            {item.value_1 && <div className={style.desc}>{item.value_1}</div>}
            {item.value_2 && <div className={style.desc}>{item.value_2}</div>}
          </div>
        </SwipeAction>
      );
    });
  }

  getThrough = () => {
    const { dispatch } = this.props;
    const { flowId } = this.state;
    dispatch({
      type: 'approve/getThrough',
      payload: {
        flow_id: flowId,
      },
    });
  }

  getGridList = () => {
    const { approve } = this.props;
    const { startflow } = approve;
    const { fields: { grid } } = startflow;
    const editableGrid = grid.filter(item =>
      startflow.step.editable_fields.indexOf(item.key) !== -1);
    const gridKey = editableGrid.map(item => item.key);
    return grid.map((item, i) => {
      const index = i;
      const { key, name } = item;
      const ableAdd = gridKey.indexOf(item.key) > -1;
      return (
        <div key={index} className={style.grid_item}>
          <p className={style.grid_opt}>
            <span>{name}</span>
            {ableAdd && (
              <a
                onClick={() => this.addGridList(key)}
              >+添加{name}
              </a>
            )}
          </p>
          {this.getGridItem(key, ableAdd)}
        </div>
      );
    });
  }

  handleOnchange = (formdata) => {
    this.setState({
      formdata,
    });
  }

  deleteItem = (e, key, i) => {
    e.stopPropagation();
    const { approve: { gridformdata }, dispatch } = this.props;
    const [currentGridData] = (gridformdata || []).filter(item => `${item.key}` === `${key}`);
    const { fields } = currentGridData;
    fields.splice(i, 1);
    currentGridData.fields = fields;
    const newGridformdata = gridformdata.map((item) => {
      let obj = { ...item };
      if (item.key === key) {
        obj = { ...currentGridData };
      }
      return obj;
    });

    dispatch({
      type: 'approve/save',
      payload: {
        store: 'gridformdata',
        data: newGridformdata,
      },
    });
  }

  // 给列表控件追加item
  addGridList = (key) => {
    const { history, dispatch } = this.props;
    this.saveData();
    dispatch({
      type: 'approve/resetGridDefault',
    });
    history.push(`/approve_grid_edit/${key}/-1`);
  };

  toEditGrid = (key, i) => {
    const { approve, history } = this.props;
    const { startflow } = approve;
    let url = `/approve_grid/${key}/${i}`;
    if (startflow.step_run.action_type === 0) {
      // this.childComp.saveData();
      this.saveData();
      url = `/approve_grid_edit/${key}/${i}`;
    }
    history.push(url);
  }

  // 保存到modal
  saveData = (formdata) => {
    // const { formdata } = this.childComp.state;
    let newFormData = formdata;
    if (newFormData === undefined) {
      newFormData = this.childComp.state.formdata;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'approve/save',
      payload: {
        store: 'formdata',
        data: newFormData,
      },
    });
    return formdata;
  }

  submitStep = (v, data) => {
    const { dispatch, history } = this.props;
    const params = {
      step_run_id: data.step_run_id,
      timestamp: data.timestamp,
      next_step: [],
    };
    dispatch({
      type: 'approve/getThrough',
      payload: {
        data: {
          ...params,
          remark: v,
        },
        id: data.flow_id,
        cb: (datas) => {
          dispatch({
            type: 'list/updateLists',
            payload: {
              data: datas,
              start: '/approvelist_processing',
              end: '/approvelist_approved',
            },
          });
          history.goBack(-1);
        },
      },
    });
  }

  // 提交数据
  submitData = (e) => {
    e.preventDefault();
    const { flowId } = this.state;
    const { dispatch, history } = this.props;
    const { formdata } = this.childComp.state;
    // setTimeout(() => {
    const { approve: { gridformdata, startflow } } = this.props;
    // 整理formdata数据
    const flowRun = startflow.flow_run;
    const formObj = {};
    formdata.map((item) => {
      formObj[item.key] = item.value;
      return item;
    });
    // 整理列表控件数据
    const formgridObj = dealGridData(gridformdata);
    const newformData = {
      ...formObj,
      ...formgridObj,
    };
    dispatch({
      type: 'start/preSet',
      payload: {
        data: {
          form_data: newformData,
          step_run_id: flowId,
          flow_id: flowRun.flow_id,
        },
        // id: flowRun.flow_id,
        preType: 'approve',
        cb: (data) => {
          if (data.step_end === 1) { // 不选步骤
            // prompt('填写备注', '', [{
            //   text: '取消',
            // }, {
            //   text: '确定',
            //   onPress: v => this.submitStep(v, data),
            // }], 'default', null, ['请输入备注']);
            const url = JSON.stringify(data);
            history.push(`/remark?params=${url}&type=2`);
          } else {
            history.replace('/select_step');
          }
        },
      },
    });
    // }, 500);
  }

  fillRemark = () => {
    prompt('填写备注', '', [{
      text: '取消',
      // onPress: this.submitStep
    }, {
      text: '确定',
      onPress: this.doReject,
    }], 'default', null, ['input your name']);
  }

  doReject = () => {
    const {
      flowId,
    } = this.state;
    const { history } = this.props;
    // dispatch({
    //   type: 'approve/doReject',
    //   payload: {
    //     step_run_id: flowId,
    //     remark: v,
    //   },
    // });
    const payload = {
      step_run_id: flowId,
    };
    const url = JSON.stringify(payload);
    history.push(`/remark?params=${url}&type=3`);
  }

  doDeliver = () => { // 转交
    const {
      history, dispatch, approve: { startflow },
    } = this.props;
    const { step_run: { id } } = startflow;
    const obj = {
      key: 'deliver',
      type: 0,
      singleDelete: 0,
      modal: 'approve',
    };
    const url = JSON.stringify(obj);
    dispatch({
      type: 'searchStaff/saveCback',
      payload: {
        key: 'deliver',
        cb: (source) => {
          // dispatch({
          //   type: 'approve/saveStaff',
          //   payload: {
          //     value: source,
          //   },
          // });
          const newStaff =
            makeFieldValue(source, { staff_sn: 'approver_sn', realname: 'approver_name' }, false);
          const params = {
            ...newStaff,
            step_run_id: id,
          };
          const urlParams = JSON.stringify(params);
          history.push(`/remark?params=${urlParams}`);
        },
      },
    });
    history.push(`/sel_person?params=${url}`);
  }

  render() {
    const { approve, dispatch, loading, history } = this.props;
    const { startflow, formdata } = approve;
    const newFormData = approve.form_data;
    spin(loading);
    if (!startflow) return null;
    const { fields: { form, grid } } = startflow;
    // 只需要展示的（不包括可编辑的）
    const showForm = form.filter(item => !(startflow.step.hidden_fields.indexOf(item.key) !== -1));

    // 可编辑的
    const editableForm = form.filter((item) => {
      return startflow.step.editable_fields.indexOf(item.key) !== -1;
    });
    const requiredForm = form.filter(item =>
      startflow.step.required_fields.indexOf(item.key) !== -1);
    const requiredGrid = grid.filter(item =>
      startflow.step.required_fields.indexOf(item.key) !== -1);

    let ableSubmit = isableSubmit(requiredForm, this.state.formdata)
      && judgeGridSubmit(requiredGrid, this.state.griddata);
    ableSubmit = true;
    return (
      <div className={styles.con}>
        <div className={styles.con_content} >
          {startflow.step_run.action_type === 0 ? (
            <CreateForm
              startflow={startflow}
              formdata={formdata}
              evtClick={this.saveData}
              onChange={this.handleOnchange}
              dispatch={dispatch}
              history={history}
              show_form={showForm}
              editable_form={editableForm}
              form_data={newFormData}
              onRef={(comp) => { this.childComp = comp; }}
            />
          ) : (
            <FormDetail
              form_data={newFormData}
              show_form={showForm}
            />
            )}
          <div style={{ marginBottom: '20px' }}>
            {this.getGridList()}
          </div>
        </div>

        <div className={styles.footer}>
          {startflow.step_run.action_type === 0 && (
            <a
              onClick={ableSubmit ? this.submitData : null}
              style={(!ableSubmit ? { color: 'rgb(204,204,204)' } : null)}
            >
              <span>通过</span>
            </a>
          )}
          {startflow.step_run.action_type === 0 && (
            <a
              onClick={this.doDeliver}
            >
              <span>转交</span>
            </a>
          )}
          {startflow.step.reject_type !== 0 && startflow.step_run.action_type === 0 && (
            <a
              onClick={this.doReject}
            >
              <span>驳回</span>
            </a>
          )}
        </div>
      </div>
    );
  }
}
export default connect(({
  approve, start, loading,
}) => ({
  approve, start, loading: loading.global,
}))(ApproveDetail);
