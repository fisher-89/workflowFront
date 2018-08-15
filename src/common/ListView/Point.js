import React, { Component } from 'react';
// import { Flex } from 'antd-mobile';
import ListView from '../../components/ListView';
import { convertPointSource } from '../../utils/convert.js';
import style from './index.less';
// const { Item } = List;
@ListView
export default class Point extends Component {
  render() {
    const { handleClick, value } = this.props;
    return (
      <div
        className={style.event_item}
        onClick={() => handleClick(value)}
      >
        <div
          className={style.main_info}
          style={{ marginRight: 0 }}
        >
          <div className={style.event_title}>
            <span>{value.title}</span>
          </div>
          <div className={style.time}>
            <span className={[style.point_title].join(' ')} style={{ marginRight: '4.27rem' }}>A分</span>
            <span className={[style.point_title].join(' ')}>B分</span>
          </div>
          <div className={style.point_change}>
            <span
              style={{ marginRight: '4.27rem' }}
              className={[style.point_value, value.point_a < 0 ? style.error : style.success].join(' ')}
            >{value.point_a}
            </span>
            <span className={[style.point_value, value.point_b < 0 ? style.error : style.success].join(' ')}>{value.point_b}</span>
          </div>
          <div className={style.time}>
            <span style={{ marginRight: '1.6rem' }}>来源：{convertPointSource(value.source_id)} </span>
            <span>生效时间：{value.changed_at}</span>
          </div>
        </div>
      </div>
    );
  }
}
