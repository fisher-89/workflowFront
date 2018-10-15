// 审批的控件详情

import React, { Component } from 'react';
import { connect } from 'dva';
import { WhiteSpace } from 'antd-mobile';
import { FormDetail } from '../../components';
import { getGridFilter } from '../../utils/convert';
import styles from '../common.less';

class StartGridDetail extends Component {
  state = {
    flag: true,
    key: '',
    index: '0',
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'start/updateModal',
    });
  }
  componentWillReceiveProps(nextprops) {
    const { match: { params } } = nextprops;
    const { flag, key } = this.state;
    if (!key && flag) {
      const { type, index } = params;
      this.setState({
        key: type,
        index,
        flag: false,
      });
    }
  }

  render() {
    const { start } = this.props;
    const { key, index } = this.state;
    const { startflow } = start;
    const formData = start.form_data;
    if (!startflow) {
      return '暂无信息';
    }
    let showGrid = [];
    if (startflow && key) {
      const { fields: { grid } } = startflow;
      const [showGridObj] = getGridFilter(grid, 'hidden_fields', startflow.step, 1).filter(item => item.key === key);
      showGrid = showGridObj.newFields;
    }
    return (
      <div className={styles.con}>
        <WhiteSpace size="xl" />
        <div className={styles.con_content}>
          <FormDetail
            form_data={formData[key] ? formData[key][index] : {}}
            show_form={showGrid}
            history={this.props.history}
          />
        </div>
      </div>
    );
  }
}
export default connect(({
  start, loading,
}) => ({
  start, loading,
}))(StartGridDetail);
