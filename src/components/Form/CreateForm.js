import React, { Component } from 'react';
import { List, Toast } from 'antd-mobile';
import { connect } from 'dva';
import { SelectComp, SelectCheckbox, TextInput, FormDate, Upload, Region, FormArray } from '../FormType';
import {
  dealThumbImg,
} from '../../utils/convert';
import style from '../FormType/index.less';

class CreateForm extends Component {
  state = {
    init: false,
    editableForm: [], // 可编辑表单
    showForm: [], // 显示的表单
    requiredForm: [], // 必填
    // editable_grid: [], // 可编辑的列表控件
    // show_grid: [], // 显示的列表控件
    // required_grid: [], // 必须,
    formdata: [],
  }
  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillReceiveProps(nextprops) {
    const { formdata } = nextprops;
    const showForm = nextprops.show_form;
    const editableForm = nextprops.editable_form;
    const requiredForm = nextprops.required_form;
    const newFormData = nextprops.form_data;
    if (newFormData && (!this.state.init)) {
      const formData = { ...newFormData };
      const tempFormdata = [...formdata];
      if (tempFormdata && !tempFormdata.length) {
        editableForm.map((item) => {
          // const formatStr = formatDate(item.type);
          const currentValue = newFormData[item.key];
          const value = currentValue;
          // if (item.type === 'array') {
          //   const reg = /^\[|\]$/g;
          //   if (typeof (currentValue) === 'string') {
          //     const str = currentValue.replace(reg, '');
          //     currentValue = str.split(',');
          //   }
          //   value = currentValue;
          // }
          // if (item.type === 'time') {
          //   const nowTime = moment().format(formatStr);
          //   value = moment(`2018-01-01 ${currentValue || nowTime}`).format(formatStr);
          // }
          // if (item.type === 'date' || item.type === 'datetime') {
          //   if (currentValue) {
          //     value = moment(currentValue).format(formatStr);
          //   } else {
          //     value = moment().format(formatStr);
          //   }
          // }
          formData[item.key] = value;
          const obj = {
            key: item.key,
            value,
            hasError: false,
            msg: '',
          };
          tempFormdata.push(obj);
          this.setState({
            [item.key]: {
              ...obj,
            },
          });
          return true;
        });
      }
      const obj = {};
      formdata.forEach((item) => {
        obj[item.key] = { ...item };
      });
      this.setState({
        init: true,
        editableForm,
        requiredForm,
        showForm,
        newFormData: formData,
        formdata: tempFormdata,
        ...obj,
      });
    }
  }

  onChange = (v, item) => {
    const obj = this.initCurrentObj(v, item);
    this.bindFormDataChange(obj, item);
  }

  // onhandleCheckChange = (v, item) => {
  //   const obj = this.initCurrentObj(v, item);
  //   this.bindFormDataChange(obj, item);
  // }

  onErrorClick = (item) => {
    const { formdata } = this.state;
    const [itemkey] = formdata.filter(its => item.key === its.key);
    if (itemkey.hasError) {
      Toast.info(itemkey.msg);
    }
  }

  // 生成表单
  getFormList = () => {
    const { editableForm, requiredForm = [], formdata, showForm, newFormData } = this.state;
    const editKey = editableForm.map((item) => {
      return item.key;
    });
    const requireKey = requiredForm.map(item => item.key);
    return showForm.map((item, idx) => {
      const isEdit = editKey.indexOf(item.key) > -1;
      const isRequire = requireKey.indexOf(item.key) > -1;
      const i = idx;
      const [itemkey] = formdata.filter(its => item.key === its.key);
      let itemValue = [];
      if (itemkey && item.type === 'file') {
        itemValue = (itemkey.value || []).map((its) => {
          return {
            url: `${UPLOAD_PATH}${dealThumbImg(its, '_thumb')}`,
          };
        });
      }
      if (item.type === 'region') {
        return (
          <Region
            key={i}
            field={item}
            isEdit={isEdit}
            defaultValue={newFormData[item.key]}
            data={itemkey || {}}
            onChange={this.onChange}
          />
        );
      }
      if (item.type === 'department' || item.type === 'staff' || item.type === 'shop' || item.type === 'api') {
        const { evtClick, history } = this.props;
        return (
          <SelectComp
            history={history}
            isEdit={isEdit}
            evtClick={evtClick}
            field={item}
            defaultValue={newFormData[item.key]}
            data={itemkey}
            key={i}
            selComponentCb={this.selComponentCb}
          />
        );
      }
      if (item.type === 'array') {
        return (
          <FormArray
            key={i}
            field={item}
            isEdit={isEdit}
            defaultValue={newFormData[item.key]}
            data={itemkey || {}}
            onChange={this.onChange}
          />
        );
      }
      if (item.options && item.options.length) { // 有options，说明是复选框或者单选框
        const options = (item.options || []).map((its) => {
          const obj = {};
          obj.label = `${its}`;
          obj.value = `${its}`;
          return obj;
        });
        return (
          <SelectCheckbox
            key={i}
            field={item}
            isEdit={isEdit}
            defaultValue={newFormData[item.key]}
            data={itemkey || {}}
            options={options}
            onChange={this.onChange}
          />
        );
      } else if (item.type === 'text' || item.type === 'int') {
        return (
          <TextInput
            onChange={this.onChange}
            field={item}
            key={i}
            isEdit={isEdit}
            isRequire={isRequire}
            defaultValue={newFormData[item.key]}
            data={itemkey}
          />
        );
      }

      if (item.type === 'date' || item.type === 'time' || item.type === 'datetime') {
        return (
          <FormDate
            onChange={this.onChange}
            field={item}
            key={i}
            isEdit={isEdit}
            defaultValue={newFormData[item.key]}
            data={itemkey}
          />
        );
      } else if (item.type === 'file') {
        return (
          <Upload
            onChange={this.onChange}
            field={item}
            key={i}
            isEdit={isEdit}
            defaultValue={newFormData[item.key]}
            data={itemValue}
          />
        );
      } else {
        return <p key={i}>其他</p>;
      }
    }
      // return item;
      // }
    );
  }

  initCurrentObj = (v, item) => {
    const { key } = item;
    const obj = {
      key,
      value: v,
      hasError: false,
      msg: '',
    };
    return { ...obj };
  }

  bindFormDataChange = (obj, item) => {
    const { onChange } = this.props;
    const { formdata } = this.state;
    const { key } = item;
    const data = formdata.map((its) => {
      if (its.key === item.key) {
        return obj;
      } else {
        return its;
      }
    });
    this.setState({
      formdata: data,
      [key]: {
        ...obj,
      },
    }, () => onChange(data));
  }

  selComponentCb = (item, data) => {
    const { evtClick } = this.props;
    const obj = this.initCurrentObj(data, item);
    const { key } = item;
    const { formdata } = this.state;
    const datas = formdata.map((its) => {
      if (its.key === key) {
        return obj;
      } else {
        return its;
      }
    });
    evtClick(datas);
  }

  renderCurrent = (persons, name) => {
    return (persons || []).map(item => `${item[name]}、`);
  }

  render() {
    const { startflow } = this.props;
    if (!startflow) return null;
    return (
      <div className={[style.edit_form, style.form].join(' ')} style={{ background: '#fff' }}>
        <List>
          {this.getFormList()}
        </List>

      </div>
    );
  }
}
export default connect(({
  loading, formSearchStaff,
}) => ({
  loading, selected: formSearchStaff,
}))(CreateForm);
