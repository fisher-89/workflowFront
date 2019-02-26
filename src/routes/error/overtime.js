import React from 'react';
// import { Icon } from 'antd'
import styles from './index.less';
import { setNavTitle } from '../../utils/util';


const Error = () => {
  setNavTitle('网络超时');
  return (
    <div className={styles.error_overtime} />
  );
};
export default Error;
