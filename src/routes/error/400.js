import React from 'react';
// import { Icon } from 'antd'
import styles from './index.less';

const Error = () => (
  <div className={styles.error_400}>
    <div style={{ fontSize: '16px', lineHeight: '30px' }}>400</div>
    <div style={{ fontSize: '16px', lineHeight: '30px' }}>后台配置错误啦~</div>
  </div>
);

export default Error;
