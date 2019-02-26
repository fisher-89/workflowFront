import React from 'react';
// import { Icon } from 'antd'
import { setNavTitle } from '../../utils/util';
import styles from './index.less';

const Error = ({ message }) => {
  setNavTitle('400');
  return (
    <div className={styles.error_400}>
      <div style={{ fontSize: '16px', lineHeight: '30px' }}>400</div>
      <div style={{ fontSize: '16px', lineHeight: '30px' }}>{message}</div>
    </div>
  );
};
Error.defaultProps = {
  message: '后台配置错误',
};
export default Error;
