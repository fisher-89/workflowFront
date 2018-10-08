import React from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import TagGroup from '../General/TagGroup';
import style from './index.less';


class FormArray extends React.Component {
  render() {
    const { isEdit, field, data: { value },
      field: { name }, defaultValue, onChange } = this.props;
    const { max, min } = field;
    const range = {
      min, max,
    };
    const cls = classNames(style.title, {
      [style.readonly]: !isEdit,
    });
    const conCls = classNames(style.array_container, {
      [style.readonly]: !isEdit,
    });
    return (
      <div className={style.file}>
        <p className={cls}>{name}</p>
        <div className={conCls}>
          <TagGroup
            style={{ marginBottom: '10px' }}
            value={isEdit ? value || [] : defaultValue || []}
            {...(isEdit && { onChange: v => onChange(v) })}
            range={range}
            readonly={!isEdit}
          />
        </div>
      </div>
    );
  }
}
FormArray.defaultProps = {
  isEdit: false,
  data: {},
};

export default connect()(FormArray);
