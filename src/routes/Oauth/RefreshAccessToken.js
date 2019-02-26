import React, { Component } from 'react';
import { connect } from 'dva';
import { setNavTitle } from '../../utils/util';

class RefreshAccessToken extends Component {
  componentDidMount() {
    setNavTitle('登陆中...');
    this.props.dispatch({
      type: 'oauth/refreshAccessToken',
    });
  }

  componentWillUpdate(nextProps) {
    const { accessToken } = nextProps;
    if (accessToken && accessToken.length > 0) {
      window.location.href = '/';
    }
  }

  render() {
    return (
      <h1 style={{ textAlign: 'center' }}>登录中。。。</h1>
    );
  }
}

export default connect(({ oauth }) => ({
  accessToken: oauth.accessToken,
}))(RefreshAccessToken);
