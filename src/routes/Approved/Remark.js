
import React, { Component } from 'react';
import { Button, TextareaItem } from 'antd-mobile';
import { createForm } from 'rc-form';
import styles from '../common.less';


class Remark extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div className={styles.con}>
        <div className={styles.con_content}>
          <TextareaItem
            placeholder="请输入备注"
            {...getFieldProps('remark')}
            rows={5}
            count={100}
          />
        </div>
        <div style={{ padding: '10px' }}>
          <Button
            type="primary"
            onClick={this.handleSubmit}
          >确定
          </Button>
        </div>
      </div>
    );
  }
}
export default createForm()(Remark);
