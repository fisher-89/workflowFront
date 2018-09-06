import React from 'react';
// import classNames from 'classnames';
import { connect } from 'dva';
import { TextareaItem, Toast } from 'antd-mobile';
import style from './index.less';


class TextInput extends React.Component {
  onHandleBlur = (v) => {
    const { isRequire, field: { name } } = this.props;
    if (isRequire && !v) {
      Toast.info(`请输入${name}`, 1.5);
    }
  }

  renderFormInput = () => {
    const { onChange, data: { value, hasError }, field } = this.props;
    const { name, description, type } = field;
    const inputType = type === 'int' ? { type: 'number' } : null;
    return (
      <TextareaItem
        clear
        title={name}
        autoHeight
        {...inputType}
        placeholder={description}
        error={hasError}
        onChange={e => onChange(e, field)}
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
