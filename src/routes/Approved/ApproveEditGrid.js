
// 编辑或新增列表控件数据页面
import React, { Component } from 'react';
import { Toast, Button, WhiteSpace } from 'antd-mobile';
import { connect } from 'dva';
import { CreateForm } from '../../components';
import { getGridFilter, availableFormFilter } from '../../utils/convert';
import { initFormdata, isableSubmit } from '../../utils/util';

import styles from '../common.less';

class AddGridList extends Component {
  state = {
    flag: true,
    key: '',
    index: '-1',
    formdata: [],

  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'approve/updateModal',
    });
  }

  componentWillReceiveProps(nextprops) {
    const { match: { params }, approve } = nextprops;
    const { startflow, gridformdata, gridDefault } = approve;
    const { flag, key } = this.state;

    if (!key && flag && startflow) {
      const { type, index } = params;
      const { fields: { grid } } = startflow;
      // const [editableFormObj] = getGridFilter(grid, 'editable_fields', startflow.step).
      // filter(item => `${item.key}` === `${type}`);
      // const editableForm = editableFormObj.newFields;
      const [availableForm] = getGridFilter(grid, 'available_fields', startflow.step).filter(item => `${item.key}` === `${type}`);
      const availableFeilds = availableForm.newFields;
      let newFormData = approve.form_data;
      let formdata = [];
      if (`${index}` === '-1') {
        const [gridItemDefault] = gridDefault.filter(item => `${item.key}` === `${type}`);
        newFormData = gridItemDefault.fieldDefault || {};
        // formdata = initFormdata(newFormData, editableForm);
        formdata = initFormdata(newFormData, availableFeilds);
      } else {
        const [current] = gridformdata.filter(item => `${item.key}` === `${type}`);
        formdata = current.fields[Number(index)];
      }
      this.setState({
        key: type,
        index,
        flag: false,
        formdata,
      });
    }
  }

  handleOnchange = (formdata) => {
    this.setState({
      formdata,
    });
  }

  saveFormData = (formdata) => {
    const { index } = this.state;
    const { dispatch, approve: { gridDefault } } = this.props;
    if (`${index}` !== '-1') {
      this.saveData(formdata);
    } else {
      // 保存当前表单的数据
      let newFormData = formdata;
      if (newFormData === undefined) {
        newFormData = this.childComp.state.formdata;
      }
      const data = {};
      newFormData.forEach((item) => {
        const { key, value } = item;
        data[key] = value;
      });

      const newGridDefault = gridDefault.map((item) => {
        const obj = { ...item };
        if (item.key === this.state.key) {
          obj.fieldDefault = { ...data };
        }
        return obj;
      });
      dispatch({
        type: 'approve/save',
        payload: {
          store: 'gridDefault',
          data: newGridDefault,
        },
      });
    }
  }

  // 将数据保存到modal的gridformdata中
  saveData = (formdata) => {
    // const { formdata } = this.childComp.state;
    let newFormData = formdata;
    if (newFormData === undefined) {
      newFormData = this.childComp.state.formdata;
    }
    const [result] = newFormData.filter(item => item.msg);

    if (result) {
      Toast.fail(result.msg);
      return;
    }
    const { key, index } = this.state;
    const { dispatch, approve } = this.props;
    const { gridformdata } = approve;
    const newGridformdata = [...gridformdata];
    const obj = {};
    obj.key = key;
    obj.fields = [
      [...newFormData],
    ];
    // 如果gridformdata为空
    if (gridformdata && !gridformdata.length) {
      newGridformdata.push(obj);
    } else if (gridformdata && gridformdata.length) { // 如果gridformdata不为空
      let keyIdx = -1;
      newGridformdata.forEach((item, i) => {
        if (`${item.key}` === `${key}`) {
          keyIdx = i;
        }
      });
      if (index === '-1') { // 新增
        if (keyIdx === -1) { // 如果没有对应的key
          newGridformdata.push(obj);
        } else { // 如果有对应的key
          newGridformdata[keyIdx].fields.push(newFormData);
        }
      } else { // 修改
        newGridformdata[keyIdx].fields[index] = [...newFormData];
      }
    }
    dispatch({
      type: 'approve/save',
      payload: {
        store: 'gridformdata',
        data: [...newGridformdata],
      },
    });
  }

  // 提交数据
  submitData = (e) => {
    e.preventDefault();
    // this.childComp.saveData(); // 子组件里的方法，为了能够把子组件的数据回传到父组件。该方法里执行了通过父组件传递下去的方法，然后参数为子组件的数据
    this.saveData();
    this.props.history.goBack(-1);
  }

  render() {
    const { approve, dispatch, history } = this.props;
    const { key, index, formdata } = this.state;
    const { startflow, gridDefault } = approve;
    // spin(loading);

    // let formdata = [];
    // const formdata = ((gridformdata && !gridformdata.length) || !key || index === '-1') ?
    //   [] : gridformdata.find(item => item.key === key).fields[Number(index)];

    // if ((gridformdata && !gridformdata.length) || !key || index === '-1') {
    //   formdata = [];
    // } else {
    //   const [current] = gridformdata.filter(item => item.key === key);
    //   formdata = current.fields[Number(index)];
    // }
    if (!startflow) {
      return <p style={{ textAlign: 'center' }}>暂无信息</p>;
    }
    let showGrid = [];
    let editableForm = [];
    let requireForm = [];
    let newFormData = {};
    let availableFeilds = [];

    if (startflow && key) {
      const { fields: { grid } } = startflow;
      // newFormData = startflow.form_data;
      // const [showGridObj] =
      //  getGridFilter(grid, 'hidden_fields', startflow.step, 1).filter(item => item.key === key);
      // const [editableFormObj] =
      //  getGridFilter(grid, 'editable_fields', startflow.step).filter(item => item.key === key);
      // showGrid = showGridObj.newFields;
      // editableForm = editableFormObj.newFields;
      // const [requireFormObj] =
      //  getGridFilter(grid, 'required_fields', startflow.step).filter(item => item.key === key);
      // requireForm = requireFormObj.newFields;

      newFormData = startflow.form_data;
      const [availableForm] = getGridFilter(grid, 'available_fields', startflow.step).filter(item => item.key === key);
      availableFeilds = availableForm.newFields;
      const gridKey = availableForm.key;
      showGrid = availableFormFilter(gridKey, availableFeilds, 'hidden_fields', startflow.step, 1);
      editableForm = availableFormFilter(gridKey, availableFeilds, 'editable_fields', startflow.step);
      requireForm = availableFormFilter(gridKey, availableFeilds, 'required_fields', startflow.step);
      if (`${index}` === '-1') {
        const [gridItemDefault] = gridDefault.filter(item => `${item.key}` === `${key}`);
        newFormData = gridItemDefault.fieldDefault || {};
      }
    }
    let ableSubmit = isableSubmit(requireForm, this.state.formdata);
    ableSubmit = true;
    return (
      <div className={styles.con}>
        <WhiteSpace size="xl" />

        <div className={styles.con_content}>
          <CreateForm
            onRef={(comp) => { this.childComp = comp; }}
            startflow={startflow}
            required_form={requireForm}
            formdata={formdata}
            onChange={this.handleOnchange}
            evtClick={this.saveFormData}
            history={history}
            dispatch={dispatch}
            form_data={newFormData}
            editable_form={editableForm}
            show_form={showGrid}
            availableForm={availableFeilds}
          />
        </div>
        <div style={{ padding: '10px' }}>
          <Button
            type="primary"
            disabled={!ableSubmit}
            onClick={this.submitData}
          >确定
          </Button>
        </div>
      </div>
    );
  }
}
export default connect(({
  approve,
  loading,
}) => ({
  approve,
  loading,
}))(AddGridList);
