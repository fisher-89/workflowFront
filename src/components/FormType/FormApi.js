import React from 'react';
import { List, TextareaItem } from 'antd-mobile';
import { connect } from 'dva';
import { isJSON } from '../../utils/util';
import style from './index.less';

const dispatchColumn = {

  api: {
    modal: 'formSearchApi',
    reduce: 'saveSelectData',
    to: 'form_api_datasource',
    name: 'text',
    value: 'value',
    text: 'text',
  },
};

@connect(({ api }) => ({
  dataSource: api.sourceDetails,
}))


export default class SelectComp extends React.Component {
  componentWillMount() {
    const { dispatch, field } = this.props;
    this.id = field.field_api_configuration_id;
    dispatch({
      type: 'api/fetchApi',
      payload: {
        id: this.id,
      },
    });
  }
  toChoose = (field = {}, data = {}) => {
    const { key, value } = data;
    const { type, id, max, min } = field;
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
        value: value || (isMuti ? [] : {}),
      },
    });
    dispatch({
      type: `${modal}/saveCback`,
      payload: {
        key: newKey,
        cb: (source) => {
          console.log('source', source);
          const newSource = isMuti ? source.map(item => item.value) : source.value;
          console.log('newSource', newSource);

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
      fetchId: field.field_api_configuration_id,
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
      const names = (newData || []).map(item => `${item[name]}`);
      return names.join('、');
      // return names;
    } else {
      ([newData = {}] = data);
      return (newData[name] ? [newData[name]] : []).join('、');
    }
  }

  render() {
    const { data, field, isEdit, defaultValue, dataSource } = this.props;
    const { value } = data || {};
    const isMuti = field.is_checkbox;
    const curData = dataSource[this.id] || [];
    let readValue;
    let editValue;
    let newValue;
    let newData;
    if (isMuti) {
      readValue = (defaultValue || []).map(item => `${item}`);
      editValue = (value || []).map(item => `${item}`);
      newValue = curData.filter(item => readValue.indexOf(`${item.value}`) > -1);
      newData = curData.filter(item => editValue.indexOf(`${item.value}`) > -1);
    } else {
      readValue = `${defaultValue}`;
      editValue = `${value}`;
      newValue = curData.filter(item => `${readValue}` === `${item.value}`);
      newData = curData.filter(item => `${editValue}` === `${item.value}`);
    }

    if (isEdit) {
      return (
        <List.Item
          arrow="horizontal"
          extra={this.renderCurrent(newData, 'text', isMuti)}
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
          value={this.renderCurrent(newValue || [], 'text', isMuti)}
        />
      </div>
    );
  }
}
SelectComp.defaultProps = {
  isEdit: true,
};

