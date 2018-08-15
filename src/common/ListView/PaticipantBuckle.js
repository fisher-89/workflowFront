import React, { Component } from 'react';
import moment from 'moment';
import ListView from '../../components/ListView';


import style from './index.less';


@ListView
export default class PaticipantBuckle extends Component {
  render() {
    const {
      handleClick,
      hasShortcut = false,
      value,
      label,
      extra,
    } = this.props;

    return (
      <div className={style.event_item}>
        <div
          className={style.main_info}
          style={{ marginRight: hasShortcut ? '0.53333333rem' : '0' }}
          onClick={() => handleClick(value)}
        >
          <div className={style.event_title}>
            <span className={style.event_name}>{value.event_name}</span>
            {label.map((its, i) => {
              const idx = i;
              return (
                <div
                  key={idx}
                  className={style[its.labelStyle(value)]}
                >
                  {its.evt(value)}
                </div>
              );
            })}
          </div>
          <div className={style.time}>
            {value.description}
          </div>
          <div className={style.desc}>事件时间：{value.executed_at && moment(value.executed_at).format('YYYY-MM-DD')}</div>
        </div>
        {extra && extra(value)}
      </div>
    );
  }
}
