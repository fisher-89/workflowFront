import React, { Component } from 'react';
import ListView from '../../components/ListView';
import { findTreeParent, getLetfEllipsis } from '../../utils/util';

import style from './index.less';

@ListView
export default class SearchEvent extends Component {
  renderBread = (bread) => {
    const breadStrArr = bread.map(item => item.name);
    const breadStr = getLetfEllipsis(breadStrArr.join('>'), 220, 12);
    return breadStr;
  }
  render() {
    const { value, onClick, checked, multiple, breadData } = this.props;
    const bread = findTreeParent(breadData, value.type_id);
    bread.reverse();
    const className = multiple ? { className: [style.item, checked ? style.checked : null].join(' ') } : { className: style.single_item };
    return (
      <div
        className={style.action_item}
        onClick={() => onClick(value)}
      >
        <div
          {...className}
        >
          <span>{value.name}</span>
        </div>
        <div className={style.extra_info}>
          <div className={style.event_bread}>
            {this.renderBread(bread)}
          </div>
          <div className={style.department_title}>
            {value.first_approver_name && <span>{value.first_approver_name}</span> }
            {value.final_approver_name && <span style={{ marginLeft: '5px' }}>{value.final_approver_name}</span>}
          </div>
        </div>
      </div>
    );
  }
}
SearchEvent.defaultProps = {
  multiple: false,
};
