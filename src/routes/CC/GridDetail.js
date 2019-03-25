// 抄送人的列表控件详情

import React, { Component } from 'react';
import { connect } from 'dva';
import { WhiteSpace } from 'antd-mobile';
import { FormDetail } from '../../components';
import { getGridFilter, availableFormFilter } from '../../utils/convert';
import styles from '../common.less';
import { setNavTitle } from '../../utils/util';

class CCGridDetail extends Component {
  constructor(props) {
    super(props);
    const { match: { params } } = props;
    const { type, index, title } = params;
    setNavTitle(title);
    this.state = {
      key: type,
      index,
    };
  }

  render() {
    const { ccperson } = this.props;
    const { key, index } = this.state;
    const { startflow } = ccperson;
    const formData = ccperson.form_data;
    if (!startflow) {
      return '暂无信息';
    }
    let showGrid = [];
    let availableFeilds = [];
    if (startflow && key) {
      const { fields: { grid } } = startflow;
      const [availableForm] = getGridFilter(grid, 'available_fields', startflow.step).filter(item => item.key === key);
      availableFeilds = availableForm.newFields;
      const gridKey = availableForm.key;
      showGrid = availableFormFilter(gridKey, availableFeilds, 'hidden_fields', startflow.step, 1);
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
  ccperson, loading,
}) => ({
  ccperson, loading,
}))(CCGridDetail);
