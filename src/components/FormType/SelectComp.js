import React from 'react';
import { List, TextareaItem } from 'antd-mobile';
import { connect } from 'dva';
import { isJSON, makeFieldValue } from '../../utils/util';
import './index.less';

const dispatchColumn = {
  staff: {
    modal: 'formSearchStaff',
    reduce: 'saveSelectStaff',
    to: 'form_sel_person',
    name: 'value',
    key: 'staff_sn',
    value: 'realname',
  },
  department: {
    modal: 'formSearchDep',
    reduce: 'saveSelectDepartment',
    to: 'form_sel_department',
    name: 'value',
    key: 'id',
    value: 'name',
  },
  shop: {
    modal: 'formSearchShop',
    reduce: 'saveSelectShop',
    to: 'form_sel_shop',
    name: 'value',
    key: 'shop_sn',
    value: 'name',
  },
};

class SelectComp extends React.Component {
  makeFormStaff = (newSelectstaff) => {
    const selectedStaff = newSelectstaff.map((item) => {
      const obj = {};
      obj.key = item.realname;
      obj.value = item.staff_sn;
      return obj;
    });
    return selectedStaff;
  }

  toChoose = (field = {}, data = {}) => {
    const { key, value } = data;
    const { type, id } = field;
    const isMuti = field.is_checkbox;
    const { dispatch, history, evtClick, selComponentCb } = this.props;
    const newKey = `${type}_${key}_${id}`;
    const curDispath = dispatchColumn[type];
    const { modal, reduce, to } = curDispath;
    const originKey = curDispath.key;
    const originValue = curDispath.value;
    evtClick();
    dispatch({
      type: `${modal}/${reduce}`,
      payload: {
        key: newKey,
        value: value || [],
      },
    });
    dispatch({
      type: `${modal}/saveCback`,
      payload: {
        key: newKey,
        cb: (source) => {
          const obj = {};
          obj[originKey] = 'key';
          obj[originValue] = 'value';
          const newSource = makeFieldValue(source, obj, true, false);
          selComponentCb(data, newSource);
        },
      },
    });
    history.push(`/${to}/${newKey}/${isMuti}/${id}`);
  }

  renderCurrent = (data, name) => {
    let newData = null;
    if (typeof data === 'object' && data) {
      newData = data;
    } else {
      newData = isJSON(newData);
    }
    return (newData || []).map(item => (item[name] ? `${item[name]}、` : ''));
  }

  render() {
    const { data, field, isEdit, defaultValue } = this.props;
    const { value } = data || {};
    const { type } = field;
    const curDispath = dispatchColumn[type];
    const { name } = curDispath;
    if (isEdit) {
      return (
        <List.Item
          arrow="horizontal"
          extra={this.renderCurrent(value, name)}
          onClick={() => this.toChoose(field, data)}
        >
          {field.name}
        </List.Item>
      );
    }
    return (
      <TextareaItem
        title={field.name}
        autoHeight
        editable={false}
        value={this.renderCurrent(defaultValue || [], name).join('')}
      />
    );
  }
}
SelectComp.defaultProps = {
  isEdit: true,
};

export default connect()(SelectComp);
