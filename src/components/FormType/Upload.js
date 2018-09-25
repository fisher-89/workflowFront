import React from 'react';
// import classNames from 'classnames';
import { connect } from 'dva';
import { ImagePicker, Modal, Carousel } from 'antd-mobile';
import { rebackImg, reAgainImg } from '../../utils/convert';
import style from './index.less';

@connect()
export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviewImg: '',
      preview: false,
    };
  }

  // initCurrentObj = (v, item) => {
  //   const { key } = item;
  //   const obj = {
  //     key,
  //     value: v,
  //     hasError: false,
  //     msg: '',
  //   };
  //   return { ...obj };
  // }

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

  hideModal = (e) => {
    e.preventDefault();
    const attr = e.target.getAttribute('data-preview');
    if (attr === 'preview') {
      this.setState({
        preview: false,
      });
    }
  }

  filesOnchange = (files, type, index, item) => {
    const { onChange, field: { id } } = this.props;
    const newFiles = files.map((its) => {
      return rebackImg(its.url, `${UPLOAD_PATH}`, '_thumb');
    });
    // const obj = this.initCurrentObj(newFiles, item);
    const { dispatch } = this.props;
    if (type === 'remove') {
      // onChange(obj, item);
      onChange(newFiles, item);
    }
    if (type === 'add') {
      // lrz(files[files.length - 1].url, { width: 500 })
      // .then((rst) => {
      // 处理成功会执行
      const imgformData = new FormData();
      imgformData.append('upFile', files[files.length - 1].file);
      imgformData.append('field_id', id);
      dispatch({
        type: 'start/fileUpload',
        payload: {
          data: imgformData,
          cb: (f) => {
            newFiles[newFiles.length - 1] = f.path;
            // obj.value = [...newFiles];
            onChange(newFiles, item);
          },
        },
      });
    }
  }

  renderFormDate = () => {
    const { data, field, isEdit } = this.props;
    const { name, max } = field;
    return (
      <div className={style.file} >
        <p className={style.title}>{name}</p>
        <div className={style.picker_container}>
          <ImagePicker
            files={data}
            {...(isEdit &&
              { onChange: (file, type, index) => this.filesOnchange(file, type, index, field) })}
            onImageClick={e => this.reviewImg(e, data)}
            selectable={isEdit && data ? data.length < (max || 5) : false}
            accept="image/gif,image/jpeg,image/jpg,image/png"
          />
        </div>
      </div>
    );
  }


  render() {
    const { preview, reviewImg } = this.state;
    return (
      <div>
        {this.renderFormDate()}
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
Upload.defaultProps = {
  isEdit: true,
  data: {
    value: [],
  },
};

