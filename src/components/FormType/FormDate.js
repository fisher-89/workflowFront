import React from 'react';
// import classNames from 'classnames';
import { connect } from 'dva';
import moment from 'moment';
import { TextareaItem, DatePicker, List } from 'antd-mobile';
import { formatDate } from '../../utils/util';
import style from './index.less';

@connect()
export default class FormDate extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {

  //   };
  // }


  handleOnChange = (v, field) => {
    const { type } = field;
    const { onChange } = this.props;
    const formatStr = formatDate(type);
    const value = moment(v).format(formatStr);
    onChange(value);
  }

  renderFormDate = () => {
    const { data: { value }, field, onChange } = this.props;
    const { name, type, max, min } = field;
    const nowTime = moment().format(formatDate('time'));
    let newMax = max;
    let newMin = min;
    let newValue = value;
    if (type === 'time') {
      newMax = max ? `2018-08-01 ${max}` : undefined;
      newMin = min ? `2018-08-01 ${min}` : undefined;
      newValue = value ? `2018-08-01 ${value || max || nowTime}` : undefined;
    }

    const maxDate = newMax ? new Date(newMax.replace(/-/g, '/')) : undefined;
    const minDate = newMin ? new Date(newMin.replace(/-/g, '/')) : undefined;
    const valueDate = newValue ? new Date(newValue.replace(/-/g, '/')) : undefined;
    return (
      <DatePicker
        mode={type}
        value={valueDate}
        minDate={minDate}
        maxDate={maxDate}
        dismissText="删除"
        onChange={e => this.handleOnChange(e, field)}
        onDismiss={() => { onChange(''); }}
      >
        <List.Item arrow="horizontal">{name}</List.Item>
      </DatePicker>
    );
  }

  render() {
    const { isEdit, field: { name }, defaultValue } = this.props;
    return isEdit ? (this.renderFormDate()) : (
      <div className={style.readonly} >
        <TextareaItem
          title={name}
          autoHeight
          editable={false}
          value={`${defaultValue || ''}`}
        />
      </div>
    );
  }
}
FormDate.defaultProps = {
  isEdit: true,
};

