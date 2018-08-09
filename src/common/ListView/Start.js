import React, { Component } from 'react';
import ListView from '../../components/ListView2';
import style from './index.less';

@ListView
export default class Buckle extends Component {
  render() {
    // const {
    //   value,
    // } = this.props;

    return (
      <div className={style.event_item}>
        <div
          className={style.main_info}
          // onClick={() => handleClick(value)}
        >
          测试
        </div>
      </div>
    );
  }
}
