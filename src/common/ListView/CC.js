import React, { Component } from 'react';
import ListView from '../../components/ListView';
import { converseTime } from '../../utils/util.js';

import style from './index.less';

@ListView
export default class CC extends Component {
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

          <span className={style.title_name}>
            {value && value.flow_run ? `${value.flow_run.creator_name}的${value.flow_run.name}` : ''}
          </span>
        </div>
        <div
          className={style.form_desc}
        >步骤：{value.step_name}
        </div>
        <div className={style.desc}>{time}</div>
      </div>
    );
  }
}
