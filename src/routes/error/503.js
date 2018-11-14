import React from 'react';
// import { Icon } from 'antd'
import styles from './index.less';

const Error = () => (
  <div className={styles.error_503}>
    <div style={{ fontSize: '16px', marginTop: '160px', lineHeight: '30px' }}>503</div>
    <div style={{ fontSize: '16px' }}>对不起，系统正处于维护中，请稍后访问！</div>
  </div>
);

export default Error;
