import React, { Component } from 'react';
import moment from 'moment';
import ListView from '../../components/ListView';
import { Label } from '../../components/General';
import { getApprState } from '../../utils/convert.js';
import { isToday } from '../../utils/util.js';

import style from './index.less';

@ListView
export default class Approve extends Component {
  render() {
    const {
      value,
      timeKey,
      onHandleClick,
    } = this.props;
    const time = isToday(value[timeKey]) ? moment(value[timeKey]).format('HH:MM') : value[timeKey];

    return (
      <div
        className={style.list_item}
        onClick={() => onHandleClick(value)}
      >
        <div className={style.label_title}>
          <Label
            content={getApprState(value ? value.action_type : '')}
            styles={{
            borderRadius: '0.05333rem',
            margin: 0,
           }}
          />
          <span className={style.title_name}>{value.flow_name}</span>
        </div>
        <div className={style.desc}>{value ? value.flow_run.name : ''}</div>
        <div className={style.desc}>{time}</div>
      </div>
    );
  }
}
