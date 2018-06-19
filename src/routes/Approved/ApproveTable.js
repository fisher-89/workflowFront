
// 审批的表单
import React, { Component } from 'react';
import { List } from 'antd-mobile';
import { connect } from 'dva';
import { CreateForm } from '../../components';
import { analyzePath } from '../../utils/util';
import style from './index.less';
import styles from '../common.less';

class ApproveTable extends Component {
  UNSAFE_componentWillMount() {
    const { dispatch } = this.props;
    const flow_id = analyzePath(this.props.location.pathname, 1);
    const step_id = analyzePath(this.props.location.pathname, 2);
    dispatch({
      type: 'approve/getStartFlow',
      payload: {
        flow_id: 1,
        step_id: 10,
      },
    });
  }
  getGridItem = (key) => {
    const { approve } = this.props;
    const { gridformdata } = approve;
    const gridItem = gridformdata.find(item => item.key === key);
    const dataList = (gridItem ? gridItem.fields : []).map((item) => {
      return item.find(its => its.key == 'description');
    });

    return dataList.map((item, i) => {
      return (
        <List.Item
          key={i}
          arrow="horizontal"
          thumb={item.icon}
          multipleLine
          onClick={() => this.toEditGrid(`/approve_grid/${key}/${i}`)}
        >
          {item.value} <List.Item.Brief key={i}>{item.text}</List.Item.Brief>
        </List.Item>
      );
    });
  }
  toEditGrid = (url) => {
    const { history } = this.props;
    this.childComp.saveData();
    history.push(url);
  }
  getGridList = () => {
    const { approve } = this.props;
    const { startflow } = approve;
    const { fields: { grid } } = startflow;
    return grid.map((item) => {
      return (
        <div>
          <p className={style.title}>
            <span>{item.name}</span>
          </p>
          <List key={item.key}>
            {this.getGridItem(item.key)}
          </List>
        </div>

      );
    });
  }

  addGridList = (key) => {
    const { history, dispatch } = this.props;
    this.childComp.saveData();
    dispatch({
      type: 'approve/refreshModal',
    });
    history.push(`/addgridlist/${key}/-1`);
  }
  // 保存到modal
  saveData = (formdata) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'approve/save',
      payload: {
        key: 'formdata',
        value: formdata,
      },
    });
  }
  // 提交数据
  submitData = (formdata) => {

  }

  csoLog = (i) => {
    console.log(i);
  }

  render() {
    const { approve, dispatch } = this.props;
    const { startflow, formdata, form_data } = approve;
    if (!startflow) return null;
    const { fields: { form } } = startflow;
    // 只需要展示的（不包括可编辑的）
    const show_form = form.filter(item => !startflow.step.hidden_fields.includes(item.key));

    // 可编辑的
    const editable_form = show_form.filter(item => startflow.step.editable_fields.includes(item.key));


    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          <CreateForm
            startflow={startflow}
            formdata={formdata}
            evtClick={this.saveData}
            dispatch={dispatch}
            show_form={show_form}
            editable_form={editable_form}
            form_data={form_data}
            onRef={comp => this.childComp = comp}
          />
          {this.getGridList()}
        </div>
        <div className={styles.footer}>
          {[{ name: '通过', evt: () => this.csoLog(1) }, { name: '转交', evt: () => this.csoLog(2) }, { name: '驳回', evt: () => this.csoLog(3) }].map(item => <a onClick={item.evt}><span>{item.name}</span></a>)}
        </div>
      </div>
    );
  }
}
export default connect(({ approve }) => ({ approve }))(ApproveTable);

