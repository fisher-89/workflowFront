import React from 'react';
// import classNames from 'classnames';
import { connect } from 'dva';
import { TextareaItem, Toast } from 'antd-mobile';
import style from './index.less';


class TextInput extends React.Component {
  onHandleBlur = (v) => {
    const { isRequire, field, onChange } = this.props;
    const { name, type, min, max } = field;
    let newValue = v;
    if (isRequire && !v) {
      Toast.info(`请输入${name}`, 1.5);
    } else if (type === 'text') {
      if (min !== '' && v.length < min) {
        Toast.info(`字符长度在${min || '0'}~${max}之间`);
      }
      newValue = newValue.length > max ? newValue.slice(0, max) : newValue;
    } else if (type === 'int') {
      newValue = this.formatIntValue(newValue, field);
    }
    onChange(newValue, field);
  }

  formatIntValue = (v, field) => {
    const { scale, min } = field;
    const newValue = Number(v === '' ? min : v).toFixed(scale);
    return newValue;
  }

  handleOnChange = (v, item) => {
    const { onChange } = this.props;
    const { max, scale } = item;
    let newValue = v;
    if (item.type === 'int') {
      const reg = /^(-|\d)\d*(\.)?(\d)*$/;
      if (max !== '' && parseFloat(v) > max) {
        newValue = max;
      } else if (reg.test(newValue)) {
        if (v.indexOf('.') > 0 && v.split('.')[1].length > scale) {
          newValue = Number(v).toFixed(scale);
        }
      } else {
        newValue = parseFloat(v);
      }
    }
    onChange(newValue, item);
  }

  renderFormInput = () => {
    const { data: { value, hasError }, field } = this.props;
    const { name, description } = field;
    return (

      <TextareaItem
        clear
        title={name}
        autoHeight
        placeholder={description}
        error={hasError}
        onChange={e => this.handleOnChange(e, field)}
        onBlur={this.onHandleBlur}
        value={`${value || ''}`}
      />
    );
  }

  render() {
    const { isEdit, field: { name }, defaultValue } = this.props;
    return isEdit ? (this.renderFormInput()) : (
      <div className={style.readonly} >
        <TextareaItem
          title={name}
          autoHeight
          editable={false}
          value={`${defaultValue || ''}` || '暂无'}
        />
      </div>
    );
  }
}
TextInput.defaultProps = {
  isEdit: true,
};

export default connect()(TextInput);
