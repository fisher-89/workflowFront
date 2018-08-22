import React, {
  Component,
} from 'react';
import { List, Modal, Carousel } from 'antd-mobile';
import {
  connect,
} from 'dva';
import style from './index.less';
import CheckBoxs from '../../components/ModalFilters/CheckBox';
import { dealThumbImg } from '../../utils/convert';

class FormDetail extends Component {
  state = {
    preview: false,
    reviewImg: [],
    showGrid: [], // 显示的列表控件
  }

  // 生成表单
  getFormList = () => {
    const showForm = this.props.show_form;
    const formData = this.props.form_data;
    return showForm.map((item, i) => {
      const idx = i;
      if (item.type === 'file') { // 文件
        return (
          <React.Fragment>
            <div key={idx} className={style.file}>
              <p className={[style.title, style.readonly].join(' ')}>{item.name}</p>
              <div className={style.array_container}>
                <div className={style.show_img}>
                  {(formData[item.key] || []).map((its, x) => {
              const ix = x;
            return (
              <img
                src={`${UPLOAD_PATH}${dealThumbImg(its, '_thumb')}`}
                key={ix}
                alt="图片"
                onClick={() => this.reviewImg(ix, formData[item.key])}
              />);
        })}
                </div>
              </div>
            </div>
          </React.Fragment>

        );
      } else if (item.type === 'array') { // 数组
        let currentValue = formData[item.key];
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
          <React.Fragment>
            <div key={idx} className={style.file}>
              <p className={[style.title, style.readonly].join(' ')}>{item.name}</p>
              <div className={style.array_container}>
                <CheckBoxs
                  options={options}
                  style={{ marginBottom: '10px' }}
                  value={currentValue}
                  readonly
                />
              </div>
            </div>
          </React.Fragment>

        );
      }
      return (
        <React.Fragment>
          <List.Item
            key={idx}
            extra={<span style={{ color: '#ccc' }}>{formData && formData[item.key] ? formData[item.key] : '暂无'}</span>}
            size="small"
          >
            <span>{item.name}</span>
          </List.Item>
        </React.Fragment>
      );
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

  reviewImg = (i, img) => {
    const imgs = (img || []).map((item) => {
      return `${UPLOAD_PATH}${item}`;
    });
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
      preview,
      reviewImg,
    } = this.state;
    return (
      <div className={style.form}>
        <List >
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
                    key={idx}
                    src={val}
                    alt=""
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
}))(FormDetail);
