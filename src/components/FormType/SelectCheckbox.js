import React from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import {
  List, Picker, TextareaItem,
} from 'antd-mobile';
import CheckBoxs from '../ModalFilters/CheckBox';
import style from './index.less';


class SelectCheckbox extends React.Component {
  makeTitleTips = () => {
    const { field: { min, max } } = this.props;
    let tip = '';
    if (min && max) {
      tip = `(${min}~${max}项)`;
    } else if (min) {
      tip = `(至少${min}项)`;
    } else if (max) {
      tip = `(至多${max}项)`;
    }
    return tip;
  }
  renderFormPicker = (value, options, item) => {
    const { onChange } = this.props;
    return (
      <Picker
        cols={1}
        value={[value]}
        data={options}
        dismissText="删除"
        onChange={e => onChange(e[0])}
        onDismiss={() => { onChange(''); }}
      >
        <List.Item
          arrow="horizontal"
        >
          {item.name}
        </List.Item>
      </Picker>
    );
  }

  render() {
    const { isEdit, field, data: { value },
      field: { name, max, min }, options, defaultValue, onChange } = this.props;
    const cls = classNames(style.title, {
      [style.readonly]: !isEdit,
    });
    const multiple = field.is_checkbox;
    if (multiple) {
      const tip = this.makeTitleTips();
      return (
        <div className={style.file}>
          <div >
            <p className={cls}><span>{name}</span></p>
            <span style={{ fontSize: '12px', color: '#c7c7c7' }}>{tip}</span>
          </div>
          <div className={style.array_container}>
            <CheckBoxs
              style={{ marginBottom: '10px' }}
              options={options}
              range={{ max, min }}
              value={isEdit ? value || [] : defaultValue || []}
              {...(isEdit && { onChange: v => onChange(v) })}
              readonly={!isEdit}
            />
          </div>
        </div>
      );
    }
    return isEdit ? (this.renderFormPicker(value, options, field)) : (
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
SelectCheckbox.defaultProps = {
  isEdit: true,
  data: {},
};

export default connect()(SelectCheckbox);
