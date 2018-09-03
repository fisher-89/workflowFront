import React from 'react';
// import classNames from 'classnames';
import { connect } from 'dva';
import { TextareaItem, DatePicker, List } from 'antd-mobile';
import style from './index.less';

@connect()
export default class FormDate extends React.Component {
  renderFormDate = () => {
    const { onChange, data: { value }, field } = this.props;
    const { name, type } = field;
    return (
      <DatePicker
        mode={type}
        onChange={e => onChange(e, field)}
        value={type === 'time' ? new Date(`2018/8/1 ${value}`) : new Date(value)}
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

