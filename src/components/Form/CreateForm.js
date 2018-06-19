import React, {
  Component,
} from 'react';
import {
  List,
  InputItem,
  Toast,
  DatePicker,
  ImagePicker,
  WingBlank,
  Modal,
  Grid,
  Carousel,
} from 'antd-mobile';
import {
  connect,
} from 'dva';
import moment from 'moment';
import {
  dealThumbImg,
  reAgainImg,
  rebackImg,
} from '../../utils/convert';
import style from './index.less';
import {
  CheckBoxs,
} from '../../components/index';

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
          const formatStr = item.type === 'date' ? 'YYYY-MM-DD' : item.type === 'time' ? 'hh:mm' : item.type === 'datetime' ? 'YYYY-MM-DD hh:mm:ss' : '';
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
            [item.key]: { ...obj,
            },
          });
          return true;
        });
      }
      this.setState({
        init: true,
        editableForm,
        showForm,
        newFormData,
        // required_form,
        // editable_grid,
        // show_grid,
        // required_grid,
        formdata: tempFormdata,
      });
    }
  }

  onChange = (v, item) => {
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
    // 验证正则
    if (item.type === 'int') {
      // if (!/^\d+(?=\.{0,1}\d+$|$)/.test(v)) {
      if (!/^(-?\d+)(\.\d+)?$/.test(v)) {
        obj.hasError = true;
        obj.msg = '请输入数字';
      }
    }
    if (item.type === 'text') {
      if (!(v.length > item.min && v.length < item.max)) {
        obj.hasError = true;
        obj.msg = `字符长度在${item.min ? item.min : '0'}~${item.max}之间`;
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
      [key]: { ...obj,
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
      [key]: { ...obj,
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
      const itemkey = formdata.find(its => item.key === its.key);
      let itemValue = [];
      if (itemkey && item.type === 'file') {
        itemValue = (itemkey.value || []).map((its) => {
          return {
            url: `http://192.168.20.16:8009${dealThumbImg(its, '_thumb')}`,
          };
        });
        // itemkey.value = [...imgs]
      }
      const isEdit = editKey.includes(item.key);
      if (!isEdit) { // 只读
        if (item.type === 'file') { // 文件
          return (
            <WingBlank key={i}>
              <p className={style.title}>{item.name}</p>
              <div className={style.show_img}>
                {(newFormData[item.key] || []).map((its, ix) => {
                  const x = ix;
                return (
                  <img
                    src={`http://192.168.20.16:8009${its}`}
                    key={x}
                    alt="图片"
                    onClick={() => this.reviewReadImg(newFormData[item.key])}
                  />
                );
                })}
              </div>
            </WingBlank>
          );
        } else if (item.type === 'array') { // 数组
          return (
            <WingBlank key={i}>
              <p className={style.title}>{item.name}</p>
              <CheckBoxs
                option={item.options}
                value={newFormData[item.key]}
                readonly
              />
            </WingBlank>
          );
        } else if (item.options && item.options.length) { // 单选但是是id，需找出id对应的值
          return (
            <List.Item
              key={i}
              extra={newFormData && newFormData[item.key] ? newFormData[item.key] : '暂无'}
              size="small"
            >
              {item.name}{newFormData[item.key]}
            </List.Item>
          );
        }
        return (
          <List.Item
            key={i}
            extra={newFormData && newFormData[item.key] ? newFormData[item.key] : '暂无'}
            size="small"
          >
            {item.name}
          </List.Item>);
      } // 可改
      if (isEdit) {
        if (item.options && item.options.length) { // 有options，说明是复选框或者单选框
          if (item.type === 'array') {
            return (
              <WingBlank key={i}>
                <p className={style.title}>{item.name}</p>
                <CheckBoxs
                  option={item.options}
                  nameKey={item.key}
                  checkStatus={this.checkStatus}
                  value={itemkey && itemkey.value}
                />
              </WingBlank>
            );
          } else {
            return (
              <List.Item
                key={i}
                arrow="horizontal"
                extra={itemkey && itemkey.value ? itemkey.value : '请选择'}
                onClick={() => this.choseItem(item)}
              >{item.name}
              </List.Item>
            );
          }
        } else if (item.type === 'text' || item.type === 'int') {
          return (
            <InputItem
              key={i}
              placeholder={item.description}
              error={itemkey.hasError}
              onErrorClick={() => this.onErrorClick(item)}
              onChange={e => this.onChange(e, item)}
              value={itemkey.value}
            >{item.name}
            </InputItem>
          );
        } else if (item.type === 'date' || item.type === 'time' || item.type === 'datetime') {
          return (
            <DatePicker
              key={i}
              mode={item.type}
              onChange={e => this.timeChange(e, item)}
              value={new Date(itemkey.value)}
            >
              <List.Item arrow="horizontal">{item.name}</List.Item>
            </DatePicker>
          );
        } else if (item.type === 'file') {
          return (
            <WingBlank key={i}>
              <p className={style.title}>{item.name}</p>
              <div>
                <ImagePicker
                  // key={item.key}
                  files={itemValue}
                  onChange={(file, type, index) => this.filesOnchange(file, type, index, item)}
                  onImageClick={() => this.reviewImg(itemValue)}
                  selectable={itemValue ? itemValue.length < 5 : true}
                  accept="image/gif,image/jpeg,image/jpg,image/png"
                />
              </div>
            </WingBlank>
          );
        }
      }
      return item;
    });
  }
  timeChange = (v, item) => { // 时间改变事件
    const formatStr = item.type === 'date' ? 'YYYY-MM-DD' : item.type === 'time' ? 'hh:mm' : item.type === 'datetime' ? 'YYYY-MM-DD hh:mm:ss' : '';
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
      [key]: { ...obj,
      },
    });
  }
  choseItem = (item) => { // 弹出单选
    const option = item.options;
    const choseItem = option.map((its) => {
      const obj = { ...item,
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
      return rebackImg(its.url, 'http://192.168.20.16:8009', '_thumb');
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
        [key]: { ...obj,
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
            newFiles[newFiles.length - 1] = f;
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
              [key]: { ...obj,
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
      [key]: { ...obj,
      },
      refresh: [...newStatus],
    });
  }
  reviewImg = (img) => {
    const imgs = img.map((item) => {
      return reAgainImg(item.url, '_thumb');
    });
    this.setState({
      reviewImg: imgs,
      preview: true,
    });
  }
  reviewReadImg = (img) => {
    const imgs = (img || []).map((item) => {
      return `http://192.168.20.16:8009${item}`;
    });
    this.setState({
      reviewImg: imgs,
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
      <div>
        <List renderHeader={() => '基本信息'}>
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
