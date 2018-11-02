// 审批的控件详情

import React, { Component } from 'react';
import { connect } from 'dva';
import { FormDetail } from '../../components';
import { getGridFilter, availableFormFilter } from '../../utils/convert';
import styles from '../common.less';

class ApproveGridDetail extends Component {
  state = {
    flag: true,
    key: '',
    index: '0',
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'approve/updateModal',
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

  render() {
    const { approve } = this.props;
    const { key, index } = this.state;
    const { startflow } = approve;
    const formData = approve.form_data;
    if (!startflow) {
      return '暂无信息';
    }
    let showGrid = [];
    let availableFeilds = [];

    if (startflow && key) {
      const { fields: { grid } } = startflow;
      // const [showGridObj] =
      // getGridFilter(grid, 'hidden_fields', startflow.step, 1).filter(item => item.key === key);
      // showGrid = showGridObj.newFields;

      const [availableForm] = getGridFilter(grid, 'available_fields', startflow.step).filter(item => item.key === key);
      availableFeilds = availableForm.newFields;
      const gridKey = availableForm.key;
      showGrid = availableFormFilter(gridKey, availableFeilds, 'hidden_fields', startflow.step, 1);
    }
    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          <FormDetail
            form_data={formData[key] ? formData[key][index] : {}}
            show_form={showGrid}
            history={history}
          />
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
}))(ApproveGridDetail);
