import React from 'react';

import {
  connect,
} from 'dva';
import style from './index.less';

class Bread extends React.Component {
  render() {
    const { handleBread, bread } = this.props;
    return (
      <div className={style.bread}>
        <div className={style.bread_title}>
          {bread.map((item, i) => {
        const idx = i;
        if (i !== bread.length - 1) {
          return (
            <div
              className={style.bread_item}
              onClick={() => handleBread(item)}
              key={idx}
            >
              <a>{item.name}
              </a>
              <span className={style.arrow}>{'>'}</span>
            </div>
          );
        } else {
          return (
            <div
              className={style.bread_item}
              key={idx}
            >
              <span>{item.name}</span>
            </div>
          );
        }
      })}
        </div>

      </div>
    );
  }
}

Bread.propTypes = {};

export default connect()(Bread);
