import React, { Component } from 'react';
import ListView from '../../components/ListView';
import { Label } from '../../components/General';
import { getApprState } from '../../utils/convert.js';
import { converseTime } from '../../utils/util.js';

import style from './index.less';

@ListView
export default class CC extends Component {
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
          className={style.form_desc}
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

          <span className={style.title_name}>
            {value && `${value.staff_name}的`}{value.flow_name}
          </span>
        </div>
        {this.renderFormData()}
        <div className={style.desc}>{time}</div>
      </div>
    );
  }
}
