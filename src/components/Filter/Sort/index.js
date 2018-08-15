import React, { Component } from 'react';
import style from '../index.less';

export default class ListSort extends Component {
  render() {
    const {
      children,
      visible,
    } = this.props;
    const conStyle = {
      display: visible ? 'block' : 'none',
    };
    return (
      <div
        style={conStyle}
        className={style.sort_con}
        onClick={(e) => { e.stopPropagation(); return false; }}
      >
        {children}
      </div>
    );
  }
}

