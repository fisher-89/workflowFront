

/* eslint-disable */
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

export function isArray(o) {
  return Object.prototype.toString.call(o) === '[object Array]';
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

export function makerFilters(params) {
  const { filters } = { ...params };
  let newFilters = '';
  if (filters) {
    newFilters = dotWheresValue(filters);
  }
  return {
    ...params,
    filters: newFilters,
  };
}

const whereConfig = {
  like: '~',
  min: '>=',
  max: '<=',
  lt: '<',
  gt: '>',
  in: '=',
};

export function dotWheresValue(fields) {
  let fieldsWhere = '';
  Object.keys(fields || {}).forEach((key) => {
    const name = key;
    if (typeof fields[key] === 'object') {
      Object.keys(fields[key]).forEach((i) => {
        let value = fields[key][i];
        if (Array.isArray(value) && value.length > 0) {
          value = value.length > 1 ? `[${value}]` : value[0];
        }
        if ((value && value.length) || (typeof value === 'number')) {
          fieldsWhere += `${name}${whereConfig[i]}${value};`;
        }
      });
    } else if (fields[key]) {
      fieldsWhere += `${name}=${fields[key]};`;
    }
  });
  return fieldsWhere;
}

export function doConditionValue(str = '') {
  // const str = 'point_a>=1;point_a<=10;point_b>=1;
  // point_b<=10;changed_at>=2018-07-25;changed_at<=2018-07;';
  let arr = (str || '').split(';');
  const obj = {};

  for (let i = 0; i < arr.length; i += 1) {
    const item = arr[i];
    const keys = Object.keys(whereConfig);
    for (let j = 0; j < keys.length; j += 1) {
      const key = keys[j];
      const name = whereConfig[key];
      if (item.indexOf(name) > -1) {
        const itemArr = item.split(name);
        if (itemArr.length === 2) {
          const objValue = {};
          const [a, b] = itemArr;
          const reg = /^\[.*\]$/;
          if (reg.test(b)) {
            objValue[key] = JSON.parse(b);
          } else {
            objValue[key] = b;
          }
          obj[a] = { ...obj[a] || {}, ...objValue };
          if (i === arr.length) {
            arr = [...arr.slice(1)];
          }
          break;
        }
      }
    }
  }
  return obj;
}

export function getUrlParams(url) {
  const d = decodeURIComponent;
  let queryString = url ? url.split('?')[1] : window.location.search.slice(1);
  const obj = {};
  if (queryString) {
    queryString = queryString.split('#')[0]; // eslint-disable-line
    const arr = queryString.split('&');
    for (let i = 0; i < arr.length; i += 1) {
      const a = arr[i].split('=');
      let paramNum;
      const paramName = a[0].replace(/\[\d*\]/, (v) => {
        paramNum = v.slice(1, -1);
        return '';
      });
      const paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
      if (obj[paramName]) {
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = d([obj[paramName]]);
        }
        if (typeof paramNum === 'undefined') {
          obj[paramName].push(d(paramValue));
        } else {
          obj[paramName][paramNum] = d(paramValue);
        }
      } else {
        obj[paramName] = d(paramValue);
      }
    }
  }
  return obj;
}

/**
* 获取url参数对象
* @param {参数名称} name
*/
export function getUrlString(name, url) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = (url || window.location.search.substr(1)).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

export function parseParamsToUrl(params) {
  let url = '';
  const strArr = [];
  Object.keys(params).forEach((key) => {
    const str = `${key}=${params[key]}`;
    strArr.push(str);
  });
  url = strArr.join('&');
  return url;
}


// 找到相应元素的下标
export const findInitIndex = (arr, key, value) => {
  let index = 0;
  for (let j = 0; j < arr.length; j += 1) {
    if (arr[j][key] === value) {
      index = j;
      break;
    }
  }
  return index;
};

export function evil(fn) {
  const Fn = Function; // 一个变量指向Function，防止有些前端编译工具报错

  return new Fn(`return ${fn}`)();
}


export function excludeSpecial(s) {
  // 去掉转义字符
  let str = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
  // 去掉特殊字符
  str = str.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]]/);
  return str;
}

export function formatDate(type) {
  switch (type) {
    case 'date': return 'YYYY-MM-DD';
    case 'time': return 'HH:mm:ss';
    case 'datetime': return 'YYYY-MM-DD HH:mm:ss';
    default: return 'YYYY-MM-DD'
  }
}

export function isToday(str) {
  let iscurrentDay = false;
  if (new Date(str).toDateString() === new Date().toDateString()) {
    // 今天
    iscurrentDay = true;
  }
  return iscurrentDay;
}

export function isJSON(str) {
  try {
    const obj = JSON.parse(str);
    if (typeof obj === 'object' && obj) {
      return obj
    }
    else { return '' }
  }
  catch (e) {
    return ''
  }
}

export function markTreeData(data, pid = null, { parentId, key }) {
  const tree = [];
  data.forEach((item) => {
    if (`${item[parentId]}` === `${pid}`) {
      const temp = {
        ...item,
        key: `${item[key]}`,
      };
      const children = markTreeData(data, item[key], { parentId, key });
      if (children.length > 0) {
        temp.children = children;
      }
      tree.push(temp);
    }
  });
  return tree;
}

export function getOriginTree(item) {
  const origin = [];
  backTreeOrigin(item, origin);
  function backTreeOrigin(item) {
    const temp = { ...item };
    delete temp.children;
    origin.push(temp);
    const children = item.children
    if (children && children.length) {
      children.forEach(its => {
        backTreeOrigin(its)
      })
    }
  }
  return origin;
}



// export function backTreeOrigin(data, pid = null) {
//   const origin = [];
//   data.forEach((item) => {
//     const temp = { ...item };
//     const { children } = temp;
//     delete temp.children;
//     origin.push(item);
//     if (children) {
//       const childrenData = backTreeOrigin(children, pid);
//       origin.push(childrenData);
//     }
//   });
//   return origin;
// }

// 数组去重

Array.prototype.unique = function (name = "id") {
  const result = this;
  const newData = [];
  const obj = {};
  for (let i = 0; i < result.length; i += 1) {
    if (!obj[result[i][name]]) { // 如果能查找到，证明数组元素重复了
      obj[result[i][name]] = 1;
      newData.push(result[i]);
    }
  }
  return newData
}

export function initCurrentObj(v, item) {
  const { key } = item;
  const obj = {
    key,
    value: v,
    hasError: false,
    msg: '',
  };
  return { ...obj };
}

export function makeFieldValue(value, name, multiple = false, include = false) {
  const keys = Object.keys(name);
  if (multiple) {
    const newValue = value.map(item => {
      return getFieldValue(item, keys, name, include)
    })
    return newValue;
  }
  const newValue = getFieldValue(value, keys, name, include)
  return newValue;
}

export function getFieldValue(value, keys, name, include) {
  let newValue = {};
  if (include) {
    newValue = { ...value }
  }
  keys.forEach(key => {
    const newKey = name[key];
    delete newValue[key];
    newValue[newKey] = value[key]
  })
  return newValue
}

export function makeBreadCrumbData(params, bread, name) {
  let newBread = [...bread];
  let splitIndex = null;
  newBread.forEach((item, index) => {
    if (item[name] === params[name]) {
      splitIndex = index + 1;
    }
  });
  if (splitIndex !== null) {
    newBread = newBread.slice(0, splitIndex);
  } else {
    newBread.push(params);
  }
  return newBread;
}