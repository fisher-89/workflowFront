import React from 'react';
import { connect } from 'dva';

import {
  OA_PATH,
  OA_CLIENT_ID,
} from '../../utils/util';

class Entrance extends React.Component {
  componentDidMount() {
    if (localStorage.getItem('OA_access_token') &&
      localStorage.getItem('OA_access_token_expires_in') > new Date().getTime()) {
      window.location.href = '/home';
    } else {
      window.location.href = `${OA_PATH()}/oauth/authorize?client_id=${OA_CLIENT_ID()}&response_type=code`;
    }
  }
  render() {
    return (
      <h1 style={{ textAlign: 'center' }}>登录中。。。</h1>
    );
  }
}

Entrance.propTypes = {};

export default connect(({ common }) => ({ common }))(Entrance);
