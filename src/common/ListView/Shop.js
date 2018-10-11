import React, { Component } from 'react';
import ListView from '../../components/ListView';
import style from './index.less';

@ListView
export default class Shop extends Component {
  render() {
    const { value, onClick, checked, multiple, renderName = 'name' } = this.props;
    const className = [style.item, style.shop_item, multiple ? null : style.single, checked ? (multiple ? style.checked : style.single_item) : null].join(' ');
    return (
      <div
        onClick={() => onClick(value)}
        className={style.action_item}
      >
        <div
          // {...className}
          className={className}
        >
          <span>{value[renderName]}</span>
        </div>

      </div>
    );
  }
}
Shop.defaultProps = {
  multiple: false,
};
