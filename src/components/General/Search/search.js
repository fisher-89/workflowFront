import React from 'react';
import { SearchBar } from 'antd-mobile';
import {
  connect,
} from 'dva';
import './index.less';

class Bread extends React.Component {
  render() {
    const { onChange, onCancel, onSubmit, value, showCancelButton, placeholder = '搜索' } = this.props;
    return (
      <SearchBar
        value={value}
        placeholder={placeholder}
        showCancelButton={showCancelButton}
        onChange={onChange}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
    );
  }
}

Bread.propTypes = {};

export default connect()(Bread);
