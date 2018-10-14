import React from 'react';
// import classNames from 'classnames';
import ImageViewer from 'react-wx-images-viewer';
import { connect } from 'dva';
import { ImagePicker } from 'antd-mobile';
import { rebackImg, reAgainImg, dealThumbImg } from '../../utils/convert';
import style from './index.less';

@connect()
export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      reviewImg: '',
      preview: false,
      imgs: data || [],
    };
  }

  componentWillReceiveProps(props) {
    const { data } = props;
    if (JSON.stringify(data) !== JSON.stringify(this.props.data)) {
      this.setState({
        imgs: data,
      });
    }
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

  reviewImg = (i) => {
    const { history, evtClick } = this.props;
    const { imgs } = this.state;
    const bigImgs = imgs.map((item) => {
      return reAgainImg(item.url, '_thumb');
    });
    this.setState({
      reviewImg: newImgs,
      preview: true,
    });
    const params = {
      reviewImg: bigImgs,
      curIndex: i,
    };
    const urlparams = JSON.stringify(params);
    evtClick();
    history.push(`/imageview?params=${urlparams}`);
  }

  hideModal = () => {
    // e.preventDefault();
    // const attr = e.target.getAttribute('data-preview');
    // if (attr === 'preview') {
    this.setState({
      preview: false,
    });
    // }
  }

  filesOnchange = (files, type) => {
    const { onChange, field: { id } } = this.props;
    const newFiles = files.map((its) => {
      return rebackImg(its.url, `${UPLOAD_PATH}`, '_thumb');
    });
    // const obj = this.initCurrentObj(newFiles, item);
    const { dispatch } = this.props;
    if (type === 'remove') {
      // onChange(obj, item);
      onChange(newFiles);
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
            const { imgs } = this.state;
            const newImgs = [...imgs, { url: `${UPLOAD_PATH}${dealThumbImg(f.path, '_thumb')}` }];
            this.setState({
              imgs: newImgs,
            }, () => {
              const newFile = newImgs.map((its) => {
                return rebackImg(its.url, `${UPLOAD_PATH}`, '_thumb');
              });
              onChange(newFile);
            });
            // obj.value = [...newFiles];
          },
        },
      });
    }
  }

uploadFile = () => {
  dispatch({
    type: 'start/fileUpload',
    payload: {
      data: imgformData,
      cb: (f) => {
        newFiles[newFiles.length - 1] = f.path;
        // obj.value = [...newFiles];
        onChange(newFiles);
      },
    },
  });
}

  renderFormDate = () => {
    const { field, isEdit } = this.props;
    const { name, max } = field;
    const { imgs } = this.state;
    return (
      <div className={style.file} >
        <p className={style.title}>{name}</p>
        <div className={[style.picker_container, !isEdit ? style.disabled : null].join(' ')}>
          <ImagePicker
            multiple
            files={imgs}
            {...(isEdit &&
              { onChange: (file, type) => this.filesOnchange(file, type) })}
            onImageClick={this.reviewImg}
            selectable={isEdit && imgs ? imgs.length < (max || 10) : false}
            accept="image/gif,image/jpeg,image/jpg,image/png"
          />
        </div>
      </div>
    );
  }


  render() {
    const { preview, reviewImg } = this.state;
    // <Modal
    //       visible={preview}
    //       popup
    //       maskClosable
    //       wrapClassName={style.wrap}
    //       onClose={() => this.setState({ preview: false })}
    //     >
    //       <div
    //         className={style.preview}
    //         data-preview="preview"
    //         onClick={this.hideModal}
    //       >
    //         <div className={style.caroul}>
    //           <Carousel
    //             autoplay={false}
    //             infinite
    //           >
    //             {(reviewImg || []).map((val, i) => {
    //               const idx = i;
    //               return (
    //                 <img
    //                   src={val}
    //                   key={idx}
    //                   alt="carousel"
    //                   style={{ width: '100%', verticalAlign: 'top' }}
    //                   onLoad={() => {
    //                     window.dispatchEvent(new Event('resize'));
    //                   }}
    //                 />
    //               );
    //             })}
    //           </Carousel>
    //         </div>
    //       </div>

    //     </Modal>
    return (
      <div>
        {this.renderFormDate()}

        {preview && (
        <ImageViewer
          onClose={this.hideModal}
          urls={reviewImg}
          index={1}
        />
        )}

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

