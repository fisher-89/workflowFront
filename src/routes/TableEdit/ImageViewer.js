import React from 'react';
import ImageViewer from 'react-wx-images-viewer';
import { getUrlParams, setNavTitle } from '../../utils/util';

export default class ImagesViewer extends React.Component {
  state={
    reviewImg: [],
  }
  componentWillMount() {
    const urlParams = getUrlParams();
    const { params } = urlParams;
    const { reviewImg, curIndex } = JSON.parse(params);
    setNavTitle('图片预览');
    this.setState({
      reviewImg,
      curIndex,
    });
  }
  onClose = () => {
    this.props.history.goBack(-1);
  }
  render() {
    const { reviewImg, curIndex } = this.state;
    return (
      <ImageViewer
        urls={reviewImg}
        index={curIndex}
        onClose={this.onClose}
      />
    );
  }
}
