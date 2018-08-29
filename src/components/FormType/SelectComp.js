import React from 'react';
import { List, TextareaItem } from 'antd-mobile';
import { connect } from 'dva';
import './index.less';

const dispatchColumn = {
  staff: {
    modal: 'formSearchStaff',
    reduce: 'saveSelectStaff',
    to: 'form_sel_person',
    name: 'staff_name',
  },
  department: {
    modal: 'formSearchDep',
    reduce: 'saveSelectDepartment',
    to: 'form_sel_department',
    name: 'name',
  },
};

class SelectComp extends React.Component {
  toChoose = (field = {}, data = {}) => {
    const { key, value } = data;
    const { type, id } = field;
    const isMuti = field.is_checkbox;
    const { dispatch, history, evtClick, selComponentCb } = this.props;
    const newKey = `${type}_${key}_${id}`;
    const curDispath = dispatchColumn[type];
    const { modal, reduce, to } = curDispath;
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
        cb: source => selComponentCb(data, source),
      },
    });
    history.push(`/${to}/${newKey}/${isMuti}/${id}`);
  }

  renderCurrent = (data, name) => {
    return (data || []).map(item => `${item[name]}、`);
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
        title={item.name}
        autoHeight
        editable={false}
        value={this.renderCurrent(defaultValue || [], name)}
      />
    );
  }
}
SelectComp.defaultProps = {
  isEdit: true,
};

export default connect()(SelectComp);
