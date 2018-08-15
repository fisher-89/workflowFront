import React, { Component } from 'react';
import ListView from '../../components/ListView';
import style from './index.less';

@ListView
export default class FinalStaff extends Component {
  render() {
    const { value, onClick, checked, multiple } = this.props;
    const className = multiple ? { className: [style.item, checked ? style.checked : null].join(' ') } : null;
    return (
      <div
        className={style.action_item}
        onClick={() => onClick(value)}
      >
        <div
          {...className}
        >
          <span>{value.staff_name}</span>
        </div>
        <div className={style.brief}>
          <span>A分权限：{(value.point_a_deducting_limit ? `-${value.point_a_deducting_limit}` : '0')} 至 {value.point_a_awarding_limit}</span>
        </div>
        <div className={style.brief}>
          <span>B分权限：{(value.point_b_deducting_limit ? `-${value.point_b_deducting_limit}` : '0')} 至 {value.point_b_awarding_limit}</span>
        </div>
      </div>
    );
  }
}
FinalStaff.defaultProps = {
  multiple: false,
};
