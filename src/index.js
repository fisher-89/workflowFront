import {
  Toast,
} from 'antd-mobile';
import dva from 'dva';
import createLoading from 'dva-loading';
import createHistory from 'history/createBrowserHistory';
import './utils/dingtalk';
import './index.css';

dd.ready(() => {
  dd.ui.webViewBounce.disable();
});
// 1. Initialize
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHistory(),
  onError(error) {
    // request走catch时
    console.log('onerror');
    Toast.fail(error.message);
  },
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/app').default);
// app.model(require('./models/common').default);


// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
