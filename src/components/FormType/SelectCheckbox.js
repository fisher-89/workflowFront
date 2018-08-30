import React from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import {
  List, Picker, TextareaItem,
} from 'antd-mobile';
import CheckBox from '../ModalFilters/CheckBox';
import style from '../for/index.less';


class SelectCheckbox extends React.Component {
  renderFormPicker = (value, options, item) => {
    return (
      <Picker
        cols={1}
        value={value}
        data={options}
        onChange={e => this.onhandleSingleChange(e[0], item)}
      >
        <List.Item
          arrow="horizontal"
        // onClick={this.onClick}
        >
          {item.name}
        </List.Item>
      </Picker>
    );
  }

  render() {
    const {
      isEdit,
      field,
      data: { value },
      field: { type, name },
      options, onChange } = this.props;

    const cls = classNames(style.title, {
      [style.readonly]: !isEdit,
    });
    if (type === 'array') {
      return (
        <div className={style.file}>
          <p className={cls}>{name}</p>
          <div className={style.array_container}>
            <CheckBox
              style={{ marginBottom: '10px' }}
              options={options}
              value={isEdit ? value : defaultValue}
              {...(!isEdit && { onChange: v => onChange(v, field) })}
            />
          </div>
        </div>
      );
    }
    return isEdit ? (this.renderFormPicker(value, options, field)) : (
      <div className={style.readonly} key={i} >
        <TextareaItem
          title={name}
          autoHeight
          editable={false}
          value={defaultValue}
        />
      </div>
    );
  }
}
SelectCheckbox.defaultProps = {
  isEdit: true,
};

export default connect()(SelectComp);

// <div className={style.file}>
//           <p className={style.title}>{item.name}</p>
//           <div className={style.array_container}>
//             <CheckBox
//               style={{ marginBottom: '10px' }}
//               options={options}
//               value={value}
//               onChange={v => onChange(v, item)}
//             />
//           </div>
//         </div>
