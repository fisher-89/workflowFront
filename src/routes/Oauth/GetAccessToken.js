import React, {
  Component,
} from 'react';
import {
  connect,
} from 'dva';

class GetAccessToken extends Component {
  componentDidMount() {
    this.getAccessToken();
  }

  // UNSAFE_componentWillUpdate(nextProps) {

  // }
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const {
  //     accessToken
  //   } = nextProps;

  //   if (accessToken && accessToken.length > 0) {
  //     window.location.href = '/home';
  //   }
  // }
  componentWillUpdate(nextProps) {
    const { accessToken } = nextProps;
    if (accessToken && accessToken.length > 0) {
      window.location.href = '/home';
    }
  }
  getAccessToken = () => {
    const {
      location: {
        pathname,
        search,
      },
    } = this.props;
    const authCode = search.match(/code=(\w+)$/)[1];
    const params = {
      redirect_URI: window.location.origin + pathname,
      code: authCode,
    };
    this.props.dispatch({
      type: 'oauth/getAccessTokenByAuthCode',
      payload: params,
    });
  }

  render() {
    return (
      <h1 style={{ textAlign: 'center' }}>登录中。。。</h1>
    );
  }
}

export default connect(({
  oauth,
}) => ({
  accessToken: oauth.accessToken,
}))(GetAccessToken);
