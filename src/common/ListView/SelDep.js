import React, { Component } from 'react';
import ListView from '../../components/ListView';
import style from './index.less';

@ListView
export default class SelDep extends Component {
  render() {
    const { value, onClick, extra, checked, multiple, renderName = 'realname' } = this.props;
    const className = checked ?
      { className: multiple ? style.checked : style.single_checked } :
      { className: multiple ? style.unchecked : style.single_unchecked };
    return (
      <div
        className={style.seldep_item}
      >
        <div
          {...className}
          onClick={() => onClick(value)}
        >{value[renderName]}
        </div>
        {extra && extra(value)}
      </div>
    );
  }
}
SelDep.defaultProps = {
  multiple: false,
};
