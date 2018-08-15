import React, { Component } from 'react';
import moment from 'moment';
import ListView from '../../components/ListView';
import { isToday } from '../../utils/util';
import style from './index.less';


@ListView
export default class Auditted extends Component {
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
            <span className={style.audit_event_name}>{value.title}</span>
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
            {value.remark || '无'}
          </div>
          <div className={style.event_num}>
            <div style={{ display: 'flex' }}>
              <div className={style.num}>
                <span>事件数量</span><span>{value.participant_count}</span>
              </div>
              <div className={style.num}>
                <span>总人次</span><span>{value.event_count}</span>
              </div>
            </div>
            <span className={style.show_time}>{isToday(value.created_at) ? moment(value.created_at).format('HH:MM') : moment(value.created_at).format('YYYY-MM-DD HH:MM')}</span>
          </div>
        </div>
        {extra && extra(value)}
      </div>
    );
  }
}
