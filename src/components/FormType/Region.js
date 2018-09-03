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

const region = ['province_id', 'city_id', 'area_id'];
class Region extends React.Component {
  makeValidValue = (value) => {
    const keys = Object.keys(value);
    const newValue = [];
    keys.forEach((key) => {
      const id = value[key];
      const index = region.indexOf(key);
      newValue.splice(index, 0, id);
    });
    return newValue;
  }

  reverseValidValue = (arr) => {
    const obj = {};
    arr.forEach((item, i) => {
      const key = region[i];
      obj[key] = item;
    });
    return obj;
  }
  renderFormRegion = (value, field) => {
    const newValue = this.makeValidValue(value);
    const { onChange } = this.props;
    const regionLevel = field.region_level;
    return (
      <Picker
        cols={regionLevel}
        value={newValue}
        data={districtTree}
        onOk={(e) => {
         const obj = this.reverseValidValue(e);
          onChange(obj, field);
          }
        }
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
    let newData = null;
    if (typeof data === 'object' && data) {
      newData = data;
    } else {
      newData = isJSON(newData);
    }
    if (newData) {
      const addrSnArray = this.makeValidValue(newData);
      const lastSn = addrSnArray[addrSnArray.length - 1];
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
