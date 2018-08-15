import React, { Component } from 'react';
import ListView from '../../components/ListView';
import style from './index.less';

@ListView
export default class EventName extends Component {
  render() {
    const { value, onClick, checked, multiple, name } = this.props;
    const className = multiple ? { className: [style.item, checked ? style.checked : null].join(' ') } : { className: style.single_item };
    return (
      <div className={style.action_item}>
        <div
          {...className}
          onClick={() => onClick(value)}
        >
          <div style={{ height: '32px', lineHeight: '32px' }}>{value[name]}</div>
        </div>
      </div>
    );
  }
}
EventName.defaultProps = {
  multiple: false,
};
