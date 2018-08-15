import React, { Component } from 'react';
import { SwipeAction } from 'antd-mobile';
import style from './index.less';

export default class RecordPreview extends Component {
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
      handleClick,
      paddingStyle,
      extra,
      conStyle,
    } = this.props;
    const prop = {
      autoClose: true,
    };
    if (extra) {
      prop.right = extra;
    }
    return (
      <div
        className={style.preview}
        style={conStyle}
        onClick={handleClick}
      >
        <SwipeAction
          {...prop}
        >
          <div className={style.pre_title} style={paddingStyle}>
            {value.name || value.event_name}
          </div>
          <div className={style.predec} style={paddingStyle}>
            {value.description}
          </div>
        </SwipeAction>
        <div className={style.person_point}>
          {this.renderPoint()}
        </div>
      </div>
    );
  }
}
RecordPreview.defaultProps = {
  handleClick: () => {},
};
