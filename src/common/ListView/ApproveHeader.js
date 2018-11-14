import React, { Component } from 'react';
import { converseTime } from '../../utils/util.js';
import { Label } from '../../components/General';
import { getApprState } from '../../utils/convert.js';
import style from './index.less';

export default class ApproveHeader extends Component {
  render() {
    const {
      value = {},
    } = this.props;
    const time = converseTime(value.time);
    return (
      <div
        className={style.list_item}
      >
        <div className={style.label_title}>
          {value.action_type !== 0 && (
          <Label
            content={getApprState(value ? value.action_type : '')}
            styles={{
          borderRadius: '0.05333rem',
          margin: 0,
          marginRight: '10px',
         }}
          />
        ) }

          <span className={style.title_name}>
            {value.name}
          </span>
        </div>
        <div className={style.form_desc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
              发起人：{value.person}
          </div>
          <div className={style.desc}>{time}</div>
        </div>

      </div >
    );
  }
}
