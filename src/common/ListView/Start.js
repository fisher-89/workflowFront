import React, { Component } from 'react';
import ListView from '../../components/ListView';
import { converseTime } from '../../utils/util.js';
import style from './index.less';

@ListView
export default class Start extends Component {
  render() {
    const {
      value,
      timeKey,
      onHandleClick,
    } = this.props;
    const time = converseTime(value[timeKey]);

    return (
      <div
        className={style.list_item}
        onClick={() => onHandleClick(value)}
      >
        <div className={style.label_title}>

          <span className={style.title_name}>{value.name}</span>
        </div>
        <div className={style.desc}>{time}</div>
      </div>
    );
  }
}
