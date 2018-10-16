import React from 'react';
// import classNames from 'classnames';
import { connect } from 'dva';
import {
  List, Picker, TextareaItem,
} from 'antd-mobile';
import style from './index.less';
import { isJSON } from '../../utils/util';
import districtTree from '../../../district.json';
import district from '../../../district.js';

const region = ['province_id', 'city_id', 'county_id', 'address'];
const regionSelect = ['province_id', 'city_id', 'county_id'];
const addressInfo = {
  province_id: '',
  city_id: '',
  county_id: '',
  address: '',
};
class Region extends React.Component {
  constructor(props) {
    super(props);
    const { data: { value } } = props;
    const newAddress = { ...addressInfo, ...(value || {}) };
    this.state = {
      address: newAddress,
    };
  }

  componentWillReceiveProps(props) {
    const { data } = props;
    const oldData = this.props.data;
    if (JSON.stringify(data) !== JSON.stringify(oldData)) {
      const { value } = data;
      const newAddress = { ...addressInfo, ...(value || {}) };
      this.setState({
        address: newAddress,
      });
    }
  }

  onHandlePickerChange = (e) => {
    const { address } = this.state;
    const obj = this.reverseValidValue(e);
    const newAddress = {
      ...address, ...obj,
    };
    this.onChangeCallback(newAddress);
  }

  onHandleChange = (e) => {
    const { address } = this.state;
    const newAddress = {
      ...address, address: e,
    };
    this.onChangeCallback(newAddress);
  }

  onChangeCallback = (value) => {
    const { onChange } = this.props;
    this.setState({
      address: value,
    }, () => {
      onChange(value);
    });
  }

  makeValidValue = (value) => {
    const keys = Object.keys(value);
    const newValue = [];
    keys.forEach((key) => {
      const text = value[key];
      const index = regionSelect.indexOf(key);
      if (index > -1 && text) {
        newValue.splice(index, 0, text);
      }
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

  clearRegion = () => {
    const { address } = this.state;
    const newAddress = {
      ...address,
      province_id: '',
      city_id: '',
      county_id: '',
    };
    this.onChangeCallback(newAddress);
  }
  renderFormRegion = (value, field) => {
    const areaValue = this.makeValidValue(value);
    const { address } = value;
    const cols = `${field.region_level}` === '4' ? 3 : field.region_level;
    const { name } = field;
    return (
      <div>
        {this.renderFormArea(areaValue, name, cols)}
        {`${field.region_level}` === '4' && this.renderFormAddress(address, areaValue)}
      </div>
    );
  }

  renderFormArea = (value, name, cols) => {
    return (
      <Picker
        cols={cols}
        value={value}
        data={districtTree}
        onOk={e => this.onHandlePickerChange(e)
        }
        dismissText="删除"
        onDismiss={() => { this.clearRegion(); }
        }
      >
        <List.Item
          arrow="horizontal"
        >
          {name}
        </List.Item>
      </Picker>
    );
  }

  renderFormAddress = (value, areaValue) => {
    const readonly = !areaValue.length;
    return (
      <TextareaItem
        clear
        title="详细地址"
        autoHeight
        disabled={readonly}
        placeholder="详细地址：如小区、门牌号等"
        onChange={e => this.onHandleChange(e)}
        value={`${value || ''}`}
      />
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
      return lastName ? lastName.full_name : '';
    }
    return '';
  }

  render() {
    const { isEdit, field,
      field: { name }, defaultValue } = this.props;
    const { address } = this.state;
    return isEdit ? (this.renderFormRegion(address, field)) : (
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
  onChange: () => { },
};

export default connect()(Region);
