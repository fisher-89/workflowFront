import React from 'react';
// import { Icon } from 'antd'
import { setNavTitle } from '../../utils/util';
import styles from './index.less';

setNavTitle('400');
const Error = ({ message }) => (
  <div className={styles.error_400}>
    <div style={{ fontSize: '16px', lineHeight: '30px' }}>400</div>
    <div style={{ fontSize: '16px', lineHeight: '30px' }}>{message}</div>
  </div>
);
Error.defaultProps = {
  message: '后台配置错误',
};
export default Error;
