import React, { Component } from 'react';
import style from './index.less';

export default class RecordDetail extends Component {
  renderPoint = () => {
    const { value } = this.props;
    const { participants } = value;
    const items = participants.map((item, i) => {
      const key = i;
      return (
        <div className={style.item} key={key}>
          <span>{item.staff_name}</span>
          <span>A:{item.point_a * item.count} <i>({item.point_a}x{item.count})</i></span>
          <span>B:{item.point_b * item.count} <i>({item.point_b}x{item.count})</i></span>
        </div>
      );
    });
    return items;
  }
  render() {
    const {
      value,
      conStyle,
      paddingStyle,
    } = this.props;

    return (
      <div
        className={style.preview}
        style={conStyle}
      >
        <div className={style.event_pre_title} style={paddingStyle}>
          {value.name || value.event_name}
        </div>
        <div className={style.predecription} style={paddingStyle}>
          {value.description}
        </div>
        <div className={style.person_point} >
          {this.renderPoint()}
        </div>
        <div className={style.predecription} style={{ ...(paddingStyle), color: 'rgb(220,220,220)' }}>
        编号：{value.id}
        </div>
      </div>
    );
  }
}
