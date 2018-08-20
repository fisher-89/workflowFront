// 审批的控件详情

import React, {
  Component,
} from 'react';
import {
  connect,
} from 'dva';
import {
  FormDetail,
} from '../../components';
import {
  getGridFilter,
} from '../../utils/convert';
import styles from '../common.less';

class StartGridDetail extends Component {
  state = {
    flag: true,
    key: '',
    index: '0',
  }
  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'start/refreshModal',
    });
  }
  componentWillReceiveProps(nextprops) {
    const {
      match: { params },
    } = nextprops;
    const {
      flag,
      key,
    } = this.state;

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
  csoLog = () => {
    this.childComp.saveData();
    this.props.history.goBack(-1);
  }
  render() {
    const {
      start,
    } = this.props;
    const {
      key,
      index,
    } = this.state;
    const {
      startflow,
    } = start;
    const formData = start.form_data;
    if (!startflow) {
      return '暂无信息';
    }
    let showGrid = [];
    if (startflow && key) {
      const {
        fields: {
          grid,
        },
      } = startflow;
      showGrid = getGridFilter(grid, 'hidden_fields', startflow.step, 1).find(item => item.key === key).newFields;
    }
    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          <FormDetail
            form_data={formData[key] ? formData[key][index] : {}}
            show_form={showGrid}
          />
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
  loading,
}))(StartGridDetail);
