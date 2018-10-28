import React, {
  Component,
} from 'react';
import { connect } from 'dva';
import { List, Toast, TextareaItem, WhiteSpace } from 'antd-mobile';
import { createForm } from 'rc-form';
import { makeFieldValue, getUrlParams } from '../../utils/util';
import spin from '../../components/General/Loader';
import { PersonAdd, PersonIcon } from '../../components';

import style from './index.less';
import styles from '../common.less';

@connect(({
  start,
  loading,
}) => ({
  start,
  loading: loading.global,
}))
class SelectStep extends Component {
  componentWillMount() {

  }
  componentDidMount() {

  }


  render() {
    const { start: { preType }, loading, form: { getFieldProps } } = this.props;
    spin(loading);
    return (
      <div className={styles.con}>
        <div className={[styles.con_content, style.con_step].join(' ')} >
          <List renderHeader={() => <span>执行步骤</span>}>
            <div className={style.step_item}>
              <div className={style.step}>步骤</div>
              <div className={style.approver}>
                <div>审批人:</div>
                <div>
                  <PersonIcon nameKey="name" value={{ name: 'w' }} />
                  <PersonAdd />
                </div>
              </div>
            </div>
          </List>
          <WhiteSpace size="md" />
          <TextareaItem
            placeholder="请输入备注"
            rows={5}
            count={200}
            {...getFieldProps('remark', { initialValue: '' })}
          />
        </div>
        <div className={styles.footer}>
          <a onClick={this.submitStep}><span>提交</span></a>
        </div>
      </div>
    );
  }
}
export default createForm()(SelectStep);
