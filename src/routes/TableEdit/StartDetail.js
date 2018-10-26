// 审批的表单
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, WhiteSpace } from 'antd-mobile';
import { FormDetail } from '../../components';
import spin from '../../components/General/Loader';
import { makeGridItemData } from '../../utils/util';
import FlowChart from '../../components/FlowChart/chart';

import style from './index.less';
import styles from '../common.less';

class StartDetail extends Component {
  componentWillMount() {
    const { dispatch, match: { params } } = this.props;
    const { id } = params;
    dispatch({
      type: 'start/getStartDetail',
      payload: {
        id,
        cb: (detail) => {
          dispatch({
            type: 'start/getFlowChart',
            payload: { id: detail.step_run.id },
          });
        },
      },
    });
  }

  getGridItem = (key) => {
    const { start: { gridformdata, startflow } } = this.props;
    const { fields: { grid } } = startflow;
    const [gridItem] = (grid || []).filter(item => `${item.key}` === `${key}`);
    // const gridFields = gridItem.fields;
    const [currentGridData] = (gridformdata || []).filter(item => `${item.key}` === `${key}`);
    // const dataList = (currentGridData ? currentGridData.fields : []).map((item, i) => {
    //   const newObj = {
    //     value_0: `${gridItem.name}${i + 1}`,
    //   };
    //   let num = 0;
    //   item.forEach((its) => { // 取前三个字段
    //     const [fieldsItem] = gridFields.filter(_ => `${_.key}` === `${its.key}`);
    //     const { type } = fieldsItem || {};
    //     if (num < 3 && type && type !== 'file' && type !== 'array') {
    //       newObj[`value_${num}`] = its.value;
    //       num += 1;
    //     }
    //   });
    //   return newObj;
    // });
    const dataList = makeGridItemData(currentGridData, gridItem);
    return dataList.map((item, i) => {
      const idx = i;
      return (
        <div
          key={idx}
          className={style.grid_list_item}
          onClick={() => this.toEditGrid(`/start_grid/${key}/${i}`)}
        >
          {item.value_0 && <div className={style.main_info}>{item.value_0}</div>}
          {item.value_1 && <div className={style.desc}>{item.value_1}</div>}
          {item.value_2 && <div className={style.desc}>{item.value_2}</div>}
        </div>
      );
    });
  }

  getGridList = () => {
    const { start } = this.props;
    const { startflow } = start;
    const { fields: { grid } } = startflow;
    const formdata = startflow.form_data;
    const validGrid = [];
    grid.forEach((item) => {
      const { key } = item;
      const value = formdata[key];
      if (!value || (value.length)) {
        validGrid.push(item);
      }
    });
    return validGrid.map((item, i) => {
      const idx = i;
      return (
        <div key={idx} className={style.grid_item}>
          <p className={style.grid_opt}>
            <span>{item.name}</span>
          </p>
          {this.getGridItem(item.key)}
        </div>

      );
    });
  }

  doWithDraw = () => {
    const { dispatch, start: { startflow } } = this.props;
    const flowRun = startflow.flow_run;
    dispatch({
      type: 'start/doWithDraw',
      payload: {
        flow_run_id: flowRun.id,
      },
    });
  }

  toEditGrid = (url) => {
    const { history } = this.props;
    history.push(url);
  }
  render() {
    const { start, loading } = this.props;
    const { startflow, flowChart } = start;
    console.log('flowChart:', flowChart);

    const formData = start.form_data;
    spin(loading);
    if (!startflow) return null;
    const { fields: { form } } = startflow;
    const flowRun = startflow.flow_run;
    // 只需要展示的（不包括可编辑的）
    const showForm = form.filter(item => startflow.step.hidden_fields.indexOf(item.key) === -1);

    // 可编辑的

    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          <FormDetail
            form_data={formData}
            show_form={showForm}
            history={this.props.history}
          />
          <div style={{ marginBottom: '20px' }}>
            {this.getGridList()}
          </div>
          <FlowChart dataSource={flowChart} />
        </div>
        <WhiteSpace size="xl" />

        {flowRun && flowRun.status === 0 && (
          <div style={{ padding: '10px' }}>
            <Button
              type="primary"
              onClick={this.doWithDraw}
            >撤回
            </Button>
          </div>
        )}

      </div>
    );
  }
}
export default connect(({
  start, loading,
}) => ({
  start, loading: loading.global,
}))(StartDetail);
