/* global window */
import React from 'react';
import {
  connect,
} from 'dva';
import QueueAnim from 'rc-queue-anim';
import {
  withRouter,
} from 'dva/router';
import { Loader } from '../components/General/Loader';

import Footer from '../components/Footer/Footer';
import {
  openPages,
} from '../configs/config';

import style from './app.less';

class App extends React.Component {
  componentWillMount() {
    if (localStorage.getItem('OA_access_token') &&
      localStorage.getItem('OA_access_token_expires_in') > new Date().getTime()) {
      this.props.dispatch({
        type: 'common/getUserInfo',
      });
      this.props.dispatch({
        type: 'common/getFlowList',
      });
    } else if (localStorage.getItem('OA_refresh_token')) {
      this.props.dispatch({
        type: 'oauth/refreshAccessToken',
      });
    } else {
      window.location.href =
     `${OA_PATH}/oauth/authorize?client_id=${OA_CLIENT_ID}&response_type=code`;
    }

    document.body.style.margin = '0px';
    // 这是防止页面被拖拽
    document.body.addEventListener('touchmove', (ev) => {
      ev.preventDefault();
    });
    // this.props.dispatch({
    //   type: 'common/getFlowList',
    // });
  }

  // componentWillReceiveProps(props) {
  //   const { location: { pathname }, loading } = props;
  //   if (this.props.location.pathname !== pathname) {
  //     spin(loading);
  //   }
  // }
  render() {
    const {
      children,
      location,
      common,
      // loading,
    } = this.props;
    let {
      pathname,
    } = location;
    // const loadings = loading.global;
    const {
      footStyle,
    } = common;
    pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
    // spin(loadings);
    return (
      <div className={style.container}>
        <div
          className={style.content}
          key={pathname}
        >
          <Loader />
          <QueueAnim
            className={style.demo_content}
            type={['left', 'right']}
          >
            <div
              key={pathname}
              style={{ display: 'flex', flexGrow: 1, flexDirection: 'column' }}
            >
              {children}
            </div>
          </QueueAnim>

        </div>
        {
            openPages && openPages.includes(pathname) ? (
              <div
                className={style.footer}
                style={footStyle}
              >
                <Footer
                  history={this.props.history}
                  pathname={pathname}
                />
              </div>
) : ''
          }
      </div>
    );
  }
}

export default withRouter(connect(({
  common,
  loading,
}) => ({
  common,
  loading,
}))(App));
