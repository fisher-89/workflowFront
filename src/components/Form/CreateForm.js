import React, { Component } from 'react';
import {
  List, InputItem, Toast, DatePicker, ImagePicker, Modal, Grid,
  Carousel, TextareaItem, Picker, WhiteSpace,
} from 'antd-mobile';
import { connect } from 'dva';
import moment from 'moment';
import {
  dealThumbImg,
  reAgainImg,
  rebackImg,
} from '../../utils/convert';
import style from './index.less';
import { CheckBoxs } from '../../components/index';

class CreateForm extends Component {
  state = {
    init: false,
    refresh: [], // 用于更新state
    tmpItem: null, // 弹出modal临时保存的item
    choseItem: [],
    visible: false,
    preview: false,
    reviewImg: [],
    files: [],
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
    const {
      formdata,
      // show_form,
      // editable_form,
      // form_data,
    } = nextprops;
    const showForm = nextprops.show_form;
    const editableForm = nextprops.editable_form;
    const newFormData = nextprops.form_data;
    if (newFormData && (!this.state.init)) {
      const tempFormdata = [...formdata];
      if (tempFormdata && !tempFormdata.length) {
        editableForm.map((item) => {
          const formatStr = item.type === 'date' ? 'YYYY-MM-DD' : item.type === 'time' ? 'HH:MM:ss' : item.type === 'datetime' ? 'YYYY-MM-DD HH:MM:ss' : '';
          const value = newFormData[item.key] ? newFormData[item.key]
            : item.type === 'date' || item.type === 'time' || item.type === 'datetime' ? moment(new Date()).format(formatStr)
              : newFormData[item.key];
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
    if (floatNumber !== undefined) {
      const c = b.toFixed(floatNumber);
      if (Math.floor(c) === Number(c)) {
        newValue = Number(c);
      }
    }
    return newValue;
  }
  onChange = (v, item) => {
    const {
      formdata,
    } = this.state;
    const { key, max, min } = item;
    const obj = {
      key,
      value: v,
      hasError: false,
      msg: '',
    };
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

  onhandleSingleChange = (v, item) => {
    const {
      formdata,
    } = this.state;
    const { key } = item;
    const obj = {
      key,
      value: v,
      hasError: false,
      msg: '',
    };
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

  onErrorClick = (item) => {
    const {
      formdata,
    } = this.state;
    const itemkey = formdata.find(its => item.key === its.key);
    if (itemkey.hasError) {
      Toast.info(itemkey.msg);
    }
  }
  getChoseItem = (el) => { // 单选选择之后
    const {
      tmpItem,
      formdata,
    } = this.state;
    const { key } = tmpItem;
    const obj = {
      key,
      value: el.text,
      hasError: false,
      msg: '',
    };
    const data = formdata.map((its) => {
      if (its.key === tmpItem.key) {
        return obj;
      } else {
        return its;
      }
    });
    this.setState({
      visible: false,
      formdata: data,
      [key]: {
        ...obj,
      },
    });
  }
  getGridList = () => {
    const {
      showGrid,
    } = this.state;
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
        // itemkey.value = [...imgs]
      }
      const isEdit = editKey.indexOf(item.key) > -1;
      if (!isEdit) { // 只读
        if (item.type === 'file') { // 文件
          return (
            <React.Fragment>
              <WhiteSpace />
              <div key={i} className={style.file}>
                <p className={style.title}>{item.name}</p>
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
          return (
            <React.Fragment>
              <WhiteSpace />
              <div key={i} className={style.file}>
                <p className={style.title}>{item.name}</p>
                <div className={style.array_container}>
                  <CheckBoxs
                    option={item.options}
                    value={newFormData[item.key]}
                    readonly
                  />
                </div>
              </div>
            </React.Fragment>

          );
          // } else if (item.options && item.options.length) { // 单选但是是id，需找出id对应的值
          //   return (
          //     <List.Item
          //       key={i}
          //       extra={newFormData && newFormData[item.key] ? newFormData[item.key] : '暂无'}
          //       size="small"
          //     >
          //       {item.name}{newFormData[item.key]}
          //     </List.Item>
          //   );
          // }
        }
        return (
          <React.Fragment key={i}>
            <WhiteSpace />
            <List.Item
              extra={<span style={{ color: '#ccc' }}>{newFormData && newFormData[item.key] ? newFormData[item.key] : '暂无'}</span>}
              size="small"
            >
              {item.name}
            </List.Item>
          </React.Fragment>
        );
      }
      // 可改
      if (isEdit) {
        if (item.options && item.options.length) { // 有options，说明是复选框或者单选框
          if (item.type === 'array') {
            return (
              <React.Fragment>
                <WhiteSpace />
                <div key={i} className={style.file}>
                  <p className={style.title}>{item.name}</p>
                  <div className={style.array_container}>
                    <CheckBoxs
                      option={item.options}
                      nameKey={item.key}
                      checkStatus={this.checkStatus}
                      value={itemkey && itemkey.value}
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
              // <List.Item
              //   key={i}
              //   arrow="horizontal"
              //   extra={itemkey && itemkey.value ? itemkey.value : '请选择'}
              //   onClick={() => this.choseItem(item)}
              // >{item.name}
              // </List.Item>
              <React.Fragment>
                <WhiteSpace />
                <Picker
                  key={i}
                  data={data}
                  cols={1}
                  value={[itemkey.value]}
                // onChange={e => this.onChange(e[0], item)}
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
              <React.Fragment>
                <WhiteSpace />
                <TextareaItem
                  key={i}
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
              <React.Fragment>
                <WhiteSpace />
                <InputItem
                  key={i}
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
            <React.Fragment>
              <WhiteSpace />
              <InputItem
                key={i}
                placeholder={item.description}
                error={itemkey.hasError}
                type="digit"
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
              <WhiteSpace />
              <DatePicker
                key={i}
              // format={item.type}
                mode={item.type}
                onChange={e => this.timeChange(e, item)}
                value={new Date(itemkey.value)}
              >
                <List.Item arrow="horizontal">{item.name}</List.Item>
              </DatePicker>
            </React.Fragment>
          );
        } else if (item.type === 'file') {
          return (
            <React.Fragment>
              <WhiteSpace />
              <div key={i} className={style.file}>
                <p className={style.title}>{item.name}</p>
                <div className={style.picker_container}>
                  <ImagePicker
                  // key={item.key}
                  // style={{ width: '78px', height: '78px' }}
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
        }
      }
      return item;
    });
  }
  timeChange = (v, item) => { // 时间改变事件
    const formatStr = item.type === 'date' ? 'YYYY-MM-DD' : item.type === 'time' ? 'HH:MM:ss' : item.type === 'datetime' ? 'YYYY-MM-DD HH:MM:ss' : '';
    const {
      formdata,
    } = this.state;
    const { key } = item;
    const obj = {
      key,
      value: moment(v).format(formatStr),
      hasError: false,
      msg: '',
    };
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
  choseItem = (item) => { // 弹出单选
    const option = item.options;
    const choseItem = option.map((its) => {
      const obj = {
        ...item,
        text: its,
        icon: 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png',
      };
      return obj;
    });
    this.setState({
      visible: true,
      choseItem,
      tmpItem: item,
    });
  }

  saveData = () => {
    const {
      evtClick,
    } = this.props;
    const {
      formdata,
    } = this.state;
    evtClick(formdata);
  }
  submitTable = () => {

  }

  // 上传图片
  filesOnchange = (files, type, index, item) => {
    const {
      formdata,
    } = this.state;
    const { key } = item;
    const newFiles = files.map((its) => {
      return rebackImg(its.url, `${UPLOAD_PATH}`, '_thumb');
    });
    const obj = {
      key,
      hasError: false,
      msg: '',
      value: [...newFiles],
    };
    const {
      dispatch,
    } = this.props;
    if (type === 'remove') {
      const data = formdata.map((its) => {
        if (its.key === item.key) {
          return obj;
        } else {
          return its;
        }
      });
      this.setState({
        files: [...newFiles],
        formdata: [...data],
        [key]: {
          ...obj,
        },
      });
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
            const data = formdata.map((its) => {
              if (its.key === item.key) {
                return obj;
              } else {
                return its;
              }
            });
            this.setState({
              files: [...newFiles],
              formdata: [...data],
              [key]: {
                ...obj,
              },
            });
          },
        },
      });
    }
  }
  // }
  checkStatus = (i, value, key) => {
    const keyItem = this.state[key].value;
    const {
      formdata,
    } = this.state;
    let newStatus = [];
    if (keyItem.includes(value)) {
      newStatus = keyItem.filter(item => value !== item);
    } else { // 没被选中,剔除
      newStatus = [...keyItem];
      newStatus.push(value);
    }
    const obj = {
      key,
      value: newStatus,
      hasError: false,
      msg: '',
    };
    const data = formdata.map((its) => {
      if (its.key === key) {
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
      refresh: [...newStatus],
    });
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
  render() {
    const {
      startflow,
    } = this.props;
    const {
      choseItem,
      visible,
      preview,
      reviewImg,
    } = this.state;
    if (!startflow) return null;
    return (
      <div style={{ background: '#fff' }}>
        <List>
          {this.getFormList()}
        </List>
        <Modal
          popup
          visible={visible}
          onClose={() => this.setState({ visible: false })}
          animationType="slide-up"
        >
          <Grid
            data={choseItem}
            hasLine={false}
            onClick={this.getChoseItem}
          />
        </Modal>

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
  loading,
}) => ({
  loading,
}))(CreateForm);
