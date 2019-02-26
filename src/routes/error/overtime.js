import React from 'react';
// import { Icon } from 'antd'
import styles from './index.less';
import { setNavTitle } from '../../utils/util';

setNavTitle('网络超时');

const Error = () => (
  <div className={styles.error_overtime} />
);

export default Error;
