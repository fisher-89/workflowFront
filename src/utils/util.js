import {
  Toast,
} from 'antd-mobile';
import config from '../configs/config';


export function env() {
  const host = window.location.hostname;
  if (host.indexOf(config.develepDomain) >= 0) {
    return 'development';
  } else if (host.indexOf(config.testingDomain) >= 0) {
    return 'testing';
  }
  return 'production';
}

export function log(...m) {
  // 只在开发环境写log
  if (env() === 'development') {
    console.log(...m);
  }
}

export function apiPrefix() {
  const myEnv = env();
  if (myEnv === 'production') {
    return config.apiPrefix.production;
  } else if (myEnv === 'testing') {
    return config.apiPrefix.testing;
  }
  return config.apiPrefix.development;
}

export function OA_PATH() {
  const myEnv = env();
  if (myEnv === 'production') {
    return config.OA_PATH.production;
  } else if (myEnv === 'testing') {
    return config.OA_PATH.testing;
  }
  return config.OA_PATH.development;
}

export function OA_CLIENT_ID() {
  const myEnv = env();
  if (myEnv === 'production') {
    return config.OA_CLIENT_ID.production;
  } else if (myEnv === 'testing') {
    return config.OA_CLIENT_ID.testing;
  }
  return config.OA_CLIENT_ID.development;
}

export function OA_CLIENT_SECRET() {
  const myEnv = env();
  if (myEnv === 'production') {
    return config.OA_CLIENT_SECRET.production;
  } else if (myEnv === 'testing') {
    return config.OA_CLIENT_SECRET.testing;
  }
  return config.OA_CLIENT_SECRET.development;
}

export function domain() {
  const myEnv = env();
  if (myEnv === 'production') {
    return config.domain.production;
  } else if (myEnv === 'testing') {
    return config.domain.testing;
  }
  return config.domain.development;
}


const codeMessage = {
  200: '服务器成功返回请求的数据',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据,的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时',
};
export function dealErrorData(data, code) {
  const { errors } = data;
  let msg = '网络异常';
  if (code === 422) {
    const errs = [];
    if (errors) {
      for (const key in errors) {
        if (key) {
          errs.push(errors[key][0]);
        }
      }
      [msg] = errs;
    }
  } else {
    msg = codeMessage[code];
  }
  Toast.fail(msg);
  return msg;
}

/**
 * 过滤接口数据
 * @param {*} data
 * @param {*} okMsg 是否显示一个操作成功的提示
 */
export function filterData(data, okMsg) {
  if (data.code && data.code === 200) {
    if (okMsg === true) {
      Toast.success('操作成功', 1);
    }
    return data.results;
  }
  dealErrorData(data);
  return false;
}

export function analyzePath(pathname, i) {
  let path = pathname;
  if (pathname.indexOf('/') === 0) {
    path = pathname.substr(1);
  }
  const routes = path.split('/');

  return routes[i];
}
