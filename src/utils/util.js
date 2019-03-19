

/* eslint-disable */
import { Toast } from 'antd-mobile';
import moment from 'moment'
import 'moment/locale/zh-cn'
import * as dd from 'dingtalk-jsapi';

import district from '../../public/district.js'

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
  const { errors, message } = data;
  console.log('errors', errors, code)
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
  }
  else if (message) {
    msg = message
  }
  else {
    msg = codeMessage[code];
  }
  // console.log('msg', msg)
  Toast.fail(msg);
  if (code === 404) {
    location.replace('/error')
  }
  if (code === 500) {
    location.replace('/500')
  }
  if (code === 503) {
    location.replace('/503')
  }
  if (code === 400) {
    location.replace('/400')
  }
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
  if (new Date((str || '').replace(/-/g, '/')).toDateString() === new Date().toDateString()) {
    // 今天
    iscurrentDay = true;
  }
  return iscurrentDay;
}

export function isSameWeek(old, now) {
  var oneDayTime = 1000 * 60 * 60 * 24;
  var old_count = parseInt(old.getTime() / oneDayTime);
  var now_other = parseInt(now.getTime() / oneDayTime);
  return parseInt((old_count + 4) / 7) == parseInt((now_other + 4) / 7);
}

export function converseTime(time) {
  const current = time || '';
  if (isToday(current)) {
    return moment(current).format('HH:mm');
  }
  else if (isSameWeek(new Date(current.replace(/-/g, '/')), new Date())) {
    return moment(current).format('dddd HH:mm')
  }
  else {
    return current
  }
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

export function isString(str) {
  return (typeof str == 'string') && str.constructor == String;
}
export function isObject(obj) {
  return obj instanceof Object
}

export function initFormdata(source, editableform) {
  const formdata = editableform.map(item => {
    // const formatStr = formatDate(item.type);
    // const currentValue = isJSON(source[item.key]);
    // let value = currentValue;
    const value = source[item.key]
    // if (item.type === 'time') {
    //   const nowTime = moment().format(formatStr);
    //   value = moment(`2018-01-01 ${currentValue || nowTime}`).format(formatStr);
    // }
    // if (item.type === 'date' || item.type === 'datetime') {
    //   if (currentValue) {
    //     value = moment(currentValue).format(formatStr);
    //   } else {
    //     value = moment().format(formatStr);
    //   }
    // }
    const obj = {
      key: item.key,
      value,
      hasError: false,
      msg: '',
    };
    return obj
  })
  return formdata;
}

export function isableSubmit(requiredForm, formdata) {
  const newFormData = {};
  (formdata || []).forEach((item) => {
    const { key, value } = item;
    newFormData[key] = value;
  });
  let ableSubmit = true;
  const requireKey = requiredForm.map(item => item.key);
  for (let i = 0; i < requireKey.length; i += 1) {
    const key = requireKey[i];
    const value = newFormData[key];
    ableSubmit = judgeIsNothing(value)
    if (!ableSubmit) {
      break;
    }
  }
  return ableSubmit;
}


export function judgeIsNothing(value) {
  let ableSubmit = true;
  if (!value) {
    ableSubmit = false;
  } else if (isArray(value) && !value.length) {
    ableSubmit = false;
  } else if (isObject(value) && JSON.stringify(value) === '{}') {
    ableSubmit = false;
  }
  return ableSubmit
}



export function dealGridData(gridformdata) {
  // 整理列表控件数据
  const formgridObj = {};
  gridformdata.forEach((item) => {
    const { fields } = item;
    const forgridArr = fields.map((its) => {
      const obj = {};
      its.forEach((it) => {
        obj[it.key] = it.value;
      });
      return obj;
    });
    formgridObj[item.key] = [...forgridArr];
  });
  return formgridObj;
}


export function judgeGridSubmit(required, formdata) {
  let ableSubmit = true;
  for (let i = 0; i < required.length; i += 1) {
    const item = required[i];
    const { key } = item;
    const value = formdata[key];
    if (!judgeIsNothing(value)) {
      ableSubmit = false;
      break;
    }
  }
  return ableSubmit;
}

export function makeGridItemData(currentGridData, gridItem) {
  const gridFields = gridItem.fields;
  const dataList = (currentGridData ? currentGridData.fields : []).map((item, i) => {
    let value0 = `${gridItem.name}${i + 1}`;
    const newObj = {
      value_0: value0,
    };
    let num = 0;
    item.forEach((its) => { // 取前三个字段
      const [fieldsItem] = gridFields.filter(_ => {
        return _.key === its.key
      });
      const { type } = fieldsItem || {};
      if (num < 3 && type !== 'file' && fieldsItem) {
        const { value } = its;
        const multiple = fieldsItem.is_checkbox;
        newObj[`value_${num}`] = renderGridValue(value, type, multiple) || (num === 0 ? value0 : '');

        num += 1;
      }
    });
    return newObj;
  });
  return dataList;
}

export function renderGridValue(value, type, multiple) {
  let text = '';
  if (type === 'text' || type === 'int' || type === 'time' || type === 'datetime' || type === 'date') {
    text = value;
  }
  if (type === 'select') {
    if (!multiple) {
      text = value
    }
    else {
      text = (value || []).map(item => `${item}、`)
    }
  }
  if (type === 'staff' || type === 'department' || type === 'shop') {
    if (multiple) {
      text = (value || []).map(item => item.text).join('、')
    }
    else {
      text = (value || {}).text
    }
  }
  if (type === 'array') {
    text = (value || []).join('、')
  }
  if (type === 'region') {
    const pId = value.province_id;
    const cId = value.city_id;
    const aId = value.county_id;
    const detail = value.address;
    text = analyzeRegincode(pId, cId, aId, detail);
  }
  return text;
}

export function analyzeRegincode(province, city, area, detail) {
  let [regin] = district.filter(item => `${item.id}` === `${area || city || province}`);
  const address = `${(regin || {}).full_name || ''}${detail || ''}`;
  return address;
}

export function dealCheckAll(selects, snArr, name, selectAll, source, max) {
  const selected = { ...selects }
  const { data } = selects;
  if (selectAll) {
    const newData = [...data, ...source];
    const result = [];
    const obj = {};
    for (let i = 0; i < newData.length; i += 1) {
      if (!obj[newData[i][name]]) { // 如果能查找到，证明数组元素重复了
        obj[newData[i][name]] = 1;
        result.push(newData[i]);
      }
    }
    selected.data = result;
    selected.num = result.length;
  } else {
    const newData = data.filter(item => snArr.indexOf(item[name]) === -1);
    selected.data = newData;
    selected.num = newData.length;
  }
  selected.total = max || 50;
  return selected
}

String.prototype.trim = function () {
  return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

export function scrollToAnchor(anchorName) {
  if (anchorName) {
    // 找到锚点
    const anchorElement = document.getElementById(anchorName);
    // 如果对应id的锚点存在，就跳转到锚点
    if (anchorElement) { anchorElement.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  }
}

export function getScrollTop() {
  var scrollTop = 0;
  if (document.documentElement && document.documentElement.scrollTop) {
    scrollTop = document.documentElement.scrollTop;
  } else if (document.body) {
    scrollTop = document.body.scrollTop;
  }
  return scrollTop;
}

export function setNavTitle(title,succb=()=>{},errcb=()=>{}){
  console.log(1)
//   dd.biz.navigation.setTitle({
//     title : title,//控制标题文本，空字符串表示显示默认文本
//     onSuccess : function(result) {
//       succb(result);
//     },
//     onFail : function(err) {
//       errcb(err);
//     }
// });
}