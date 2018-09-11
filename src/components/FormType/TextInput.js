import React from 'react';
// import classNames from 'classnames';
import { connect } from 'dva';
import { TextareaItem, Toast, InputItem } from 'antd-mobile';
import style from './index.less';


class TextInput extends React.Component {
  onHandleBlur = (v) => {
    const { isRequire, field } = this.props;
    const { name, type, min, max } = field;
    if (isRequire && !v) {
      Toast.info(`请输入${name}`, 1.5);
    } else if (type === 'text') {
      if (min !== '' && v.length < min) {
        Toast.info(`字符长度在${min || '0'}~${max}之间`);
      }
    } else if (type === 'int') {
      this.formatIntValue(v, field);
    }
  }

  formatIntValue = (v, field) => {
    const { onChange } = this.props;
    const { scale, min } = field;
    const newValue = Number(v === '' ? min : v).toFixed(scale);
    onChange(newValue, field);
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
    if (item.type === 'text') {
      if (max !== '' && v.length > max) {
        // let newValue = v;
        newValue = newValue.length > max ? newValue.slice(0, max) : newValue;
        obj.value = newValue;
      }
    }
    onChange(newValue, item);
  }

  renderFormInput = () => {
    const { data: { value, hasError }, field } = this.props;
    const { name, description, type } = field;
    return (
      type === 'int' ? (
        <InputItem
          // type="digit"
          placeholder={description}
          clear
          onChange={e => this.handleOnChange(e, field)}
          onBlur={this.onHandleBlur}
          value={`${value || ''}`}

        >{name}
        </InputItem>
      ) : (
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
      ));
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
