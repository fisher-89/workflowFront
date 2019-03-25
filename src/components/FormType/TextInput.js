import React from 'react';
// import classNames from 'classnames';
import { connect } from 'dva';
import { TextareaItem, Toast, InputItem } from 'antd-mobile';
import style from './index.less';


class TextInput extends React.Component {
  constructor(props) {
    const { data: { value } } = props;
    super(props);
    this.state = {
      value,
    };
  }

  componentWillReceiveProps(props) {
    const { data } = props;
    const { value, key } = data;
    if (key === this.props.data.key && value !== this.props.data) {
      this.setState({
        value,
      });
    }
  }

  onHandleBlur = (v) => {
    const { isRequire, field, onChange } = this.props;
    const { name, type, min, max } = field;
    let newValue = v;
    if (isRequire && !v) {
      Toast.info(`请输入${name}`, 1.5);
    } else if (type === 'text') {
      if (min !== '' && v.length < min) {
        Toast.info(`${name}字符长度在${min || '0'}~${max}之间`, 1);
      }
      newValue = max && newValue.length > max ? newValue.slice(0, max) : newValue;
    } else if (type === 'int') {
      newValue = this.formatIntValue(newValue, field);
    }
    this.setState({ value: newValue }, () => {
      onChange(newValue, field);
    });
  }

  formatIntValue = (v, field) => {
    const { scale, min } = field;
    const value = (v !== '' && min !== '' && (min - v > 0)) ? min : v;
    const idx = value.indexOf('.');
    const curScale = idx > -1 ? value.slice(idx + 1).length : 0;
    // const newValue = curScale > scale ? (value.slice(0, value.indexOf('.') + (scale - 0) + 1))
    // : Number(value).toFixed(scale);
    let newValue;
    if (v !== '' && !isNaN(v)) {
      const tmpValue = `${Number(value)}`;
      newValue = curScale > scale ? (tmpValue.slice(0, tmpValue.indexOf('.') + (scale - 0) + 1)) : Number(value).toFixed(scale);
    } else {
      newValue = '';
    }
    return newValue;
  }

  handleOnChange = (v, item) => {
    const { onChange } = this.props;
    const { max, scale } = item;
    let newValue = v;
    if (item.type === 'int') {
      const reg = /^(-|\d)\d*(\.)?(\d)*$/;
      if (max !== '' && reg.test(v) && (parseFloat(v) - max > 0)) {
        newValue = max;
      } else if (reg.test(v)) {
        if (v.indexOf('.') > 0 && (v.split('.')[1].length > scale)) {
          // newValue = Number(v).toFixed(scale);
          newValue = v.slice(0, v.indexOf('.') + (scale - 0) + 1);
        }
      } else {
        newValue = parseFloat(v);
      }
    }
    this.setState({
      value: newValue,
    }, () => {
      // onChange(newValue);
    });
  }

  renderFormInput = () => {
    const { data: { hasError }, field } = this.props;
    const { value } = this.state;
    const { name, description, type } = field;

    return (type === 'int') ?
      (
        <InputItem
          clear
          // maxLength={max || (type === 'int' ? 16 : max)}
          placeholder={description}
          error={hasError}
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
          onFocus={this.onFocus}
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
  data: { value: '' },
};

export default connect()(TextInput);
