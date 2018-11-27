// 审批的表单
import React, { Component } from 'react';
import { connect } from 'dva';
import { WhiteSpace } from 'antd-mobile';
import { FormDetail } from '../../components';
import spin from '../../components/General/Loader';
import CCPerson from '../../components/CCPerson';
import { makeGridItemData } from '../../utils/util';

import FlowChart from '../../components/FlowChart/chart';

import style from '../TableEdit/index.less';
import styles from '../common.less';

// @connect(({
//   start, loading, ccperson,
// }) => ({
//   ccperson,
//   start,
//   loading: loading.global,
// }))
class CCDetail extends Component {
  componentWillMount() {
    const { match: { params }, ccperson: { startflow } } = this.props;
    const { id } = params;
    if (startflow) {
      if (Object.keys(startflow).length && (`${startflow.id}` !== `${id}`)) {
        this.fetchDetail(id);
      }
    } else {
      this.fetchDetail(id);
    }
  }

  componentDidMount() {
    this.excuteScrollTo();
  }

  getGridItem = (key) => {
    const { ccperson: { gridformdata, startflow } } = this.props;
    const { fields: { grid } } = startflow;
    const [gridItem] = (grid || []).filter(item => `${item.key}` === `${key}`);
    const [currentGridData] = (gridformdata || []).filter(item => `${item.key}` === `${key}`);
    const dataList = makeGridItemData(currentGridData, gridItem);
    return dataList.map((item, i) => {
      const idx = i;
      return (
        <div
          key={idx}
          className={style.grid_list_item}
          onClick={() => this.toEditGrid(`/cc_grid/${key}/${i}`)}
        >
          {item.value_0 && <div className={style.main_info}>{item.value_0}</div>}
          {item.value_1 && <div className={style.desc}>{item.value_1}</div>}
          {item.value_2 && <div className={style.desc}>{item.value_2}</div>}
        </div>
      );
    });
  }

  getGridList = () => {
    const { ccperson } = this.props;
    const { startflow } = ccperson;
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

  excuteScrollTo = () => {
    const content = document.getElementById('con_content');
    if (content) {
      const { scrollTopDetails, location: { pathname } } = this.props;
      const scrollTop = scrollTopDetails[pathname];
      content.scrollTop = scrollTop;
    }
  }

  saveScrollTop = (height = 0) => {
    const content = document.getElementById('con_content');
    if (content) {
      const { scrollTop } = content;
      this.saveScrolModal((scrollTop - 0) + height);
    }
  }

  saveScrolModal = (scrollTop) => {
    const { dispatch, location: { pathname } } = this.props;
    dispatch({
      type: 'common/save',
      payload: {
        store: 'scrollTop',
        id: pathname,
        data: scrollTop,
      },
    });
  }

  fetchDetail = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'ccperson/getCCDetail',
      payload: {
        id,
        cb: (detail) => {
          dispatch({
            type: 'start/getFlowChart',
            payload: { id: detail.step_run_id },
          });
        },
      },
    });
  }

  toEditGrid = (url) => {
    const { history } = this.props;
    this.saveScrollTop();
    history.push(url);
  }

  render() {
    const { ccperson, loading, start } = this.props;
    const { startflow } = ccperson;
    const { flowChart } = start;
    const formData = ccperson.form_data;
    spin(loading);
    if (!startflow) return null;
    const { fields: { form } } = startflow;
    const cc = startflow.cc_person;

    // 只需要展示的（不包括可编辑的）
    const availableForm = form.filter(item =>
      startflow.step.available_fields.indexOf(item.key) !== -1);
    const showForm =
      availableForm.filter(item => startflow.step.hidden_fields.indexOf(item.key) === -1);
    // 可编辑的

    return (
      <div className={styles.con}>
        <WhiteSpace size="xl" />
        <div className={styles.con_content}>
          <FormDetail
            form_data={formData}
            show_form={showForm}
            history={this.props.history}
          />
          {this.getGridList()}
          <div style={{ marginBottom: '20px' }}>
            <p className={style.grid_opt}>审批进程</p>
            <FlowChart
              dataSource={flowChart}
              status={startflow.flow_run.status}
            />
          </div>
        </div>

      </div>
    );
  }
}

export default connect(({
  start, loading, ccperson,
}) => ({
  ccperson,
  start,
  loading: loading.global,
}))(CCDetail);
