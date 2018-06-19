import React from 'react';

import {
  connect,
} from 'dva';
import style from './index.less';

class Nothing extends React.Component {
  render() {
    return (
      <div style={{ display: 'flex', flexGrow: 1, height: '100%' }}>
        <div className={style.nothing}>
          <img
            src={this.props.src}
            alt="img"
          />
          <span>暂无数据</span>
        </div>
      </div>
    );
  }
}

Nothing.propTypes = {};

export default connect()(Nothing);
