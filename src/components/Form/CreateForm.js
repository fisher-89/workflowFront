import React, { Component } from 'react';
import {
  List, InputItem, Toast, DatePicker, ImagePicker, Modal,
  Carousel, TextareaItem, Picker,
} from 'antd-mobile';
import { connect } from 'dva';
import moment from 'moment';
import {
  dealThumbImg,
  reAgainImg,
  rebackImg,
} from '../../utils/convert';

import { formatDate, isJSON } from '../../utils/util';
import style from './index.less';
import CheckBoxs from '../../components/ModalFilters/CheckBox';

class CreateForm extends Component {
  state = {
    init: false,
    preview: false,
    reviewImg: [],
    editableForm: [], // 可编辑表单
    showForm: [], // 显示的表单
    // required_form: [], // 必填
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
    const newFormData = nextprops.form_data;
    if (newFormData && (!this.state.init)) {
      const tempFormdata = [...formdata];
      if (tempFormdata && !tempFormdata.length) {
        editableForm.map((item) => {
          const formatStr = formatDate(item.type);
          // let currentValue = newFormData[item.key];
          const currentValue = isJSON(newFormData[item.key]);
          let value = currentValue;
          // if (item.type === 'array') {
          //   const reg = /^\[|\]$/g;
          //   if (typeof (currentValue) === 'string') {
          //     const str = currentValue.replace(reg, '');
          //     currentValue = str.split(',');
          //   }
          //   value = currentValue;
          // }
          if (item.type === 'time') {
            value = moment(`2018/1/1 ${currentValue}`).format(formatStr);
          }
          if (item.type === 'date' || item.type === 'datetime') {
            if (currentValue) {
              value = moment(currentValue).format(formatStr);
            } else {
              value = moment().format(formatStr);
            }
          }
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
        showForm,
        newFormData,
        formdata: tempFormdata,
        ...obj,
      });
    }
  }

  onHandleToFixed = (value, floatNumber) => {
    const a = value;
    const b = Number(a);
    let newValue = b;
    if (floatNumber) {
      const c = b.toFixed(floatNumber);
      newValue = Number(c);
    }
    return newValue;
  }

  onChange = (v, item) => {
    const { max, min } = item;
    const obj = this.initCurrentObj(v, item);
    // 验证正则
    if (item.type === 'int') {
      // let newValue = v;
      let newValue = this.onHandleToFixed(v, item.scale);
      if (min !== '' && parseFloat(newValue) < min) {
        newValue = min;
      }
      if (max !== '' && parseFloat(newValue) > max) {
        newValue = max;
      }
      obj.value = Number(newValue);
    }
    if (item.type === 'text') {
      if (min !== '' && v.length < min) {
        obj.msg = `字符长度在${min || '0'}~${max}之间`;
      }
      if (max !== '' && v.length > max) {
        let newValue = v;
        newValue = newValue.length > max ? newValue.slice(0, max) : newValue;
        obj.value = newValue;
      }
    }
    this.bindFormDataChange(obj, item);
  }

  onhandleSingleChange = (v, item) => {
    const obj = this.initCurrentObj(v, item);
    this.bindFormDataChange(obj, item);
  }

  onErrorClick = (item) => {
    const {
      formdata,
    } = this.state;
    const [itemkey] = formdata.filter(its => item.key === its.key);
    if (itemkey.hasError) {
      Toast.info(itemkey.msg);
    }
  }

  getGridList = () => {
    const { showGrid } = this.state;
    showGrid.map((item) => {
      return (
        <List
          renderHeader={() => item.name}
          key={item.key}
        >
          {this.getGridListField(item)}
        </List>
      );
    });
  }
  // 生成表单
  getFormList = () => {
    const {
      editableForm,
      formdata,
      showForm,
      newFormData,
    } = this.state;
    const editKey = editableForm.map((item) => {
      return item.key;
    });
    return showForm.map((item, idx) => {
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
      const isEdit = editKey.indexOf(item.key) > -1;
      if (!isEdit) { // 只读
        if (item.type === 'staff') {
          const { value } = itemkey;
          return (
            <List.Item
              extra={this.renderCurrent(value, 'realname')}
            >
              {item.name}
            </List.Item>
          );
        } else if (item.type === 'file') { // 文件
          return (
            <React.Fragment key={i}>
              <div className={style.file}>
                <p className={[style.title, style.readonly].join(' ')}>{item.name}</p>
                <div className={style.array_container}>
                  <div className={style.show_img}>
                    {(newFormData[item.key] || []).map((its, ix) => {
                      const x = item.key + ix;
                      return (
                        <img
                          src={`${its}`}
                          key={x}
                          alt="图片"
                          onClick={() => this.reviewReadImg(x, newFormData[item.key])}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </React.Fragment>

          );
        } else if (item.type === 'array') { // 数组
          let currentValue = newFormData[item.key];
          const reg = /^\[|\]$/g;
          if (typeof (currentValue) === 'string') {
            const str = currentValue.replace(reg, '');
            currentValue = str.split(',');
          }
          const options = (item.options || []).map((its) => {
            const obj = {};
            obj.label = its;
            obj.value = its;
            return obj;
          });
          return (
            <React.Fragment key={i} >
              <div className={style.file}>
                <p className={[style.title, style.readonly].join(' ')}>{item.name}</p>
                <div className={style.array_container}>
                  <CheckBoxs
                    style={{ marginBottom: '10px' }}
                    options={options}
                    value={currentValue}
                    readonly
                  />
                </div>
              </div>
            </React.Fragment>
          );
        }
        return (
          <div className={style.readonly}>
            <TextareaItem
              title={item.name}
              autoHeight
              editable={false}
              value={newFormData && newFormData[item.key] ? newFormData[item.key] : '暂无'}
            />
          </div>
        );
      }
      // 可改
      if (isEdit) {
        if (item.type === 'department') {
          const { value } = itemkey;
          return (
            <List.Item
              arrow="horizontal"
              extra={this.renderCurrent(value, 'name')}
              onClick={() => this.choseDepartment(item, itemkey)}
            >
              {item.name}
            </List.Item>
          );
        }
        if (item.type === 'staff') {
          const { value } = itemkey;
          return (
            <List.Item
              arrow="horizontal"
              extra={this.renderCurrent(value, 'realname')}
              onClick={() => this.chosePerson(item, itemkey)}
            >
              {item.name}
            </List.Item>
          );
        } else if (item.options && item.options.length) { // 有options，说明是复选框或者单选框
          if (item.type === 'array') {
            let currentValue = itemkey.value;
            const reg = /^\[|\]$/g;
            if (typeof (currentValue) === 'string') {
              const str = currentValue.replace(reg, '');
              currentValue = str.split(',');
            }
            const options = (item.options || []).map((its) => {
              const obj = {};
              obj.label = its;
              obj.value = its;
              return obj;
            });
            return (
              <React.Fragment key={i}>
                <div className={style.file}>
                  <p className={style.title}>{item.name}</p>
                  <div className={style.array_container}>
                    <CheckBoxs
                      style={{ marginBottom: '10px' }}
                      options={options}
                      value={currentValue}
                      onChange={v => this.onChange(v, item)}
                    />
                  </div>
                </div>
              </React.Fragment>
            );
          } else {
            const data = item.options.map((its) => {
              const obj = {};
              obj.label = its;
              obj.value = its;
              return obj;
            });
            return (
              <React.Fragment key={i}>
                <Picker
                  data={data}
                  cols={1}
                  value={[itemkey.value]}
                  onChange={e => this.onhandleSingleChange(e[0], item)}
                >
                  <List.Item arrow="horizontal" onClick={this.onClick}>{item.name}</List.Item>
                </Picker>
              </React.Fragment>
            );
          }
        } else if (item.type === 'text') {
          if (item.max > 10) {
            return (
              <React.Fragment key={i}>
                <TextareaItem
                  title={item.name}
                  autoHeight
                  placeholder={item.description}
                  error={itemkey.hasError}
                  onErrorClick={() => this.onErrorClick(item)}
                  onChange={e => this.onChange(e, item)}
                  value={itemkey.value}
                />
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment key={i}>
                <InputItem
                  placeholder={item.description}
                  error={itemkey.hasError}
                  onErrorClick={() => this.onErrorClick(item)}
                  onChange={e => this.onChange(e, item)}
                  value={itemkey.value}
                >{item.name}
                </InputItem>
              </React.Fragment>
            );
          }
        } else if (item.type === 'int') {
          return (
            <React.Fragment key={i}>
              <InputItem
                placeholder={item.description}
                error={itemkey.hasError}
                type="number"
                onErrorClick={() => this.onErrorClick(item)}
                onChange={e => this.onChange(e, item)}
                value={itemkey.value}
              >{item.name}
              </InputItem>
            </React.Fragment>
          );
        } else if (item.type === 'date' || item.type === 'time' || item.type === 'datetime') {
          return (
            <React.Fragment>
              <DatePicker
                key={i}
                mode={item.type}
                onChange={e => this.timeChange(e, item)}
                value={item.type === 'time' ? new Date(`2018/8/1 ${itemkey.value}`) : new Date(itemkey.value)}
              >
                <List.Item arrow="horizontal">{item.name}</List.Item>
              </DatePicker>
            </React.Fragment>
          );
        } else if (item.type === 'file') {
          return (
            <React.Fragment key={i}>
              <div className={style.file}>
                <p className={style.title}>{item.name}</p>
                <div className={style.picker_container}>
                  <ImagePicker
                    files={itemValue}
                    onChange={(file, type, index) => this.filesOnchange(file, type, index, item)}
                    onImageClick={e => this.reviewImg(e, itemValue)}
                    selectable={itemValue ? itemValue.length < 5 : true}
                    accept="image/gif,image/jpeg,image/jpg,image/png"
                  />
                </div>
              </div>
            </React.Fragment>

          );
        } else {
          return <p>其他</p>;
        }
      }
      return item;
    });
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
    });
  }

  timeChange = (v, item) => { // 时间改变事件
    const formatStr = formatDate(item.type);
    const obj = this.initCurrentObj(moment(v).format(formatStr), item);
    this.bindFormDataChange(obj, item);
  }

  // 上传图片
  filesOnchange = (files, type, index, item) => {
    const newFiles = files.map((its) => {
      return rebackImg(its.url, `${UPLOAD_PATH}`, '_thumb');
    });
    const obj = this.initCurrentObj(newFiles, item);
    const { dispatch } = this.props;
    if (type === 'remove') {
      this.bindFormDataChange(obj, item);
    }
    if (type === 'add') {
      // lrz(files[files.length - 1].url, { width: 500 })
      // .then((rst) => {
      // 处理成功会执行
      const imgformData = new FormData();
      imgformData.append('upFile', files[files.length - 1].file);
      dispatch({
        type: 'start/fileUpload',
        payload: {
          data: imgformData,
          cb: (f) => {
            newFiles[newFiles.length - 1] = f.path;
            obj.value = [...newFiles];
            this.bindFormDataChange(obj, item);
          },
        },
      });
    }
  }

  reviewImg = (i, img) => {
    const imgs = img.map((item) => {
      return reAgainImg(item.url, '_thumb');
    });
    const newImgs = imgs.slice(i).concat(imgs.slice(0, i));
    this.setState({
      reviewImg: newImgs,
      preview: true,
    });
  }

  reviewReadImg = (i, img) => {
    const imgs = [...img];
    const newImgs = imgs.slice(i).concat(imgs.slice(0, i));
    this.setState({
      reviewImg: newImgs,
      preview: true,
    });
  }

  hideModal = (e) => {
    e.preventDefault();
    const attr = e.target.getAttribute('data-preview');
    if (attr === 'preview') {
      this.setState({
        preview: false,
      });
    }
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

  chosePerson = (item, current) => {
    const { key, value } = current;
    const { type, id } = item;
    const isMuti = item.is_checkbox;
    const { dispatch, history, evtClick } = this.props;
    const newKey = `${type}_${key}_${id}`;
    evtClick();
    dispatch({
      type: 'formSearchStaff/saveSelectStaff',
      payload: {
        key: newKey,
        value: value || [],
      },
    });
    dispatch({
      type: 'formSearchStaff/saveCback',
      payload: {
        key: newKey,
        cb: data => this.selComponentCb(item, data),
      },
    });
    history.push(`/form_sel_person/${newKey}/${isMuti}/${id}`);
  }

  choseDepartment = (item, current) => {
    const { key, value } = current;
    const { type, id } = item;
    const isMuti = item.is_checkbox;
    const { dispatch, history, evtClick } = this.props;
    const newKey = `${type}_${key}_${id}`;
    evtClick();
    dispatch({
      type: 'formSearchDep/saveSelectDepartment',
      payload: {
        key: newKey,
        value: value || [],
      },
    });
    dispatch({
      type: 'formSearchDep/saveCback',
      payload: {
        key: newKey,
        cb: data => this.selComponentCb(item, data),
      },
    });
    history.push(`/form_sel_department/${newKey}/${isMuti}/${id}`);
  }


  renderCurrent = (persons, name) => {
    return (persons || []).map(item => `${item[name]}、`);
  }

  render() {
    const { startflow } = this.props;
    const { preview, reviewImg } = this.state;
    if (!startflow) return null;
    return (
      <div className={style.form} style={{ background: '#fff' }}>
        <List>
          {this.getFormList()}
        </List>
        <Modal
          visible={preview}
          popup
          maskClosable
          wrapClassName={style.wrap}
          onClose={() => this.setState({ preview: false })}
        >
          <div
            className={style.preview}
            data-preview="preview"
            onClick={this.hideModal}
          >
            <div className={style.caroul}>
              <Carousel
                autoplay={false}
                infinite
              >
                {(reviewImg || []).map((val, i) => {
                  const idx = i;
                  return (
                    <img
                      src={val}
                      key={idx}
                      alt="carousel"
                      style={{ width: '100%', verticalAlign: 'top' }}
                      onLoad={() => {
                        window.dispatchEvent(new Event('resize'));
                      }}
                    />
                  );
                })}
              </Carousel>
            </div>
          </div>

        </Modal>
      </div>
    );
  }
}
export default connect(({
  loading, formSearchStaff,
}) => ({
  loading, selected: formSearchStaff,
}))(CreateForm);
