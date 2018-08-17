import React from 'react';

import {
  connect,
} from 'dva';
import nothing from '../../assets/nothing.png';
import style from './index.less';

class Nothing extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex', flexGrow: 1, height: '100%' }}>
        <div className={style.nothing}>
          <img
            src={this.props.src || nothing}
            alt="img"
          />
          <span>暂无数据</span>
        </div>
      </div>
    );
  }
}


export default connect()(Nothing);
