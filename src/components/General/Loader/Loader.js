import React from 'react';
// import PropTypes from 'prop-types';
// import classNames from 'classnames';
import './Loader.less';

export default class Loader extends React.PureComponent {
  render() {
    // const { spinning, fullScreen } = this.props;
    return (
      <div
        id="global_loading"
        className="loader fullScreen hidden"
      >
        <div className="warpper">
          <div className="inner" />
          <div className="text" >加载中</div>
        </div>
      </div>
    );
  }
}
