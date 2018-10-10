import React, { Component } from 'react';
import ListView from '../../components/ListView';
import { converseTime } from '../../utils/util.js';
import style from './index.less';

@ListView
export default class Start extends Component {
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

    return (
      <div
        className={style.list_item}
        onClick={() => onHandleClick(value)}
      >
        <div className={style.label_title}>
          <span className={style.title_name}>{value.name}</span>
        </div>
        {this.renderFormData()}
        <div className={style.desc}>{time}</div>
      </div>
    );
  }
}
