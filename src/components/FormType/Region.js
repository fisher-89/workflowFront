import React from 'react';
// import classNames from 'classnames';
import { connect } from 'dva';
import {
  List, Picker, TextareaItem,
} from 'antd-mobile';
import style from './index.less';
import { isJSON } from '../../utils/util';
import districtTree from '../../utils/district.json';
import district from '../../utils/district.js';


class Region extends React.Component {
  renderFormRegion = (value, field) => {
    const { onChange } = this.props;
    const regionLevel = field.region_level;
    return (
      <Picker
        cols={regionLevel}
        value={value}
        data={districtTree}
        onOk={e => onChange(e, field)}
      >
        <List.Item
          arrow="horizontal"
        >
          {field.name}
        </List.Item>
      </Picker>
    );
  }

  renderCurrent = (data) => {
    const { field } = this.props;
    const regionLevel = field.region_level;
    let newData = null;
    if (typeof data === 'object' && data) {
      newData = data;
    } else {
      newData = isJSON(newData);
    }
    if (newData) {
      const [lastSn] = newData[regionLevel - 1];
      const [lastName] = district.filter(item => `${item.id}` === `${lastSn}`);
      return lastName;
    }
    return '';
  }

  render() {
    const { isEdit, field, data: { value },
      field: { name }, defaultValue } = this.props;
    return isEdit ? (this.renderFormRegion(value, field)) : (
      <div className={style.readonly} >
        <TextareaItem
          title={name}
          autoHeight
          editable={false}
          value={this.renderCurrent(defaultValue)}
        />
      </div>
    );
  }
}
Region.defaultProps = {
  isEdit: true,
  data: {},
};

export default connect()(Region);
