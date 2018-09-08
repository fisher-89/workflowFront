
// 编辑或新增列表控件数据页面
import React, { Component } from 'react';
import { Toast, Button } from 'antd-mobile';
import { connect } from 'dva';
import { CreateForm } from '../../components';
import { getGridFilter } from '../../utils/convert';
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
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'approve/refreshModal',
    });
  }

  componentWillReceiveProps(nextprops) {
    const { match: { params }, approve } = nextprops;
    const { startflow } = approve;
    const { flag, key } = this.state;

    if (!key && flag && startflow) {
      const { type, index } = params;
      const { fields: { grid } } = startflow;
      const [editableFormObj] = getGridFilter(grid, 'editable_fields', startflow.step).filter(item => item.key === type);
      const editableForm = editableFormObj.newFields;
      const newFormData = approve.form_data;
      const formdata = initFormdata(newFormData, editableForm);
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

  // 将数据保存到modal的gridformdata中
  saveData = () => {
    const { formdata } = this.childComp.state;
    const [result] = formdata.filter(item => item.msg);
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
      [...formdata],
    ];
    // 如果gridformdata为空
    if (gridformdata && !gridformdata.length) {
      newGridformdata.push(obj);
    } else if (gridformdata && gridformdata.length) { // 如果gridformdata不为空
      let keyIdx = -1;
      // const keyItem = newGridformdata.find((item, i) => {
      //   if (item.key === key) {
      //     keyIdx = i;
      //     return item;
      //   }
      //   return null;
      // });
      // let keyItem = null;
      newGridformdata.forEach((item, i) => {
        if (item.key === key) {
          keyIdx = i;
          // keyItem = item;
        }
      });
      if (index === '-1') { // 新增
        if (keyIdx === -1) { // 如果没有对应的key
          newGridformdata.push(obj);
        } else { // 如果有对应的key
          newGridformdata[keyIdx].fields.push(formdata);
        }
      } else { // 修改
        newGridformdata[keyIdx].fields[index] = [...formdata];
      }
    }
    dispatch({
      type: 'approve/save',
      payload: {
        key: 'gridformdata',
        value: [...newGridformdata],
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
    const { approve, dispatch } = this.props;
    const { key, index } = this.state;
    const { startflow, gridformdata } = approve;
    const newFormData = approve.form_data;
    let formdata = [];
    // const formdata = ((gridformdata && !gridformdata.length) || !key || index === '-1') ?
    //   [] : gridformdata.find(item => item.key === key).fields[Number(index)];

    if ((gridformdata && !gridformdata.length) || !key || index === '-1') {
      formdata = [];
    } else {
      const [current] = gridformdata.filter(item => item.key === key);
      formdata = current.fields[Number(index)];
    }
    if (!startflow) {
      return <p style={{ textAlign: 'center' }}>暂无信息</p>;
    }
    let showGrid = [];
    let editableForm = [];
    let requireForm = [];

    if (startflow && key) {
      const { fields: { grid } } = startflow;
      const [showGridObj] = getGridFilter(grid, 'hidden_fields', startflow.step, 1).filter(item => item.key === key);
      const [editableFormObj] = getGridFilter(grid, 'editable_fields', startflow.step).filter(item => item.key === key);
      showGrid = showGridObj.newFields;
      editableForm = editableFormObj.newFields;
      const [requireFormObj] = getGridFilter(grid, 'required_fields', startflow.step).filter(item => item.key === key);
      requireForm = requireFormObj.newFields;
    }
    const ableSubmit = isableSubmit(requireForm, this.state.formdata);

    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          <CreateForm
            onRef={(comp) => { this.childComp = comp; }}
            startflow={startflow}
            formdata={formdata}
            // evtClick={this.saveData}
            dispatch={dispatch}
            form_data={newFormData}
            editable_form={editableForm}
            show_form={showGrid}
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
