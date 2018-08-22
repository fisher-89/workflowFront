// 编辑或新增列表控件数据页面
import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import { connect } from 'dva';
import { CreateForm } from '../../components';
import { getGridFilter } from '../../utils/convert';
import spin from '../../components/General/Loader';
import styles from '../common.less';

class AddGridList extends Component {
  state = {
    flag: true,
    key: '',
    index: '-1',
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'start/refreshModal',
    });
  }
  componentWillReceiveProps(nextprops) {
    const { match: { params } } = nextprops;
    const { flag, key } = this.state;
    if (!key && flag) {
      const { type, index } = params;
      // const newKey = analyzePath(location.pathname, 1);
      // const index = analyzePath(location.pathname, 2);
      this.setState({
        key: type,
        index,
        flag: false,
      });
    }
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
    const { dispatch, start } = this.props;
    const { gridformdata } = start;
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
      let keyIdx = '';
      const [keyItem] = newGridformdata.filter((item, i) => {
        if (item.key === key) {
          keyIdx = i;
          return item;
        }
        return null;
      });
      if (index === '-1') { // 新增
        if (!keyItem) { // 如果没有对应的key
          newGridformdata.push(obj);
        } else { // 如果有对应的key
          newGridformdata[keyIdx].fields.push(formdata);
        }
      } else { // 修改
        newGridformdata[keyIdx].fields[index] = [...formdata];
      }
    }
    dispatch({
      type: 'start/save',
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
    const { start, dispatch, loading } = this.props;
    const { key, index } = this.state;
    const { startflow, gridformdata } = start;
    spin(loading);
    const newFormData = start.form_data;
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
    if (startflow && key) {
      const { fields: { grid } } = startflow;
      const [showGridObj] = getGridFilter(grid, 'hidden_fields', startflow.step, 1).filter(item => item.key === key);
      showGrid = showGridObj.newFields;
      const [editableFormObj] = getGridFilter(grid, 'editable_fields', startflow.step).filter(item => item.key === key);
      editableForm = editableFormObj.newFields;
    }
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
        <div className={styles.footer}>
          <a
            type="primary"
            onClick={this.submitData}
          >确定
          </a>
        </div>
      </div>
    );
  }
}
export default connect(({
  start,
  loading,
}) => ({
  start,
  loading: loading.global,
}))(AddGridList);
