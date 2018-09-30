import React from 'react';
import { List, TextareaItem } from 'antd-mobile';
import { connect } from 'dva';
import { isJSON, makeFieldValue } from '../../utils/util';
import style from './index.less';

const dispatchColumn = {
  staff: {
    modal: 'formSearchStaff',
    reduce: 'saveSelectStaff',
    to: 'form_sel_person',
    name: 'text',
    value: 'staff_sn',
    text: 'realname',
  },
  department: {
    modal: 'formSearchDep',
    reduce: 'saveSelectDepartment',
    to: 'form_sel_department',
    name: 'text',
    value: 'id',
    text: 'name',
  },
  shop: {
    modal: 'formSearchShop',
    reduce: 'saveSelectShop',
    to: 'form_sel_shop',
    name: 'text',
    value: 'shop_sn',
    text: 'name',
  },
};

class SelectComp extends React.Component {
  toChoose = (field = {}, data = {}) => {
    const { key, value } = data;
    const { type, id, max, min } = field;
    const isMuti = field.is_checkbox;
    const { dispatch, history, evtClick, selComponentCb } = this.props;
    const newKey = `${type}_${key}_${id}`;
    const curDispath = dispatchColumn[type];
    const { modal, reduce, to } = curDispath;
    const originKey = curDispath.value;
    const originValue = curDispath.text;
    evtClick();
    dispatch({
      type: `${modal}/${reduce}`,
      payload: {
        key: newKey,
        value: value || (isMuti ? [] : {}),
      },
    });
    dispatch({
      type: `${modal}/saveCback`,
      payload: {
        key: newKey,
        cb: (source) => {
          const obj = {};
          obj[originKey] = 'value';
          obj[originValue] = 'text';
          const newSource = makeFieldValue(source, obj, isMuti, false);
          selComponentCb(data, newSource);
        },
      },
    });
    const params = {
      key: newKey,
      type: isMuti,
      id,
      max: max || 50,
      min: min || 1,
    };
    const urlParams = JSON.stringify(params);
    // history.push(`/${to}/${newKey}/${isMuti}/${id}`);
    history.push(`/${to}?params=${urlParams}`);
  }

  renderCurrent = (data, name, isMuti) => {
    let newData = null;
    if (typeof data === 'object' && data) {
      newData = data;
    } else {
      newData = isJSON(newData);
    }
    if (isMuti) {
      return (newData || []).map(item => (item[name] ? `${item[name]}、` : ''));
    } else {
      return newData[name] ? [newData[name]] : [];
    }
  }

  render() {
    const { data, field, isEdit, defaultValue } = this.props;
    const { value } = data || {};
    const { type } = field;
    const isMuti = field.is_checkbox;
    const curDispath = dispatchColumn[type];
    const { name } = curDispath;
    if (isEdit) {
      return (
        <List.Item
          arrow="horizontal"
          extra={this.renderCurrent(value, name, isMuti)}
          onClick={() => this.toChoose(field, data, isMuti)}
        >
          {field.name}
        </List.Item>
      );
    }
    return (
      <div className={style.readonly}>
        <TextareaItem
          title={field.name}
          autoHeight
          editable={false}
          value={this.renderCurrent(defaultValue || [], name, isMuti).join('')}
        />
      </div>
    );
  }
}
SelectComp.defaultProps = {
  isEdit: true,
};

export default connect()(SelectComp);
