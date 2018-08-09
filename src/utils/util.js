import {
  Toast,
} from 'antd-mobile';

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

export function userStorage(key) {
  const info = localStorage[key];
  const newInfo = JSON.parse(info === undefined ? '{}' : info);
  return newInfo;
}

export function dealFlowTypeOptions(list) {
  const option = list.map((item) => {
    const obj = {};
    obj.label = item.name;
    obj.value = item.id;
    return obj;
  });
  return option;
}

export function parseParams(url) {
  const keyValue = url.split('&');
  const obj = {};
  keyValue.forEach((item) => {
    const arr = [];
    const i = item.indexOf('=');
    if (i > -1 && i < item.length - 1) {
      arr[0] = item.slice(0, i);
      arr[1] = item.slice(i + 1);
    }

    if (arr && arr.length === 2) {
      const [key, value] = arr;
      obj[key] = value;
    }
  });
  return obj;
}
