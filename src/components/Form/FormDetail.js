import React, {
  Component,
} from 'react';
import {
  List,
  WingBlank,
  Modal,
  Carousel,
} from 'antd-mobile';
import {
  connect,
} from 'dva';
import style from './index.less';
import {
  CheckBoxs,
} from '../../components/index';
import { dealThumbImg } from '../../utils/convert';

class FormDetail extends Component {
  state = {
    preview: false,
    reviewImg: [],
    showGrid: [], // 显示的列表控件
  }
  componentDidMount() {
    // this.props.onRef(this)
  }


  // 生成表单
  getFormList = () => {
    // const {
    //   show_form,
    //   form_data,
    // } = this.props;
    const showForm = this.props.show_form;
    const formData = this.props.form_data;
    return showForm.map((item, i) => {
      const idx = i;
      if (item.type === 'file') { // 文件
        return (
          <WingBlank key={idx}>
            <p className={style.title}>{item.name}</p>
            <div className={style.show_img}>
              {(formData[item.key] || []).map((its, x) => {
                const ix = x;
              return (
                <img
                  src={`http://192.168.20.16:8009${dealThumbImg(its, '_thumb')}`}
                  key={ix}
                  alt="图片"
                  onClick={() => this.reviewImg(ix, formData[item.key])}
                />);
})}
            </div>
          </WingBlank>
        );
      } else if (item.type === 'array') { // 数组
        return (
          <WingBlank key={idx}>
            <p className={style.title}>{item.name}</p>
            <CheckBoxs
              option={item.options}
              value={formData[item.key]}
              readonly
            />
          </WingBlank>
        );
      } else if (item.options && item.options.length) { // 单选但是是id，需找出id对应的值
        return (
          <List.Item
            key={idx}
            extra={formData && formData[item.key] && (item.options || []).find(its => its.value === formData[item.key]) ? (item.options || []).find(its => its.value === formData[item.key]).name : '暂无'}
            size="small"
          >
            {item.name}{formData[item.key]}
          </List.Item>
        );
      }
      return (
        <List.Item
          key={idx}
          extra={formData && formData[item.key] ? formData[item.key] : '暂无'}
          size="small"
        >
          {item.name}
        </List.Item>);
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
      return `http://192.168.20.16:8009${item}`;
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
      <div>
        <List renderHeader={() => '基本信息'}>
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
