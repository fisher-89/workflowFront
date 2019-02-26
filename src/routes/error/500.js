import React from 'react';
// import { Icon } from 'antd'
import styles from './index.less';
import { setNavTitle } from '../../utils/util';


const Error = () => {
  setNavTitle(503);
  return (
    <div className={styles.error_500}>
      <div style={{ fontSize: '16px', lineHeight: '30px' }}>500</div>
      <div style={{ fontSize: '16px' }}>服务器遇到错误，无法完成请求</div>
    </div>
  );
};

export default Error;
