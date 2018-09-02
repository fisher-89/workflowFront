import React, { Component } from 'react';
import ListView from '../../components/ListView';
import style from './index.less';

@ListView
export default class Shop extends Component {
  render() {
    const { value, onClick, checked, multiple, renderName = 'name' } = this.props;
    const className = [style.item, checked ? (multiple ? style.checked : style.single_item) : null].join(' ');

    return (
      <div
        onClick={() => onClick(value)}
        className={style.action_item}
      >
        <div
          // {...className}
          className={className}
        >{value[renderName]}
        </div>

      </div>
    );
  }
}
Shop.defaultProps = {
  multiple: false,
};
