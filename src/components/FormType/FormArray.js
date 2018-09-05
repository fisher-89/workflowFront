import React from 'react';
import classNames from 'classnames';
import { connect } from 'dva';
import TagGroup from '../General/TagGroup';
import style from './index.less';


class FormArray extends React.Component {
  render() {
    const { isEdit, field, data: { value },
      field: { name }, defaultValue, onChange } = this.props;
    const cls = classNames(style.title, {
      [style.readonly]: !isEdit,
    });
    return (
      <div className={style.file}>
        <p className={cls}>{name}</p>
        <div className={style.array_container}>
          <TagGroup
            style={{ marginBottom: '10px' }}
            value={isEdit ? value || [] : defaultValue || []}
            {...(isEdit && { onChange: v => onChange(v, field) })}
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
