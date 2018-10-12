import React, { Component } from 'react';
import ListView from '../../components/ListView';
import { Label } from '../../components/General';
import { getApprState } from '../../utils/convert.js';
import { converseTime } from '../../utils/util.js';

import style from './index.less';

@ListView
export default class Approve extends Component {
  renderFormData = () => {
    const { value } = this.props;
    const formdata = value.form_data || [];
    const arrayData = formdata.map((item) => {
      const text = Object.keys(item).map(key => (`${key}：${item[key]}`));
      return text.join('\n');
    });
    return arrayData.map((item, i) => {
      const idx = i;
      return (
        <div
          className={style.desc}
          key={idx}
        >{item}
        </div>
      );
    });
  }
  render() {
    const {
      value,
      timeKey,
      onHandleClick,
    } = this.props;
    const time = converseTime(value[timeKey]);
    // <div className={style.desc}>{value && value.flow_run ? value.flow_run.name : ''}</div>
    return (
      <div
        className={style.list_item}
        onClick={() => onHandleClick(value)}
      >
        <div className={style.label_title}>
          <Label
            content={getApprState(value ? value.action_type : '')}
            styles={{
            borderRadius: '0.05333rem',
            margin: 0,
            marginRight: '10px',
           }}
          />
          <span className={style.title_name}>{value.flow_name}</span>
        </div>
        <div className={style.desc}>发起人：{value && value.flow_run ? value.flow_run.creator_name : ''}</div>

        {this.renderFormData()}
        <div className={style.desc}>{time}</div>
      </div>
    );
  }
}
